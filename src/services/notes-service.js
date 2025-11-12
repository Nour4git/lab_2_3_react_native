import { Query, ID, Databases } from "appwrite";
import { appwriteClient } from "./appwrite-config";

const databases = new Databases(appwriteClient);

// Get all notes for a specific user
export const getNotes = async (userId) => {
  try {
    const queries = [];

    if (userId) {
      queries.push(Query.equal("userId", userId));
    }

    queries.push(Query.orderDesc("createdAt"));

    const response = await databases.listDocuments(
      process.env.EXPO_PUBLIC_APPWRITE_DATABASE_ID,
      process.env.EXPO_PUBLIC_APPWRITE_COLLECTION_ID,
      queries
    );

    return response.documents;
  } catch (error) {
    console.error("Error getting notes:", error);
    throw error;
  }
};

// Create a new note for a specific user
export const createNote = async (data, userId) => {
  try {
    const noteData = {
      ...data,
      userId: userId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const response = await databases.createDocument(
      process.env.EXPO_PUBLIC_APPWRITE_DATABASE_ID,
      process.env.EXPO_PUBLIC_APPWRITE_COLLECTION_ID,
      ID.unique(),
      noteData
    );

    return response;
  } catch (error) {
    console.error("Error creating note:", error);
    throw error;
  }
};

// Delete a note by ID
export const deleteNote = async (noteId) => {
  try {
    await databases.deleteDocument(
      process.env.EXPO_PUBLIC_APPWRITE_DATABASE_ID,
      process.env.EXPO_PUBLIC_APPWRITE_COLLECTION_ID,
      noteId
    );

    return true;
  } catch (error) {
    console.error("Error deleting note:", error);
    throw error;
  }
};

// Update an existing note
export const updateNote = async (noteId, data) => {
  try {
    const noteData = {
      ...data,
      updatedAt: new Date().toISOString(),
    };

    const response = await databases.updateDocument(
      process.env.EXPO_PUBLIC_APPWRITE_DATABASE_ID,
      process.env.EXPO_PUBLIC_APPWRITE_COLLECTION_ID,
      noteId,
      noteData
    );

    return response;
  } catch (error) {
    console.error("Error updating note:", error);
    throw error;
  }
};

// Search notes by title or content for a specific user
export const searchNotes = async (searchTerm, userId) => {
  try {
    const queries = [];

    if (userId) {
      queries.push(Query.equal("userId", userId));
    }

    if (searchTerm) {
      queries.push(Query.search("title", searchTerm));
      queries.push(Query.search("content", searchTerm));
    }

    queries.push(Query.orderDesc("createdAt"));

    const response = await databases.listDocuments(
      process.env.EXPO_PUBLIC_APPWRITE_DATABASE_ID,
      process.env.EXPO_PUBLIC_APPWRITE_COLLECTION_ID,
      queries
    );

    return response.documents;
  } catch (error) {
    console.error("Error searching notes:", error);
    throw error;
  }
};