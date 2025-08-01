import React from 'react';
import {
  Modal,
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Text,
  SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as DocumentPicker from 'expo-document-picker';
import { useModal } from '../../context/ModalContext';
import * as MediaLibrary from 'expo-media-library';

interface messageModalProps {
  senderId: string,
  receiverId: string
}

const MessageCardModal:React.FC<messageModalProps> = ({senderId,receiverId}) => {
  const [message, setMessage] = React.useState('');
  const [attachment, setAttachment] = React.useState<DocumentPicker.DocumentPickerAsset | null>(null);
  const { isMesaageModalVisible, closeMessageModal,handleSendMessage } = useModal();

  const onAttach = async () => {
  try {

    const { status } = await MediaLibrary.requestPermissionsAsync();
    if (status !== 'granted') {
      alert('Permission to access media library is required!');
      return;
    }

    const result = await DocumentPicker.getDocumentAsync({
      type: '*/*',
      copyToCacheDirectory: true,
      multiple: false,
    });

    if (!result.canceled && result.assets?.length) {
      const selectedFile = result.assets[0];
      setAttachment(selectedFile);
    }
  } catch (error) {
    console.error('Failed to pick document:', error);
  }}

  const onSend = () => {
    
    handleSendMessage(senderId,receiverId,message)
    setMessage('');
    setAttachment(null);
    closeMessageModal();
  };

  return (
    <Modal visible={isMesaageModalVisible} animationType="fade" transparent>
      <SafeAreaView style={styles.overlay}>
        <View style={styles.card}>
          
          <View style={styles.header}>
            <TouchableOpacity onPress={closeMessageModal} style={styles.backButton}>
              <Ionicons name="arrow-back-outline" size={22} color="#4B9EFF" />
              <Text style={styles.backButtonText}>Back</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={closeMessageModal}>
              <Ionicons name="close-outline" size={24} color="#4B9EFF" />
            </TouchableOpacity>
          </View>


          <TextInput
            style={styles.input}
            placeholder="Type your message..."
            placeholderTextColor="#AAB8C2"
            value={message}
            onChangeText={setMessage}
            multiline
          />


          {attachment?.name && (
            <View style={styles.attachmentPreview}>
              <Ionicons name="document-outline" size={18} color="#4B9EFF" />
              <Text style={styles.attachmentText}>{attachment.name}</Text>
            </View>
          )}


          <View style={styles.actions}>
            <TouchableOpacity onPress={onAttach} style={styles.iconButton}>
              <Ionicons name="attach-outline" size={20} color="#4B9EFF" />
              <Text style={styles.actionText}>Attach</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={onSend} style={styles.sendButton}>
              <Ionicons name="send" size={20} color="#fff" />
              <Text style={styles.sendText}>Send</Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    </Modal>
  );
};

export default MessageCardModal;


const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    width: '88%',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 6,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButtonText: {
    fontSize: 16,
    color: '#4B9EFF',
    marginLeft: 6,
    fontWeight: '500',
  },
  input: {
    height: 100,
    borderColor: '#D1D1D6',
    borderWidth: 1,
    borderRadius: 12,
    backgroundColor: '#F2F2F7',
    paddingHorizontal: 12,
    paddingTop: 10,
    fontSize: 15,
    color: '#000',
    marginBottom: 16,
    textAlignVertical: 'top',
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  iconButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionText: {
    marginLeft: 4,
    color: '#4B9EFF',
    fontSize: 15,
  },
  sendButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#4B9EFF',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 10,
  },
  sendText: {
    color: '#fff',
    marginLeft: 6,
    fontSize: 15,
    fontWeight: '600',
  },
  attachmentPreview: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  attachmentText: {
    marginLeft: 6,
    fontSize: 14,
    color: '#444',
  },
});
