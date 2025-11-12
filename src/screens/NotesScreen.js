import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  TextInput,
  RefreshControl,
} from "react-native";
import { getNotes, searchNotes } from "../services/note-service";
import NoteItem from "../components/NoteItem";
import AddNoteModal from "../components/AddNoteModal";
import { useAuth } from "../contexts/AuthContext";

const NotesScreen = ({ navigation }) => {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [refreshing, setRefreshing] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchNotes();
    }
  }, [user]);

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      if (searchQuery && user) {
        handleSearch(searchQuery);
      } else if (user) {
        fetchNotes();
      }
    }, 500);

    return () => clearTimeout(debounceTimer);
  }, [searchQuery, user]);

  const fetchNotes = async () => {
    try {
      setLoading(true);
      setError(null);
      const fetchedNotes = await getNotes(user?.$id);
      setNotes(fetchedNotes);
    } catch (err) {
      console.error("Error fetching notes:", err);
      setError("Failed to load notes. Please try again.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleSearch = async (query) => {
    try {
      setLoading(true);
      const searchResults = await searchNotes(query, user?.$id);
      setNotes(searchResults);
    } catch (err) {
      console.error("Error searching notes:", err);
      setError("Failed to search notes. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    fetchNotes();
  };

  const handleNoteAdded = (newNote) => {
    setNotes((currentNotes) => [newNote, ...currentNotes]);
  };

  const handleNoteDeleted = (noteId) => {
    setNotes((currentNotes) =>
      currentNotes.filter((note) => note.$id !== noteId)
    );
  };

  const handleNoteUpdated = (updatedNote) => {
    setNotes((currentNotes) =>
      currentNotes.map((note) =>
        note.$id === updatedNote.$id ? updatedNote : note
      )
    );
  };

  const renderEmptyComponent = () => {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>You don't have any notes yet.</Text>
        <Text style={styles.emptySubtext}>
          Tap the + button to create your first note!
        </Text>
      </View>
    );
  };

  if (loading && notes.length === 0) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (error && notes.length === 0) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={fetchNotes}>
          <Text style={styles.retryButtonText}>Try Again</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>My Notes</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => setModalVisible(true)}
        >
          <Text style={styles.addButtonText}>+ Add Note</Text>
        </TouchableOpacity>
      </View>

      <TextInput
        style={styles.searchInput}
        placeholder="Search notes..."
        value={searchQuery}
        onChangeText={setSearchQuery}
      />

      <FlatList
        data={notes}
        keyExtractor={(item) => item.$id}
        renderItem={({ item }) => (
          <NoteItem
            note={item}
            onNoteDeleted={handleNoteDeleted}
            onNoteUpdated={handleNoteUpdated}
          />
        )}
        contentContainerStyle={notes.length === 0 ? { flex: 1 } : styles.listContent}
        ListEmptyComponent={!loading && renderEmptyComponent()}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
      />

      <AddNoteModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onNoteAdded={handleNoteAdded}
        userId={user?.$id}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#f5f5f5",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
  },
  addButton: {
    backgroundColor: "#2196F3",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 5,
  },
  addButtonText: {
    color: "white",
    fontWeight: "bold",
  },
  searchInput: {
    backgroundColor: "white",
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  listContent: {
    paddingBottom: 20,
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    color: "red",
    fontSize: 16,
    textAlign: "center",
    marginBottom: 16,
  },
  retryButton: {
    backgroundColor: "#2196F3",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 5,
  },
  retryButtonText: {
    color: "white",
    fontWeight: "bold",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  emptySubtext: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
  },
});

export default NotesScreen;