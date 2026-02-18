#!/usr/bin/env node

/**
 * HeySalad Harmony API - Integration Test Script
 * 
 * This script tests the complete flow:
 * 1. Authenticate with HeySalad OAuth
 * 2. Verify token with Harmony API
 * 3. Create HeySalad Inc. company
 * 4. Add Peter as CEO
 * 5. Generate employment documents
 */

const API_URL = process.env.HARMONY_API_URL || 'https://heysalad-harmony-api.heysalad-o.workers.dev';
const OAUTH_URL = process.env.OAUTH_URL || 'https://heysalad-oauth.heysalad-o.workers.dev';

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function logSection(title) {
  console.log('');
  log('='.repeat(60), 'cyan');
  log(title, 'cyan');
  log('='.repeat(60), 'cyan');
  console.log('');
}

async function testHealthCheck() {
  logSection('1. Testing Health Check');
  
  try {
    const response = await fetch(`${API_URL}/`);
    const data = await response.json();
    
    if (response.ok && data.status === 'healthy') {
      log('✅ Health check passed', 'green');
      log(`   Service: ${data.service}`, 'blue');
      log(`   Version: ${data.version}`, 'blue');
      return true;
    } else {
      log('❌ Health check failed', 'red');
      return false;
    }
  } catch (error) {
    log(`❌ Health check error: ${error.message}`, 'red');
    return false;
  }
}

async function testAuthVerification(token) {
  logSection('2. Testing Auth Verification');
  
  try {
    const response = await fetch(`${API_URL}/api/auth/verify`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ token }),
    });
    
    const data = await response.json();
    
    if (response.ok && data.user) {
      log('✅ Auth verification passed', 'green');
      log(`   User ID: ${data.user.id}`, 'blue');
      log(`   Email: ${data.user.email || 'N/A'}`, 'blue');
      log(`   Phone: ${data.user.phone || 'N/A'}`, 'blue');
      log(`   Tier: ${data.user.tier}`, 'blue');
      return data.user;
    } else {
      log('❌ Auth verification failed', 'red');
      log(`   Error: ${data.error || 'Unknown error'}`, 'red');
      return null;
    }
  } catch (error) {
    log(`❌ Auth verification error: ${error.message}`, 'red');
    return null;
  }
}

async function testGetCurrentUser(token) {
  logSection('3. Testing Get Current User');
  
  try {
    const response = await fetch(`${API_URL}/api/auth/me`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    
    const data = await response.json();
    
    if (response.ok && data.user) {
      log('✅ Get current user passed', 'green');
      log(`   User ID: ${data.user.id}`, 'blue');
      log(`   Email: ${data.user.email || 'N/A'}`, 'blue');
      return data.user;
    } else {
      log('❌ Get current user failed', 'red');
      log(`   Error: ${data.error || 'Unknown error'}`, 'red');
      return null;
    }
  } catch (error) {
    log(`❌ Get current user error: ${error.message}`, 'red');
    return null;
  }
}

async function testCreateCompany(token) {
  logSection('4. Testing Create Company (HeySalad Inc.)');
  
  const companyData = {
    name: 'HeySalad Inc.',
    entity_type: 'Delaware C Corporation',
    incorporation_date: '2026-01-23',
    address: '584 Castro St, Suite #4003, San Francisco, CA 94114 US',
    representative_name: 'Test Cardholder',
    representative_phone: 'contact@heysalad.io',
  };
  
  try {
    const response = await fetch(`${API_URL}/api/companies`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(companyData),
    });
    
    const data = await response.json();
    
    if (response.ok && data.company) {
      log('✅ Company created successfully', 'green');
      log(`   Company ID: ${data.company.id}`, 'blue');
      log(`   Name: ${data.company.name}`, 'blue');
      log(`   Type: ${data.company.entity_type}`, 'blue');
      log(`   Incorporated: ${data.company.incorporation_date}`, 'blue');
      return data.company;
    } else {
      log('❌ Company creation failed', 'red');
      log(`   Error: ${data.error || 'Unknown error'}`, 'red');
      return null;
    }
  } catch (error) {
    log(`❌ Company creation error: ${error.message}`, 'red');
    return null;
  }
}

async function testCreateEmployee(token, companyId) {
  logSection('5. Testing Create Employee (Peter as CEO)');
  
  const employeeData = {
    company_id: companyId,
    name: 'Test Cardholder',
    email: 'peter@heysalad.io',
    phone: 'contact@heysalad.io',
    position: 'Chief Executive Officer',
    department: 'Executive',
    start_date: '2026-01-23',
    employment_type: 'full_time',
    salary: 200000,
    currency: 'USD',
  };
  
  try {
    const response = await fetch(`${API_URL}/api/employees`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(employeeData),
    });
    
    const data = await response.json();
    
    if (response.ok && data.employee) {
      log('✅ Employee created successfully', 'green');
      log(`   Employee ID: ${data.employee.id}`, 'blue');
      log(`   Name: ${data.employee.name}`, 'blue');
      log(`   Position: ${data.employee.position}`, 'blue');
      log(`   Department: ${data.employee.department}`, 'blue');
      log(`   Salary: ${data.employee.currency} ${data.employee.salary.toLocaleString()}`, 'blue');
      return data.employee;
    } else {
      log('❌ Employee creation failed', 'red');
      log(`   Error: ${data.error || 'Unknown error'}`, 'red');
      return null;
    }
  } catch (error) {
    log(`❌ Employee creation error: ${error.message}`, 'red');
    return null;
  }
}

