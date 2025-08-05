import React, { useEffect, useState, useRef } from "react";
import { FlatList, ActivityIndicator, View, TouchableOpacity, Text, StyleSheet } from "react-native";
import JobCard from "../common/JobCard";
import { Ionicons } from "@expo/vector-icons";
import { userRelevantJobs } from "../../api/user";
import { Job } from "../../navigation/types";


interface RelevantJobsProps {
  onApply?: (job: Job) => void;
  onViewDetails?: (job: Job) => void;
  savedJobs: Job[];
  onToggleSave: (job: Job, isSaved: boolean) => void
}

const RelevantJobs: React.FC<RelevantJobsProps> = ({ onApply, onViewDetails, savedJobs, onToggleSave }) => {
  const [loading, setLoading] = useState(false);
  const [relevantjobs, setRelevantJobs] = useState<Job[]>([]);
  const [scrollX, setScrollX] = useState(0);
  const flatListRef = useRef<FlatList>(null);

  const getRelevantJobs = async () => {
    setLoading(true);
    try {
      const res = await userRelevantJobs();
      setRelevantJobs(res);
    } catch (err) {
      console.error("Failed to fetch relevant jobs", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getRelevantJobs();
  }, []);

  const CARD_WIDTH = 280;
  const SCROLL_STEP = CARD_WIDTH + 10;
  const scrollRight = () => {
    const newOffset = scrollX + SCROLL_STEP;
    flatListRef.current?.scrollToOffset({
      offset: newOffset,
      animated: true,
    });
    setScrollX(newOffset);
  };

  return (
    <View style={{ marginTop: 10 }}>
      <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
        <Text style={{ fontSize: 18, fontWeight: "bold", color: '#929292' }}>Relevant Jobs</Text>
        <TouchableOpacity onPress={scrollRight}>
          <Ionicons name="arrow-forward-circle" size={28} color="#007bff" />
        </TouchableOpacity>
      </View>

      {loading ? (
        <View style={styles.loaderContainer}>
          <Ionicons name="chatbubble-ellipses-outline" size={32} color="#4B9EFF" style={{ marginBottom: 8 }} />
          <ActivityIndicator size="large" color="#4B9EFF" />
          <Text style={styles.loaderText}>Loading Relevant jobs...</Text>
        </View>
      ) : (
        <FlatList
          ref={flatListRef}
          data={relevantjobs}
          keyExtractor={(item) => item._id}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 5 }}
          renderItem={({ item }) => (
            <JobCard
              _id={item._id}
              title={item.title}
              company={item.company?.name || "Unknown"}
              location={item.location}
              compensation={item.compensation}
              description={item.description}
              skills={item.skills}
              relevancy={item.relevancy}
              onViewDetails={() => onViewDetails?.(item)}
              onApply={() => onApply?.(item)}
              isSaved={savedJobs.some((j) => j._id === item._id)}
              onToggleSave={onToggleSave}
              isActive={item.isActive}
            />
          )}
        />
      )}
    </View>
  );
};

export default RelevantJobs;

const styles = StyleSheet.create({
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  loaderText: {
    marginTop: 12,
    fontSize: 16,
    color: '#555',
  },
})