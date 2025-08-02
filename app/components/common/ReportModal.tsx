import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { postReport } from '../../api/report';
import { useModal } from '../../context/ModalContext';

interface ReportModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (reason: string, details: string) => void;
}

const ReportModal: React.FC<ReportModalProps> = ({ visible, onClose, onSubmit }) => {
  const [reason, setReason] = useState('');
  const [details, setDetails] = useState('');
  const [error, setError] = useState('');
  const inputRef = useRef<TextInput>(null);

  const { reportTarget, closeReportModal } = useModal();

  const handleSubmit = async () => {
    if (!reportTarget || !reportTarget._id) {
      setError('Unable to submit report. Target not found.');
      return;
    }

    if (!reason.trim()) {
      setError('Please provide a reason for reporting.');
      return;
    }

    const isApplicant = 'name' in reportTarget && 'email' in reportTarget;

    const payload = {
      targetId: reportTarget._id,
      targetType: isApplicant ? 'user' : 'job',
      reason,
      details,
    };

    try {
      await postReport(payload);
      closeReportModal();
      setReason('');
      setDetails('');
      setError('');
    } catch (err) {
      console.error('Report failed:', err);
      setError('Failed to submit report. Please try again.');
    }
  };

  useEffect(() => {
    if (visible && inputRef.current) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 300);
    }
  }, [visible]);

  return (
    <Modal
      animationType="slide"
      transparent
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modalContent}>
          <View style={styles.header}>
            <Text style={styles.title}>Report</Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close-outline" size={24} color="#4B9EFF" />
            </TouchableOpacity>
          </View>

          <Text style={styles.label}>Reason</Text>
          <TextInput
            ref={inputRef}
            style={styles.input}
            placeholder="Reason for reporting..."
            value={reason}
            multiline
            onChangeText={(text) => {
              setReason(text);
              setError('');
            }}
          />

          <Text style={[styles.label, { marginTop: 12 }]}>Additional Details</Text>
          <TextInput
            style={styles.input}
            placeholder="Any extra context?"
            value={details}
            multiline
            onChangeText={(text) => setDetails(text)}
          />

          {error.length > 0 && (
            <Text style={{ color: 'red', marginTop: 6 }}>{error}</Text>
          )}

          <TouchableOpacity style={styles.button} onPress={handleSubmit}>
            <Text style={styles.buttonText}>Submit</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '85%',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 4,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: '#4B9EFF',
  },
  label: {
    fontSize: 14,
    color: '#333',
    marginBottom: 6,
  },
  input: {
    height: 100,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 12,
    padding: 10,
    textAlignVertical: 'top',
    color: '#333',
    backgroundColor: '#fff',
  },
  button: {
    backgroundColor: '#4B9EFF',
    borderRadius: 12,
    paddingVertical: 12,
    marginTop: 16,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    textAlign: 'center',
    fontSize: 16,
  },
});

export default ReportModal;