async function testGenerateDocument(token, employeeId, documentType) {
  logSection(`6. Testing Generate Document (${documentType})`);
  
  try {
    const response = await fetch(`${API_URL}/api/documents/generate`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        employee_id: employeeId,
        document_type: documentType,
      }),
    });
    
    const data = await response.json();
    
    if (response.ok && data.document) {
      log(`✅ ${documentType} generated successfully`, 'green');
      log(`   Document ID: ${data.document.id}`, 'blue');
      log(`   Type: ${data.document.document_type}`, 'blue');
      log(`   Generated: ${data.document.generated_at}`, 'blue');
      log(`   Content length: ${data.document.content.length} characters`, 'blue');
      
      // Show first 200 characters of content
      log(`   Preview: ${data.document.content.substring(0, 200)}...`, 'yellow');
      
      return data.document;
    } else {
      log(`❌ ${documentType} generation failed`, 'red');
      log(`   Error: ${data.error || 'Unknown error'}`, 'red');
      return null;
    }
  } catch (error) {
    log(`❌ ${documentType} generation error: ${error.message}`, 'red');
    return null;
  }
}

async function main() {
  log('🚀 HeySalad Harmony API - Integration Test', 'cyan');
  log('==========================================', 'cyan');
  console.log('');
  
  // Check if token is provided
  const token = process.env.HARMONY_TOKEN || process.argv[2];
  
  if (!token) {
    log('❌ Error: No OAuth token provided', 'red');
    console.log('');
    log('Usage:', 'yellow');
    log('  HARMONY_TOKEN=<your-token> node test-harmony-api.js', 'yellow');
    log('  OR', 'yellow');
    log('  node test-harmony-api.js <your-token>', 'yellow');
    console.log('');
    log('To get a token:', 'yellow');
    log('  1. Authenticate with HeySalad OAuth', 'yellow');
    log('  2. Use phone OTP or email magic link', 'yellow');
    log('  3. Extract JWT token from response', 'yellow');
    console.log('');
    process.exit(1);
  }
  
  log(`Using API URL: ${API_URL}`, 'blue');
  log(`Using OAuth URL: ${OAUTH_URL}`, 'blue');
  console.log('');
  
  // Run tests
  const healthOk = await testHealthCheck();
  if (!healthOk) {
    log('❌ Health check failed. Stopping tests.', 'red');
    process.exit(1);
  }
  
  const user = await testAuthVerification(token);
  if (!user) {
    log('❌ Auth verification failed. Stopping tests.', 'red');
    process.exit(1);
  }
  
  const currentUser = await testGetCurrentUser(token);
  if (!currentUser) {
    log('❌ Get current user failed. Stopping tests.', 'red');
    process.exit(1);
  }
  
  const company = await testCreateCompany(token);
  if (!company) {
    log('❌ Company creation failed. Stopping tests.', 'red');
    process.exit(1);
  }
  
  const employee = await testCreateEmployee(token, company.id);
  if (!employee) {
    log('❌ Employee creation failed. Stopping tests.', 'red');
    process.exit(1);
  }
  
  const offerLetter = await testGenerateDocument(token, employee.id, 'offer_letter');
  const employmentContract = await testGenerateDocument(token, employee.id, 'employment_contract');
  
  // Summary
  logSection('Test Summary');
  
  if (healthOk && user && currentUser && company && employee && offerLetter && employmentContract) {
    log('✅ All tests passed!', 'green');
    console.log('');
    log('Created Resources:', 'cyan');
    log(`  Company ID: ${company.id}`, 'blue');
    log(`  Employee ID: ${employee.id}`, 'blue');
    log(`  Offer Letter ID: ${offerLetter.id}`, 'blue');
    log(`  Employment Contract ID: ${employmentContract.id}`, 'blue');
    console.log('');
    log('Next Steps:', 'yellow');
    log('  1. View documents in Harmony dashboard', 'yellow');
    log('  2. Add more employees', 'yellow');
    log('  3. Generate additional documents', 'yellow');
    log('  4. Build frontend interface', 'yellow');
  } else {
    log('❌ Some tests failed. Please check the errors above.', 'red');
    process.exit(1);
  }
}

main().catch(error => {
  log(`❌ Unexpected error: ${error.message}`, 'red');
  console.error(error);
  process.exit(1);
});
