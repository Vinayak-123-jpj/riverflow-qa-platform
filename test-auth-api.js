// Test Appwrite API calls from Node.js (simulating server-side)
const { Client, Account, ID } = require('appwrite');

const client = new Client()
    .setEndpoint('https://cloud.appwrite.io/v1')
    .setProject('6a2febd70025fe23479e');

const account = new Account(client);

console.log('=== Testing Appwrite Authentication API ===\n');

// Test 1: Create Account
console.log('Test 1: Creating a new account...');
const testEmail = `test${Date.now()}@example.com`;
const testPassword = 'TestPassword123!';
const testName = 'Test User';

account.create(ID.unique(), testEmail, testPassword, testName)
    .then(result => {
        console.log('✓ Account created successfully!');
        console.log('User ID:', result.$id);
        console.log('Email:', result.email);
        console.log('Name:', result.name);
        
        // Test 2: Create Email Password Session (Login)
        console.log('\nTest 2: Creating email password session...');
        return account.createEmailPasswordSession(testEmail, testPassword);
    })
    .then(session => {
        console.log('✓ Session created successfully!');
        console.log('Session ID:', session.$id);
        console.log('User ID:', session.userId);
        console.log('Expire:', session.expire);
        
        // Test 3: Get Current Session
        console.log('\nTest 3: Getting current session...');
        return account.get();
    })
    .then(user => {
        console.log('✓ Current user retrieved!');
        console.log('User ID:', user.$id);
        console.log('Name:', user.name);
        console.log('Email:', user.email);
        
        // Test 4: List Sessions
        console.log('\nTest 4: Listing sessions...');
        return account.listSessions();
    })
    .then(sessions => {
        console.log('✓ Sessions listed successfully!');
        console.log('Total sessions:', sessions.total);
        console.log('Session IDs:', sessions.sessions.map(s => s.$id));
        
        // Test 5: Delete Session (Logout)
        console.log('\nTest 5: Deleting current session (logout)...');
        return account.deleteSession('current');
    })
    .then(response => {
        console.log('✓ Session deleted successfully!');
        console.log('\n=== All tests passed! ===');
    })
    .catch(error => {
        console.error('✗ Test failed:');
        console.error('Error:', error.message);
        console.error('Type:', error.type);
        console.error('Code:', error.code);
        if (error.response) {
            console.error('Response:', JSON.stringify(error.response, null, 2));
        }
        process.exit(1);
    });
