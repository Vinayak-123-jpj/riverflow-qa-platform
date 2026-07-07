"use client";

import React, { useState, useEffect } from "react";
import { Client, Account, ID } from "appwrite";

const client = new Client()
    .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_HOST_URL || 'https://cloud.appwrite.io/v1')
    .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID || '');

const account = new Account(client);

export default function TestAuth() {
    const [status, setStatus] = useState("Initializing...");
    const [logs, setLogs] = useState<string[]>([]);
    const [config, setConfig] = useState({ endpoint: '', projectId: '' });

    const addLog = (message: string) => {
        console.log(message);
        setLogs(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
    };

    useEffect(() => {
        // Auto-run tests on page load
        runAllTests();
    }, []);

    const runAllTests = async () => {
        setConfig({
            endpoint: process.env.NEXT_PUBLIC_APPWRITE_HOST_URL || 'Not set',
            projectId: process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID || 'Not set'
        });

        addLog("=== Starting Appwrite Authentication Tests ===");
        addLog(`Endpoint: ${process.env.NEXT_PUBLIC_APPWRITE_HOST_URL}`);
        addLog(`Project ID: ${process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID}`);

        // Test 1: Check if we can reach Appwrite
        setStatus("Testing connection to Appwrite...");
        try {
            addLog("Test 1: Checking Appwrite connectivity...");
            // Try to get current user (will fail if not logged in, but shows if endpoint works)
            await account.get();
            addLog("✓ Already logged in to Appwrite!");
            setStatus("Already logged in ✓");
        } catch (error: any) {
            if (error.type === 'general_unauthorized_scope') {
                addLog("✓ Appwrite endpoint is reachable (not logged in, which is expected)");
                setStatus("Endpoint reachable ✓");
            } else {
                addLog(`✗ Connection failed: ${error.message}`);
                addLog(`Error type: ${error.type}`);
                addLog(`Error code: ${error.code}`);
                setStatus("Connection failed ✗");
                return;
            }
        }

        // Test 2: Try to create a test account
        setStatus("Testing account creation...");
        try {
            addLog("Test 2: Creating a test account...");
            const testEmail = `test${Date.now()}@example.com`;
            const testPassword = "TestPassword123!";
            const testName = "Test User";
            
            addLog(`Email: ${testEmail}`);
            const result = await account.create(ID.unique(), testEmail, testPassword, testName);
            addLog("✓ Account created successfully!");
            addLog(`User ID: ${result.$id}`);
            addLog(`Email: ${result.email}`);
            setStatus("Account creation ✓");

            // Test 3: Try to login with the created account
            addLog("Test 3: Attempting login with created account...");
            const session = await account.createEmailPasswordSession(testEmail, testPassword);
            addLog("✓ Session created successfully!");
            addLog(`Session ID: ${session.$id}`);
            setStatus("Login ✓");

            // Test 4: Get current user
            addLog("Test 4: Getting current user...");
            const user = await account.get();
            addLog("✓ User retrieved successfully!");
            addLog(`User: ${user.name} (${user.email})`);
            setStatus("All tests passed ✓");

            // Clean up: logout
            addLog("Cleaning up: Logging out...");
            await account.deleteSession('current');
            addLog("✓ Logged out successfully");

        } catch (error: any) {
            addLog(`✗ Test failed: ${error.message}`);
            addLog(`Error type: ${error.type}`);
            addLog(`Error code: ${error.code}`);
            if (error.response) {
                addLog(`Response: ${JSON.stringify(error.response)}`);
            }
            setStatus("Test failed ✗");
        }

        addLog("=== Tests Complete ===");
    };

    return (
        <div className="min-h-screen bg-black text-white p-8">
            <div className="max-w-2xl mx-auto">
                <h1 className="text-3xl font-bold mb-6">Appwrite Authentication Test</h1>
                
                <div className="bg-gray-800 rounded-lg p-4 mb-6">
                    <h2 className="text-lg font-semibold mb-2">Configuration:</h2>
                    <p className="font-mono text-sm">Endpoint: {config.endpoint}</p>
                    <p className="font-mono text-sm">Project ID: {config.projectId}</p>
                </div>

                <div className="mb-4">
                    <h2 className="text-xl font-semibold mb-2">Status: {status}</h2>
                </div>

                <div className="bg-gray-900 rounded-lg p-4 h-96 overflow-y-auto">
                    <h2 className="text-lg font-semibold mb-2">Logs:</h2>
                    {logs.length === 0 ? (
                        <p className="text-gray-500">No logs yet...</p>
                    ) : (
                        logs.map((log, index) => (
                            <div key={index} className="font-mono text-sm mb-1 whitespace-pre-wrap">
                                {log}
                            </div>
                        ))
                    )}
                </div>

                <div className="mt-6">
                    <button
                        onClick={runAllTests}
                        className="px-6 py-3 bg-blue-600 rounded-lg hover:bg-blue-700 transition"
                    >
                        Re-run Tests
                    </button>
                </div>
            </div>
        </div>
    );
}
