const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const mongoose = require('mongoose');
const User = require('../models/User');
const CandidateProfile = require('../models/CandidateProfile');
const Company = require('../models/Company');
const LoginOTP = require('../models/LoginOTP');
const Otp = require('../models/Otp');
const emailService = require('./emailService');
const { generateToken } = require('../utils/jwtToken');

class AuthService {
  constructor() {
    this.loginOtpMemoryStore = new Map();
    this.otpMemoryStore = new Map();
    this.resetCodes = new Map();
  }

  async register({ email, password, role, name, companyName }) {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new Error('An account with this email address already exists');
    }

    if (role === 'admin') {
      throw new Error('Admin registration is not publicly accessible');
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const user = await User.create({
      email,
      passwordHash,
      role
    });

    // Create corresponding profile
    if (role === 'candidate') {
      await CandidateProfile.create({
        userId: user._id,
        name: name || email.split('@')[0],
        profileComplete: false
      });
    } else if (role === 'recruiter') {
      await Company.create({
        ownerUserId: user._id,
        name: companyName || `${email.split('@')[0]}'s Organization`,
        verificationStatus: 'pending'
      });
    }

    const token = generateToken({ id: user._id, role: user.role });

    return {
      user: {
        id: user._id,
        email: user.email,
        role: user.role
      },
      token
    };
  }

  /**
   * Primary Login handler
   * - Admin: Logs in directly with credentials
   * - Candidate & Recruiter: Triggers secure 6-digit OTP dispatched via Gmail SMTP
   */
  async login({ email, password, expectedRole }) {
    const user = await User.findOne({ email });
    if (!user) {
      throw new Error('Invalid email or password');
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      throw new Error('Invalid email or password');
    }

    // Role-based validation on the backend
    if (expectedRole && user.role !== expectedRole) {
      if (expectedRole === 'admin') {
        throw new Error('Access denied: Authorized administrator accounts only.');
      } else if (expectedRole === 'recruiter') {
        if (user.role === 'candidate') {
          throw new Error('This account is registered as a candidate. Please use the Candidate Login.');
        } else if (user.role === 'admin') {
          throw new Error('This is an administrator account. Please use the Admin Login.');
        } else {
          throw new Error('Unauthorized role for Recruiter Login.');
        }
      } else if (expectedRole === 'candidate') {
        if (user.role === 'recruiter') {
          throw new Error('This account is registered as a recruiter. Please use the Recruiter Login.');
        } else if (user.role === 'admin') {
          throw new Error('This is an administrator account. Please use the Admin Login.');
        } else {
          throw new Error('Unauthorized role for Candidate Login.');
        }
      } else {
        throw new Error(`Unauthorized: Account role (${user.role}) does not match portal role.`);
      }
    }

    // Admin login continues working with existing authentication rules
    if (user.role === 'admin') {
      const token = generateToken({ id: user._id, role: user.role });
      return {
        requiresOtp: false,
        user: {
          id: user._id,
          email: user.email,
          role: user.role
        },
        token
      };
    }

    // Candidate and Recruiter must both verify via real Email OTP
    // 1. Generate cryptographically secure 6-digit OTP
    const rawOtp = crypto.randomInt(100000, 1000000).toString();
    const challengeId = crypto.randomUUID ? crypto.randomUUID() : crypto.randomBytes(16).toString('hex');
    const otpHash = await bcrypt.hash(rawOtp, 10);
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

    const isDbConnected = mongoose.connection && mongoose.connection.readyState === 1;

    // 2. Invalidate previous pending LoginOTPs for this user
    if (isDbConnected) {
      try {
        await LoginOTP.updateMany(
          { userId: user._id, used: false },
          { used: true }
        );
        await LoginOTP.create({
          userId: user._id,
          email: user.email,
          otpHash,
          challengeId,
          expiresAt,
          attempts: 0,
          used: false,
          lastResentAt: new Date()
        });
      } catch (dbErr) {
        console.warn('[AuthService] Could not persist LoginOTP in DB:', dbErr.message);
      }
    }

    // In-memory backup for high-availability test environments
    this.loginOtpMemoryStore.set(challengeId, {
      userId: user._id.toString(),
      email: user.email,
      otpHash,
      challengeId,
      expiresAt: expiresAt.getTime(),
      attempts: 0,
      used: false,
      lastResentAt: Date.now()
    });

    // 3. Resolve user display name
    let userName = user.email.split('@')[0];
    if (isDbConnected) {
      try {
        if (user.role === 'candidate') {
          const profile = await CandidateProfile.findOne({ userId: user._id });
          if (profile && profile.name) userName = profile.name;
        } else if (user.role === 'recruiter') {
          const company = await Company.findOne({ ownerUserId: user._id });
          if (company && company.name) userName = company.name;
        }
      } catch (err) {}
    }

    // 4. Send real OTP email via Gmail SMTP
    await emailService.sendLoginOTP(user.email, rawOtp, userName);

    // 5. Return temporary challenge ID. Do not generate JWT yet.
    return {
      requiresOtp: true,
      challengeId,
      email: user.email,
      role: user.role,
      message: 'A 6-digit login verification code has been dispatched to your email.'
    };
  }

