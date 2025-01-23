import React, { useState } from 'react';  
import {  
  View,  
  Text,  
  TextInput,  
  StyleSheet,  
  FlatList,  
  TouchableOpacity,  
  Modal,  
  Alert,  
  TouchableWithoutFeedback,  
  PanResponder,  
} from 'react-native';  

interface Note {  
  id: string;  
  title: string;  
  description: string;  
  time: string;  
  color: string;  
}  

const NotesApp = () => {  
  const [notes, setNotes] = useState<Note[]>([]);  
  const [modalVisible, setModalVisible] = useState(false);  
  const [noteTitle, setNoteTitle] = useState('');  
  const [noteDescription, setNoteDescription] = useState('');  

  const addNote = () => {  
    if (!noteTitle.trim() || !noteDescription.trim()) {  
      Alert.alert('Error', 'Title and description cannot be empty.');  
      return;  
    }  

    const newNote: Note = {  
      id: Date.now().toString(),  
      title: noteTitle.trim(),  
      description: noteDescription.trim(),  
      time: new Date().toLocaleString(),  
      color: ['#f7a9a8', '#e2a8f5', '#8797f5', '#9cf5a7'][notes.length % 4],  
    };  

    setNotes([newNote, ...notes]);  
    setModalVisible(false);  
    setNoteTitle('');  
    setNoteDescription('');  
  };  

  const deleteNote = (id: string) => {  
    Alert.alert('Delete Note', 'Are you sure you want to delete this note?', [  
      {  
        text: 'Cancel',  
        style: 'cancel',  
      },  
      {  
        text: 'Delete',  
        onPress: () => {  
          setNotes(notes.filter(note => note.id !== id));  
        },  
      },  
    ]);  
  };  

  const renderNoteItem = ({ item }: { item: Note }) => {  
    const panResponder = PanResponder.create({  
      onMoveShouldSetPanResponder: (evt, gestureState) => {  
        return Math.abs(gestureState.dx) > 20; // Mengatur ambang batas untuk mendeteksi geser  
      },  
      onPanResponderRelease: (evt, gestureState) => {  
        if (gestureState.dx < -100) { // Jika digeser ke kiri lebih dari 100  
          deleteNote(item.id);  
        }  
      },  
    });  

    return (  
      <View {...panResponder.panHandlers} style={[styles.noteItem, { backgroundColor: item.color }]}>  
        <Text style={styles.noteTime}>{item.time}</Text>  
        <Text style={styles.noteTitle}>{item.title}</Text>  
        <Text style={styles.noteDescription}>{item.description}</Text>  
        <TouchableOpacity onPress={() => deleteNote(item.id)} style={styles.deleteButton}>  
          <Text style={styles.buttonText}>Delete</Text>  
        </TouchableOpacity>  
      </View>  
    );  
  };  

  return (  
    <View style={styles.container}>  
      <View style={styles.header}>  
        <Text style={styles.headerTitle}>My Notes</Text>  
        <Text style={styles.headerSubtitle}>  
          Your daily notes that remind you  
        </Text>  
      </View>  

      <FlatList  
        data={notes}  
        renderItem={renderNoteItem}  
        keyExtractor={item => item.id}  
        contentContainerStyle={styles.notesList}  
        ListEmptyComponent={  
          <Text style={styles.emptyText}>No notes available. Add one!</Text>  
        }  
      />  

      <TouchableOpacity  
        style={styles.addButton}  
        onPress={() => setModalVisible(true)}>  
        <Text style={styles.addButtonText}>Tambah Catatan</Text>  
      </TouchableOpacity>  

      <Modal visible={modalVisible} animationType="slide" transparent={true}>  
        <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>  
          <View style={styles.modalContainer}>  
            <View style={styles.modalContent}>  
              <Text style={styles.modalTitle}>Add Note</Text>  
              <TextInput  
                style={styles.input}  
                placeholder="Title"  
                value={noteTitle}  
                onChangeText={setNoteTitle}  
              />  
              <TextInput  
                style={[styles.input, styles.inputDescription]}  
                placeholder="Description"  
                multiline={true}  
                numberOfLines={4}  
                value={noteDescription}  
                onChangeText={setNoteDescription}  
              />  
              <View style={styles.modalButtons}>  
                <TouchableOpacity style={styles.button} onPress={addNote}>  
                  <Text style={styles.buttonText}>Save</Text>  
                </TouchableOpacity>  
                <TouchableOpacity  
                  style={[styles.button, styles.cancelButton]}  
                  onPress={() => setModalVisible(false)}>  
                  <Text style={styles.buttonText}>Cancel</Text>  
                </TouchableOpacity>  
              </View>  
            </View>  
          </View>  
        </TouchableWithoutFeedback>  
      </Modal>  
    </View>  
  );  
};  

