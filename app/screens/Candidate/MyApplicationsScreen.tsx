import React, { useCallback, useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
  StyleSheet,
} from 'react-native';
import { fetchMyApplications, withdrawApplication } from '../../api/application';
import { useFocusEffect } from '@react-navigation/native';

const MyApplicationsScreen = () => {
  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const loadApps = async () => {
    try {
      const data = await fetchMyApplications();
      setApplications(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Failed to fetch applications:', err);
      setApplications([]);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadApps();
    }, [])
  );

  const handleWithdrawApplication = async (applicationId: string) => {
    try {
      await withdrawApplication(applicationId);
      loadApps();
      Alert.alert('Withdrawn successfully', 'Your application has been withdrawn.');
    } catch (err) {
      console.log('Failed to withdraw application', err);
      Alert.alert('Error', 'Something went wrong while withdrawing.');
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4B9EFF" />
        <Text style={styles.loadingText}>Loading applications...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {!applications || applications.length === 0 ? (
        <Text style={styles.emptyText}>You haven’t applied to any jobs yet.</Text>
      ) : (
        applications.map((app) => (
          <View key={app._id} style={styles.card}>
            <Text style={styles.title}>{app.job?.title}</Text>
            <Text style={styles.subtitle}>🏢 {app.job?.company?.name || 'Unknown'}</Text>

            <View style={styles.statusRow}>
              <Text style={styles.statusLabel}>📌 Status:</Text>
              <Text style={styles.statusValue}>{app.status || 'Pending'}</Text>
            </View>

            <View style={styles.statusRow}>
              <Text style={styles.statusLabel}>📅 Applied on:</Text>
              <Text style={styles.statusValue}>
                {app.appliedAt ? new Date(app.appliedAt).toLocaleDateString() : 'N/A'}
              </Text>
            </View>

            <TouchableOpacity
              style={styles.withdrawButton}
              onPress={() => handleWithdrawApplication(app._id)}
            >
              <Text style={styles.withdrawText}>Withdraw Application</Text>
            </TouchableOpacity>
          </View>
        ))
      )}
    </ScrollView>
  );
};

export default MyApplicationsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 10,
    backgroundColor: '#F9F9F9',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFF',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#555',
  },
  emptyText: {
    fontSize: 16,
    textAlign: 'center',
    marginVertical: 20,
    color: '#555',
  },
  card: {
    padding: 18,
    borderRadius: 16,
    marginBottom: 16,
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 4,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 6,
    color: '#2d3436',
  },
  subtitle: {
    fontSize: 15,
    color: '#636e72',
    marginBottom: 12,
  },
  statusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  statusLabel: {
    fontSize: 14,
    color: '#555',
  },
  statusValue: {
    fontSize: 14,
    fontWeight: '500',
    color: '#4B9EFF',
  },
  withdrawButton: {
    backgroundColor: '#FE3B30',
    paddingVertical: 10,
    borderRadius: 10,
    marginTop: 12,
  },
  withdrawText: {
    color: '#fff',
    fontWeight: '600',
    textAlign: 'center',
    fontSize: 15,
  },
});
