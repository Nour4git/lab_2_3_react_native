import { Client } from "appwrite";

// Initialize the Appwrite client
const appwriteClient = new Client();

appwriteClient
  .setEndpoint(process.env.EXPO_PUBLIC_APPWRITE_ENDPOINT)
  .setProject(process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID);

export { appwriteClient };