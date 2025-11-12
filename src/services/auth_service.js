import { Account, ID } from "appwrite";
import { appwriteClient } from "./appwrite-config";

class AuthService {
  account;

  constructor() {
    this.account = new Account(appwriteClient);
  }

  // Register a new user
  async createAccount(email, password, name) {
    try {
      const userAccount = await this.account.create(
        ID.unique(),
        email,
        password,
        name
      );

      if (userAccount) {
        return this.login(email, password);
      } else {
        return userAccount;
      }
    } catch (error) {
      console.error("Error creating account:", error);
      throw error;
    }
  }

  // Log in an existing user
  async login(email, password) {
    try {
      return await this.account.createEmailSession(email, password);
    } catch (error) {
      console.error("Error logging in:", error);
      throw error;
    }
  }

  // Get current session/user
  async getCurrentUser() {
    try {
      return await this.account.get();
    } catch (error) {
      console.error("Error getting current user:", error);
      return null;
    }
  }

  // Log out the current user
  async logout() {
    try {
      return await this.account.deleteSession("current");
    } catch (error) {
      console.error("Error logging out:", error);
      throw error;
    }
  }
}

const authService = new AuthService();
export default authService;