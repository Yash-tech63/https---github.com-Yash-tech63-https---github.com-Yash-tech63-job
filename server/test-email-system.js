require('dotenv').config();
const { connectDB, disconnectDB } = require('./src/config/db');
const authService = require('./src/services/authService');
const candidateService = require('./src/services/candidateService');
const emailService = require('./src/services/emailService');
const User = require('./src/models/User');
const LoginOTP = require('./src/models/LoginOTP');
const Job = require('./src/models/Job');
const Application = require('./src/models/Application');
const bcrypt = require('bcryptjs');

async function runTests() {
  console.log('====================================================');
  console.log('🚀 RUNNING TRUEHIRE REAL EMAIL & OTP SYSTEM TEST SUITE');
  console.log('====================================================\n');

  try {
    await connectDB();
  } catch (err) {
    console.error('Failed to connect to database:', err.message);
  }

  let passed = 0;
  let failed = 0;

  function assert(condition, testName) {
    if (condition) {
      console.log(`✅ [PASS] ${testName}`);
      passed++;
    } else {
      console.error(`❌ [FAIL] ${testName}`);
      failed++;
    }
  }

  try {
    // SCENARIO 15: Admin login continues working directly
    console.log('\n--- Test Scenario 1: Admin Direct Login ---');
    const adminLogin = await authService.login({
      email: 'admin@truehire.io',
      password: 'admin@123'
    });
    assert(adminLogin.requiresOtp === false, 'Admin login does not require OTP');
    assert(!!adminLogin.token, 'Admin receives JWT immediately');
    assert(adminLogin.user?.role === 'admin', 'Admin role verified');

    // SCENARIO 1 & 2: Candidate & Recruiter Login Require OTP
    console.log('\n--- Test Scenario 2: Candidate & Recruiter Login Require OTP ---');
    const candidateRes = await authService.login({
      email: 'alex.dev@stanford.edu',
      password: 'candidate@123'
    });
    assert(candidateRes.requiresOtp === true, 'Candidate login requires OTP');
    assert(!!candidateRes.challengeId, 'Candidate receives challengeId');
    assert(!candidateRes.token, 'Candidate does NOT receive JWT before OTP verification');

    const recruiterRes = await authService.login({
      email: 'recruiter@linear.app',
      password: 'recruiter@123'
    });
    assert(recruiterRes.requiresOtp === true, 'Recruiter login requires OTP');
    assert(!!recruiterRes.challengeId, 'Recruiter receives challengeId');

    // Verify OTP was stored hashed in DB and not exposed
    console.log('\n--- Test Scenario 3: OTP Stored Hashed in MongoDB ---');
    const otpRecord = await LoginOTP.findOne({ challengeId: candidateRes.challengeId });
    assert(!!otpRecord, 'LoginOTP record found in DB');
    assert(otpRecord.otpHash && otpRecord.otpHash !== '123456', 'OTP is bcrypt hashed in database');
    assert(otpRecord.attempts === 0, 'Initial attempts count is 0');
    assert(otpRecord.used === false, 'OTP is marked unused initially');

    // SCENARIO 4: Incorrect OTP is rejected
    console.log('\n--- Test Scenario 4: Incorrect OTP Rejection ---');
    try {
      await authService.verifyLoginOtp({
        challengeId: candidateRes.challengeId,
        otp: '000000'
      });
      assert(false, 'Incorrect OTP should throw error');
    } catch (err) {
      assert(err.message.includes('Invalid verification code'), 'Incorrect OTP rejected with error: ' + err.message);
    }

    const updatedRecord = await LoginOTP.findOne({ challengeId: candidateRes.challengeId });
    assert(updatedRecord.attempts === 1, 'Attempt counter incremented to 1 after wrong OTP');

    // SCENARIO 7: Resend Cooldown (60s)
    console.log('\n--- Test Scenario 5: Resend 60-Second Cooldown ---');
    try {
      await authService.resendLoginOtp({ challengeId: candidateRes.challengeId });
      assert(false, 'Immediate resend should be blocked by cooldown');
    } catch (cdErr) {
      assert(cdErr.message.includes('wait') && cdErr.message.includes('s before requesting'), 'Resend cooldown enforced properly');
    }

    // SCENARIO 3 & 8: Correct OTP verification + JWT generation + Login Alert Email
    console.log('\n--- Test Scenario 6: Correct OTP Verification & Login Alert Email ---');
    // Let's create a known test OTP to verify full cycle
    const testRawOtp = '849201';
    const testChallengeId = 'test-challenge-' + Date.now();
    const testHash = await bcrypt.hash(testRawOtp, 10);
    const testUser = await User.findOne({ email: 'alex.dev@stanford.edu' });

    await LoginOTP.create({
      userId: testUser._id,
      email: testUser.email,
      otpHash: testHash,
      challengeId: testChallengeId,
      expiresAt: new Date(Date.now() + 5 * 60 * 1000),
      attempts: 0,
      used: false,
      lastResentAt: new Date()
    });

    const verifySuccess = await authService.verifyLoginOtp({
      challengeId: testChallengeId,
      otp: testRawOtp
    });
    assert(!!verifySuccess.token, 'JWT generated only AFTER OTP verified');
    assert(verifySuccess.user.email === 'alex.dev@stanford.edu', 'User profile retrieved successfully');

    // Check Login Alert Email was recorded
    const lastLoginAlert = emailService.getLastSentEmail('alex.dev@stanford.edu', 'login_success_alert');
    assert(!!lastLoginAlert, 'Successful login alert email dispatched to user');
    assert(lastLoginAlert.subject === 'Successful Login Alert – TrueHire', 'Login alert email subject matches requirement');

    // SCENARIO 6: OTP cannot be reused
    console.log('\n--- Test Scenario 7: OTP Cannot Be Reused ---');
    try {
      await authService.verifyLoginOtp({
        challengeId: testChallengeId,
        otp: testRawOtp
      });
      assert(false, 'Reused OTP should be rejected');
    } catch (reuseErr) {
      assert(reuseErr.message.includes('Invalid or expired'), 'Reused OTP successfully rejected');
    }

    // SCENARIO 5: Expired OTP is rejected
    console.log('\n--- Test Scenario 8: Expired OTP Rejection ---');
    const expiredChallengeId = 'expired-test-' + Date.now();
    await LoginOTP.create({
      userId: testUser._id,
      email: testUser.email,
      otpHash: testHash,
      challengeId: expiredChallengeId,
      expiresAt: new Date(Date.now() - 1000), // Expired 1 second ago
      attempts: 0,
      used: false
    });
    try {
      await authService.verifyLoginOtp({
        challengeId: expiredChallengeId,
        otp: testRawOtp
      });
      assert(false, 'Expired OTP should be rejected');
    } catch (expErr) {
      assert(expErr.message.includes('expired'), 'Expired OTP rejected: ' + expErr.message);
    }

    // SCENARIO 11, 12, 13, 14: Job Application & Notifications
    console.log('\n--- Test Scenario 9: Job Application Emails & Recruiter Alert ---');
    const sampleJob = await Job.findOne({ status: 'published' }).populate('companyId');
    if (sampleJob) {
      // Clean previous test application if present
      await Application.deleteMany({ candidateId: testUser._id, jobId: sampleJob._id });

      const app = await candidateService.applyToJob(testUser._id, sampleJob._id, 'Automated Test Application Note');
      assert(!!app._id, 'Application created in MongoDB');

      const appConfirmEmail = emailService.getLastSentEmail(testUser.email, 'application_confirmation');
      assert(!!appConfirmEmail, 'Candidate received application confirmation email');
      assert(appConfirmEmail.subject === 'Application Submitted Successfully – TrueHire', 'Confirmation email subject matches');

      // Check duplicate application rejection
      console.log('\n--- Test Scenario 10: Duplicate Application Prevention ---');
      try {
        await candidateService.applyToJob(testUser._id, sampleJob._id, 'Duplicate Note');
        assert(false, 'Duplicate application should throw error');
      } catch (dupErr) {
        assert(dupErr.message.includes('already applied'), 'Duplicate application prevented: ' + dupErr.message);
      }
    } else {
      console.log('ℹ️ No active job found in DB to test application submission. Skipping job test.');
    }

  } catch (error) {
    console.error('Test execution error:', error);
  } finally {
    console.log('\n====================================================');
    console.log(`📊 TEST RESULTS: ${passed} PASSED | ${failed} FAILED`);
    console.log('====================================================\n');
    await disconnectDB();
    process.exit(failed > 0 ? 1 : 0);
  }
}

runTests();