const styles = StyleSheet.create({  
  container: {  
    flex: 1,  
    backgroundColor: 'rgba(176, 238, 194, 0.82)',  
  },  
  header: {  
    padding: 20,  
    backgroundColor: 'rgba(3, 68, 23, 0.5)',  
    elevation: 2,  
  },  
  headerTitle: {  
    fontSize: 22,  
    fontWeight: 'bold',  
    color: '#333',  
  },  
  headerSubtitle: {  
    fontSize: 14,  
    color: '#999',  
  },  
  notesList: {  
    padding: 20,  
  },  
  noteItem: {  
    padding: 20,  
    borderRadius: 10,  
    marginBottom: 20,  
  },  
  noteTime: {  
    fontSize: 12,  
    color: '#fff',  
    marginBottom: 10,  
  },  
  noteTitle: {  
    fontSize: 18,
    fontWeight: 'bold',  
    color: '#fff',  
  },  
  noteDescription: {  
    fontSize: 14,  
    color: '#fdfdfd',  
    marginTop: 5,  
  },  
  addButton: {  
    position: 'absolute',  
    bottom: 20,  
    right: 20,  
    backgroundColor: 'rgba(130, 238, 162, 0.5)',  
    borderRadius: 50,  
    padding: 15,  
    elevation: 5,  
  },  
  addButtonText: {  
    color: '#fff',  
    fontWeight: 'bold',  
  },  
  emptyText: {  
    textAlign: 'center',  
    marginTop: 50,  
    fontSize: 16,  
    color: '#999',  
  },  
  modalContainer: {  
    flex: 1,  
    justifyContent: 'center',  
    backgroundColor: 'rgba(0, 0, 0, 0.5)',  
  },  
  modalContent: {  
    margin: 20,  
    padding: 20,  
    backgroundColor: 'rgba(130, 238, 162, 0.5)',  
    borderRadius: 10,  
    elevation: 10,  
  },  
  modalTitle: {  
    fontSize: 20,  
    fontWeight: 'bold',  
    marginBottom: 20,  
    color: 'rgba(8, 8, 8, 0.5)',  
  },  
  input: {  
    borderWidth: 1,  
    borderColor: '#ccc',  
    borderRadius: 5,  
    padding: 10,  
    marginBottom: 20,  
    color: 'rgba(0, 0, 0, 0.5)',  
  },  
  inputDescription: {  
    height: 80,  
    textAlignVertical: 'top',  
    color: 'rgba(7, 7, 7, 0.5)',  
  },  
  modalButtons: {  
    flexDirection: 'row',  
    justifyContent: 'space-between',  
  },  
  button: {  
    flex: 1,  
    marginHorizontal: 5,  
    backgroundColor: 'rgba(5, 145, 0, 0.5)',  
    padding: 10,  
    borderRadius: 5,  
    alignItems: 'center',  
  },  
  cancelButton: {  
    backgroundColor: 'rgba(2, 29, 10, 0.5)',  
  },  
  buttonText: {  
    color: '#fff',  
    fontWeight: 'bold',  
  },  
  deleteButton: {  
    marginTop: 20,  
    backgroundColor: 'rgba(161, 137, 137, 0.7)',  
    padding: 10,  
    borderRadius: 10,  
    alignItems: 'center',  
  },  
});  

export default NotesApp;