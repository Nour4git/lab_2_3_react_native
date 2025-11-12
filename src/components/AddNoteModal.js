import React, { useState } from "react";
import {
  Modal,
  View,
  TextInput,
  StyleSheet,
  Text,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { createNote } from "../services/note-service";

const AddNoteModal = ({ visible, onClose, onNoteAdded, userId }) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const resetForm = () => {
    setTitle("");
    setContent("");
    setError(null);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleSave = async () => {
    if (!title.trim() || !content.trim()) {
      setError("Please fill in both title and content");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const noteData = {
        title: title.trim(),
        content: content.trim(),
      };

      const newNote = await createNote(noteData, userId);

      resetForm();
      onClose();

      if (onNoteAdded) {
        onNoteAdded(newNote);
      }
    } catch (err) {
      console.error("Error creating note:", err);
      setError("Failed to save note. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={handleClose}
    >
      <KeyboardAvoidingView
        style={styles.centeredView}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <View style={styles.modalView}>
          <Text style={styles.modalTitle}>Add New Note</Text>

          {error && <Text style={styles.errorText}>{error}</Text>}

          <TextInput
            style={styles.input}
            placeholder="Title"
            value={title}
            onChangeText={setTitle}
          />

          <TextInput
            style={[styles.input, styles.contentInput]}
            placeholder="Content"
            value={content}
            onChangeText={setContent}
            multiline={true}
            textAlignVertical="top"
          />

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.button, styles.cancelButton]}
              onPress={handleClose}
              disabled={loading}
            >
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, styles.saveButton]}
              onPress={handleSave}
              disabled={loading}
            >
              <Text style={styles.buttonText}>
                {loading ? "Saving..." : "Save Note"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalView: {
    width: "90%",
    backgroundColor: "white",
    borderRadius: 10,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 16,
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 5,
    padding: 10,
    marginBottom: 15,
    backgroundColor: "#f9f9f9",
  },
  contentInput: {
    height: 150,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  button: {
    borderRadius: 5,
    padding: 10,
    elevation: 2,
    minWidth: "45%",
    alignItems: "center",
  },
  cancelButton: {
    backgroundColor: "#ccc",
  },
  saveButton: {
    backgroundColor: "#2196F3",
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
  },
  errorText: {
    color: "red",
    marginBottom: 10,
    textAlign: "center",
  },
});

export default AddNoteModal;