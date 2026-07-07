import env from "@/app/env";

import { Client, Account, Avatars, Databases, Storage } from "appwrite";

const client = new Client()
    .setEndpoint(env.appwrite.endpoint) // Your API Endpoint
    .setProject(env.appwrite.projectId); // Your project ID

// Log configuration for debugging
if (typeof window !== 'undefined') {
    console.log('Appwrite Client Configuration:');
    console.log('Endpoint:', env.appwrite.endpoint);
    console.log('Project ID:', env.appwrite.projectId);
}

const databases = new Databases(client)
const account = new Account(client);
const avatars = new Avatars(client);
const storage = new Storage(client);


export { client, databases, account, avatars, storage}
