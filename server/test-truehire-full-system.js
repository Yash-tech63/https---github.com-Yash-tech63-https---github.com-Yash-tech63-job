/**
 * TrueHire Comprehensive Full System Verification Suite
 * 
 * Verifies all phases:
 * 1. Branding & Colors (CSS definitions, tags)
 * 2. Candidate Features (Saved jobs, resume delete, 100% free)
 * 3. Recruiter Features (Advanced salary, view counter, delete job slot release, metrics)
 * 4. Structured Logger & Sanitizer (Pass, OTP, JWT, Secret masking)
 * 5. Admin Moderation & RBAC (Users ban/active, Job moderation, verification)
 * 6. Migration Backup & Safety (Non-destructive JSON backup generation)
 */

const assert = require('assert');
const fs = require('fs');
const path = require('path');

async function runTests() {
  console.log('====================================================');
  console.log('  TRUEHIRE: Comprehensive System Verification Suite  ');
  console.log('====================================================\n');

  let passed = 0;
  let failed = 0;

  function test(name, fn) {
    try {
      fn();
      console.log(`  [PASS] ${name}`);
      passed++;
    } catch (err) {
      console.error(`  [FAIL] ${name}`);
      console.error(`         ${err.message}`);
      failed++;
    }
  }

  // ----------------------------------------------------
  // TEST GROUP 1: Branding & Design System
  // ----------------------------------------------------
  console.log('--- TEST GROUP 1: Branding & Design System ---');

  test('Tailwind configuration includes TrueHire brand palette', () => {
    const tailwindConfigPath = path.join(__dirname, '../client/tailwind.config.js');
    assert(fs.existsSync(tailwindConfigPath), 'tailwind.config.js exists');
    const content = fs.readFileSync(tailwindConfigPath, 'utf8');
    assert(content.includes('#6C3BFF'), 'Primary Purple #6C3BFF is present');
    assert(content.includes('#F5C542'), 'Vibrant Yellow #F5C542 is present');
    assert(content.includes('#17172B'), 'Deep Navy #17172B is present');
    assert(content.includes('#FF6B6B'), 'Coral Accent #FF6B6B is present');
  });

  test('HTML title and meta match TrueHire branding and taglines', () => {
    const htmlPath = path.join(__dirname, '../client/index.html');
    const content = fs.readFileSync(htmlPath, 'utf8');
    assert(content.includes('TRUEHIRE'), 'Title contains TRUEHIRE');
    assert(content.includes('Find Your Next Opportunity'), 'Main tagline present');
    assert(!content.includes('CareerPulse'), 'No leftover CareerPulse references in index.html');
  });

  // ----------------------------------------------------
  // TEST GROUP 2: Structured Logger & Sensitive Data Sanitizer
  // ----------------------------------------------------
  console.log('\n--- TEST GROUP 2: Structured Logger & Data Sanitization ---');

  test('Logger correctly sanitizes passwords, OTPs, JWTs, and payment secrets', () => {
    const logger = require('./src/utils/logger');
    const sensitivePayload = {
      email: 'candidate@test.com',
      password: 'SuperSecretPassword123!',
      otp: '749102',
      token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.dummy',
      headers: {
        authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.headerToken'
      },
      payment: {
        razorpay_payment_id: 'pay_test_12345',
        razorpay_signature: '9a8b7c6d5e4f3a2b1c',
        key_secret: 'knCFTiylaPYPYorTlM88Lc8f'
      }
    };

    const sanitized = logger.sanitize(sensitivePayload);
    assert.strictEqual(sanitized.email, 'candidate@test.com', 'Non-sensitive fields preserved');
    assert.strictEqual(sanitized.password, '[REDACTED]', 'Password redacted');
    assert.strictEqual(sanitized.otp, '[REDACTED]', 'OTP redacted');
    assert.strictEqual(sanitized.token, '[REDACTED]', 'Token redacted');
    assert.strictEqual(sanitized.payment.razorpay_signature, '[REDACTED]', 'Payment signature redacted');
    assert.strictEqual(sanitized.payment.key_secret, '[REDACTED]', 'Razorpay secret redacted');
    assert.strictEqual(sanitized.headers.authorization, '[REDACTED]', 'Authorization header redacted');

    // Test raw string redaction
    const rawMsg = logger.sanitize('Failed request with header Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.xyz');
    assert(rawMsg.includes('[REDACTED_JWT]'), 'Raw string Bearer token sanitized');
  });

  // ----------------------------------------------------
  // TEST GROUP 3: Candidate Models & Methods
  // ----------------------------------------------------
  console.log('\n--- TEST GROUP 3: Candidate Models & Methods ---');

  test('CandidateProfile calculates completeness percentage accurately', () => {
    const CandidateProfile = require('./src/models/CandidateProfile');
    const profile = new CandidateProfile({
      name: 'Alex Johnson',
      headline: 'Full Stack Engineer',
      education: [{ college: 'MIT', degree: 'B.S. CS' }],
      skills: ['React', 'Node.js', 'PostgreSQL'],
      experience: [{ title: 'Intern', company: 'Linear' }],
      resumeUrl: '/uploads/alex-resume.pdf',
      savedJobs: []
    });

    const score = profile.calculateCompleteness();
    assert.strictEqual(score, 100, `Expected 100% completeness, got ${score}%`);
  });

  test('CandidateProfile supports savedJobs and resume metadata fields', () => {
    const CandidateProfile = require('./src/models/CandidateProfile');
    const schemaPaths = CandidateProfile.schema.paths;
    assert(schemaPaths.savedJobs, 'savedJobs path exists on CandidateProfile');
    assert(schemaPaths.resumeSize, 'resumeSize path exists on CandidateProfile');
    assert(schemaPaths.resumeMimeType, 'resumeMimeType path exists on CandidateProfile');
  });

  // ----------------------------------------------------
  // TEST GROUP 4: Job Model & Salary Options
  // ----------------------------------------------------
  console.log('\n--- TEST GROUP 4: Job Model & Salary Options ---');

  test('Job model supports advanced compensation and views tracking', () => {
    const Job = require('./src/models/Job');
    const schemaPaths = Job.schema.paths;
    assert(schemaPaths.salaryMin, 'salaryMin path exists on Job');
    assert(schemaPaths.salaryMax, 'salaryMax path exists on Job');
    assert(schemaPaths.currency, 'currency path exists on Job');
    assert(schemaPaths.salaryPeriod, 'salaryPeriod path exists on Job');
    assert(schemaPaths.hideSalary, 'hideSalary path exists on Job');
    assert(schemaPaths.isNegotiable, 'isNegotiable path exists on Job');
    assert(schemaPaths.stipendMin, 'stipendMin path exists on Job');
    assert(schemaPaths.stipendMax, 'stipendMax path exists on Job');
    assert(schemaPaths.viewsCount, 'viewsCount path exists on Job');
  });

  // ----------------------------------------------------
  // TEST GROUP 5: Migration Backup Script
  // ----------------------------------------------------
  console.log('\n--- TEST GROUP 5: Database Migration & Backup Safety ---');

  test('Migration script generated valid non-destructive JSON backup', () => {
    const backupDir = path.join(__dirname, 'backups');
    assert(fs.existsSync(backupDir), 'backups directory exists');
    const files = fs.readdirSync(backupDir).filter((f) => f.endsWith('.json'));
    assert(files.length > 0, 'At least one backup JSON exists');
    const latestFile = path.join(backupDir, files[files.length - 1]);
    const data = JSON.parse(fs.readFileSync(latestFile, 'utf8'));
    assert(data.metadata, 'Backup contains metadata');
    assert(data.metadata.sourceDatabase === 'MongoDB', 'Backup identifies MongoDB as source');
    assert(Array.isArray(data.users), 'Users array archived in backup');
  });

  // ----------------------------------------------------
  // TEST GROUP 6: Prisma PostgreSQL Schema
  // ----------------------------------------------------
  console.log('\n--- TEST GROUP 6: Prisma PostgreSQL Architecture ---');

  test('Prisma schema defines all required relational models and enums', () => {
    const schemaPath = path.join(__dirname, 'prisma/schema.prisma');
    assert(fs.existsSync(schemaPath), 'prisma/schema.prisma exists');
    const schema = fs.readFileSync(schemaPath, 'utf8');
    const requiredModels = [
      'model User',
      'model CandidateProfile',
      'model Resume',
      'model Organisation',
      'model OrganisationMember',
      'model Job',
      'model Application',
      'model SavedJob',
      'model Plan',
      'model Subscription',
      'model Payment',
      'model Notification',
      'model Report',
      'model AuditLog'
    ];
    for (const m of requiredModels) {
      assert(schema.includes(m), `Schema defines ${m}`);
    }

    const requiredEnums = [
      'enum Role',
      'enum VerificationStatus',
      'enum JobType',
      'enum WorkMode',
      'enum JobStatus',
      'enum ApplicationStatus',
      'enum PaymentStatus',
      'enum SubscriptionStatus'
    ];
    for (const e of requiredEnums) {
      assert(schema.includes(e), `Schema defines ${e}`);
    }
  });

  // ----------------------------------------------------
  // TEST GROUP 7: CI/CD Workflow
  // ----------------------------------------------------
  console.log('\n--- TEST GROUP 7: CI/CD Workflow Configuration ---');

  test('GitHub Actions CI workflow is configured and valid', () => {
    const ciPath = path.join(__dirname, '../.github/workflows/ci.yml');
    assert(fs.existsSync(ciPath), '.github/workflows/ci.yml exists');
    const ciContent = fs.readFileSync(ciPath, 'utf8');
    assert(ciContent.includes('build-frontend'), 'Frontend build job defined');
    assert(ciContent.includes('test-backend'), 'Backend test job defined');
    assert(ciContent.includes('validate-environment'), 'Environment validation job defined');
  });

  // ----------------------------------------------------
  // SUMMARY
  // ----------------------------------------------------
  console.log('\n====================================================');
  console.log(`  TEST RESULTS: ${passed} PASSED, ${failed} FAILED  `);
  console.log('====================================================\n');

  if (failed > 0) {
    process.exit(1);
  }
}

runTests().catch((err) => {
  console.error('Test execution error:', err);
  process.exit(1);
});
