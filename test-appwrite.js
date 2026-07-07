// Test Appwrite connection
const { Client, Account } = require('appwrite');

const client = new Client()
    .setEndpoint('https://cloud.appwrite.io/v1')
    .setProject('6a2febd70025fe23479e');

const account = new Account(client);

console.log('Testing Appwrite connection...');
console.log('Endpoint:', 'https://cloud.appwrite.io/v1');
console.log('Project ID:', '6a2febd70025fe23479e');

// Test by trying to get account info (will fail if not connected, but shows if endpoint works)
account.get()
    .then(response => {
        console.log('✓ Appwrite connection successful!');
        console.log('Response:', response);
    })
    .catch(error => {
        console.log('✗ Appwrite connection failed:');
        console.log('Error:', error.message);
        console.log('Type:', error.type);
        console.log('Code:', error.code);
    });
