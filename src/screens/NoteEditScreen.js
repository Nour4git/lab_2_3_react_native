import React, { useState, useEffect } from "react";
import {
  View,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Text,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { updateNote } from "../services/note-service";

const NoteEditScreen = ({ route, navigation }) => {
  const { note } = route.params;
  const [title, setTitle] = useState(note.title || "");
  const [content, setContent] = useState(note.content || "");
  const [loading, setLoading] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    const hasTitleChanged = title !== note.title;
    const hasContentChanged = content !== note.content;
    setHasChanges(hasTitleChanged || hasContentChanged);
  }, [title, content, note]);

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity
          style={[styles.saveButton, (!hasChanges || loading) && styles.saveButtonDisabled]}
          onPress={handleSave}
          disabled={!hasChanges || loading}
        >
          <Text style={styles.saveButtonText}>
            {loading ? "Saving..." : "Save"}
          </Text>
        </TouchableOpacity>
      ),
    });
  }, [navigation, hasChanges, loading]);

  const handleSave = async () => {
    if (!title.trim() || !content.trim()) {
      Alert.alert("Error", "Please fill in both title and content");
      return;
    }

    try {
      setLoading(true);
      await updateNote(note.$id, {
        title: title.trim(),
        content: content.trim(),
      });
      
      navigation.goBack();
    } catch (error) {
      console.error("Error updating note:", error);
      Alert.alert("Error", "Failed to update note. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView style={styles.scrollView}>
        <TextInput
          style={styles.titleInput}
          placeholder="Note Title"
          value={title}
          onChangeText={setTitle}
          multiline={true}
        />
        
        <TextInput
          style={styles.contentInput}
          placeholder="Start writing your note..."
          value={content}
          onChangeText={setContent}
          multiline={true}
          textAlignVertical="top"
        />
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  scrollView: {
    flex: 1,
    padding: 16,
  },
  titleInput: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
    backgroundColor: "white",
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  contentInput: {
    fontSize: 16,
    lineHeight: 24,
    backgroundColor: "white",
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ddd",
    minHeight: 200,
  },
  saveButton: {
    backgroundColor: "#2196F3",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 5,
  },
  saveButtonDisabled: {
    backgroundColor: "#ccc",
  },
  saveButtonText: {
    color: "white",
    fontWeight: "bold",
  },
});

export default NoteEditScreen;