  /**
   * Verify Login OTP and generate JWT on success
   */
  async verifyLoginOtp({ challengeId, otp, expectedRole }) {
    if (!challengeId || !otp) {
      throw new Error('Challenge ID and 6-digit OTP code are required');
    }

    const cleanOtp = String(otp).trim();
    const isDbConnected = mongoose.connection && mongoose.connection.readyState === 1;

    let otpRecord = null;
    if (isDbConnected) {
      try {
        otpRecord = await LoginOTP.findOne({ challengeId });
      } catch (e) {}
    }

    // Check memory store fallback if DB returned null
    if (!otpRecord && this.loginOtpMemoryStore.has(challengeId)) {
      otpRecord = this.loginOtpMemoryStore.get(challengeId);
    }

    if (!otpRecord || otpRecord.used) {
      throw new Error('Invalid or expired verification session. Please sign in again.');
    }

    // Check expiry (5 minutes)
    const expiresAtTime = otpRecord.expiresAt instanceof Date ? otpRecord.expiresAt.getTime() : otpRecord.expiresAt;
    if (Date.now() > expiresAtTime) {
      throw new Error('Verification code has expired. Please request a new code.');
    }

    // Check maximum attempts (5 attempts limit)
    if (otpRecord.attempts >= 5) {
      otpRecord.used = true;
      if (otpRecord.save) await otpRecord.save();
      throw new Error('Maximum verification attempts exceeded. Please initiate a new login.');
    }

    // Verify OTP hash with bcrypt
    const isMatch = await bcrypt.compare(cleanOtp, otpRecord.otpHash);
    if (!isMatch) {
      otpRecord.attempts = (otpRecord.attempts || 0) + 1;
      if (otpRecord.save) await otpRecord.save();
      const remaining = 5 - otpRecord.attempts;
      if (remaining <= 0) {
        otpRecord.used = true;
        if (otpRecord.save) await otpRecord.save();
        throw new Error('Invalid verification code. Maximum attempts reached. Please log in again.');
      }
      throw new Error(`Invalid verification code. ${remaining} attempt${remaining === 1 ? '' : 's'} remaining.`);
    }

    // Successful Verification:
    otpRecord.used = true;
    otpRecord.verifiedAt = new Date();
    if (otpRecord.save) await otpRecord.save();

    // Fetch user
    const user = await User.findById(otpRecord.userId);
    if (!user) {
      throw new Error('User record not found');
    }

    // Backend role verification
    if (expectedRole && user.role !== expectedRole) {
      throw new Error(`Access denied: Verified role (${user.role}) does not match portal role (${expectedRole}).`);
    }

    // Fetch role details
    let extraData = {};
    let displayName = user.email.split('@')[0];
    if (user.role === 'candidate') {
      const profile = await CandidateProfile.findOne({ userId: user._id });
      extraData.profile = profile;
      if (profile && profile.name) displayName = profile.name;
    } else if (user.role === 'recruiter') {
      const company = await Company.findOne({ ownerUserId: user._id });
      extraData.company = company;
      if (company && company.name) displayName = company.name;
    }

    // Generate JWT ONLY after successful OTP verification
    const token = generateToken({ id: user._id, role: user.role });

    // Send Successful Login Email Alert Notification
    try {
      await emailService.sendLoginSuccessNotification({
        name: displayName,
        email: user.email,
        role: user.role
      });
    } catch (notifyErr) {
      console.warn('[AuthService] Login success notification email warning:', notifyErr.message);
    }

    return {
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
        ...extraData
      },
      token
    };
  }

  /**
   * Resend Login OTP with 60s cooldown and old OTP invalidation
   */
  async resendLoginOtp({ challengeId }) {
    if (!challengeId) {
      throw new Error('Challenge ID is required to resend OTP');
    }

    const isDbConnected = mongoose.connection && mongoose.connection.readyState === 1;

    let otpRecord = null;
    if (isDbConnected) {
      try {
        otpRecord = await LoginOTP.findOne({ challengeId });
      } catch (e) {}
    }

    if (!otpRecord && this.loginOtpMemoryStore.has(challengeId)) {
      otpRecord = this.loginOtpMemoryStore.get(challengeId);
    }

    if (!otpRecord || otpRecord.used) {
      throw new Error('Invalid or expired login session. Please sign in again.');
    }

    // Check 60-second cooldown
    const lastResentTime = otpRecord.lastResentAt instanceof Date ? otpRecord.lastResentAt.getTime() : (otpRecord.lastResentAt || 0);
    const elapsed = Date.now() - lastResentTime;
    if (elapsed < 60000) {
      const remainingSec = Math.ceil((60000 - elapsed) / 1000);
      const cooldownError = new Error(`Please wait ${remainingSec}s before requesting a new code.`);
      cooldownError.statusCode = 429;
      throw cooldownError;
    }

    // Invalidate old OTP
    otpRecord.used = true;
    if (otpRecord.save) await otpRecord.save();

    // Generate new OTP & new challengeId
    const newRawOtp = crypto.randomInt(100000, 1000000).toString();
    const newChallengeId = crypto.randomUUID ? crypto.randomUUID() : crypto.randomBytes(16).toString('hex');
    const newOtpHash = await bcrypt.hash(newRawOtp, 10);
    const newExpiresAt = new Date(Date.now() + 5 * 60 * 1000);

    if (isDbConnected) {
      try {
        await LoginOTP.create({
          userId: otpRecord.userId,
          email: otpRecord.email,
          otpHash: newOtpHash,
          challengeId: newChallengeId,
          expiresAt: newExpiresAt,
          attempts: 0,
          used: false,
          lastResentAt: new Date()
        });
      } catch (err) {}
    }

    this.loginOtpMemoryStore.set(newChallengeId, {
      userId: otpRecord.userId.toString(),
      email: otpRecord.email,
      otpHash: newOtpHash,
      challengeId: newChallengeId,
      expiresAt: newExpiresAt.getTime(),
      attempts: 0,
      used: false,
      lastResentAt: Date.now()
    });

    // Lookup user name
    let userName = otpRecord.email.split('@')[0];
    if (isDbConnected) {
      try {
        const user = await User.findById(otpRecord.userId);
        if (user && user.role === 'candidate') {
          const profile = await CandidateProfile.findOne({ userId: user._id });
          if (profile?.name) userName = profile.name;
        } else if (user && user.role === 'recruiter') {
          const company = await Company.findOne({ ownerUserId: user._id });
          if (company?.name) userName = company.name;
        }
      } catch (e) {}
    }

    // Send new OTP email
    await emailService.sendLoginOTP(otpRecord.email, newRawOtp, userName);

    return {
      challengeId: newChallengeId,
      email: otpRecord.email,
      message: 'A new 6-digit verification code has been dispatched to your email.'
    };
  }

  async getCurrentUser(userId) {
    const user = await User.findById(userId).select('-passwordHash');
    if (!user) {
      throw new Error('User not found');
    }

    let profileData = null;
    let companyData = null;

    if (user.role === 'candidate') {
      profileData = await CandidateProfile.findOne({ userId });
    } else if (user.role === 'recruiter') {
      companyData = await Company.findOne({ ownerUserId: userId });
    }

    return {
      ...user.toObject(),
      profile: profileData,
      company: companyData
    };
  }

  /**
   * Request password reset code
   */
  async forgotPassword({ email }) {
    if (!email) {
      throw new Error('Email address is required');
    }
    const cleanEmail = email.toLowerCase().trim();
    const user = await User.findOne({ email: cleanEmail });
    if (!user) {
      // Return success message to avoid user enumeration while providing feedback
      return {
        success: true,
        message: 'If an account exists with this email address, a 6-digit reset code has been sent.'
      };
    }

    const resetCode = crypto.randomInt(100000, 1000000).toString();
    const resetHash = await bcrypt.hash(resetCode, 10);
    const expiresAt = Date.now() + 10 * 60 * 1000; // 10 minutes

    this.resetCodes.set(cleanEmail, {
      userId: user._id.toString(),
      email: cleanEmail,
      resetHash,
      expiresAt,
      attempts: 0
    });

    let userName = cleanEmail.split('@')[0];
    if (user.role === 'candidate') {
      const profile = await CandidateProfile.findOne({ userId: user._id });
      if (profile?.name) userName = profile.name;
    } else if (user.role === 'recruiter') {
      const company = await Company.findOne({ ownerUserId: user._id });
      if (company?.name) userName = company.name;
    }

    try {
      await emailService.sendPasswordResetEmail(cleanEmail, resetCode, userName);
    } catch (e) {
      console.warn('[AuthService] Could not send password reset email:', e.message);
    }

    return {
      success: true,
      message: 'A 6-digit password reset code has been sent to your email.'
    };
  }

  /**
   * Reset password with reset code
   */
  async resetPassword({ email, resetCode, newPassword }) {
    if (!email || !resetCode || !newPassword) {
      throw new Error('Email, reset code, and new password are required');
    }
    if (newPassword.length < 6) {
      throw new Error('Password must be at least 6 characters long');
    }
    const cleanEmail = email.toLowerCase().trim();
    const record = this.resetCodes.get(cleanEmail);
    if (!record) {
      throw new Error('No password reset requested or reset code expired. Please request a new code.');
    }
    if (Date.now() > record.expiresAt) {
      this.resetCodes.delete(cleanEmail);
      throw new Error('Reset code has expired. Please request a new code.');
    }
    if (record.attempts >= 5) {
      this.resetCodes.delete(cleanEmail);
      throw new Error('Too many failed attempts. Please request a new code.');
    }

    const isMatch = await bcrypt.compare(String(resetCode).trim(), record.resetHash);
    if (!isMatch) {
      record.attempts += 1;
      throw new Error('Invalid verification code.');
    }

    const user = await User.findOne({ email: cleanEmail });
    if (!user) {
      throw new Error('User not found.');
    }

    const salt = await bcrypt.genSalt(10);
    user.passwordHash = await bcrypt.hash(newPassword, salt);
    await user.save();

    this.resetCodes.delete(cleanEmail);

    return {
      success: true,
      message: 'Your password has been successfully reset. You may now log in.'
    };
  }
}

module.exports = new AuthService();
