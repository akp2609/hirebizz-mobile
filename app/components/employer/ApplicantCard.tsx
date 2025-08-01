import { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  Text,
  Linking,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { getRefreshedSignedURLApplications } from "../../api/application";
import { Entypo, Ionicons, FontAwesome5 } from "@expo/vector-icons";
import { useModal } from "../../context/ModalContext";
import { useNavigation } from "@react-navigation/native";
import { useAppSelector } from "../../store/hooks";
import MessageModal from "../common/MessageModal";

interface ApplicantCardProps {
  name: string;
  email: string;
  coverLetter: string;
  _id: string;
  status: string;
  onAccept?: () => void;
  onReject?: () => void;
}

const ApplicantCard: React.FC<ApplicantCardProps> = ({
  name,
  email,
  coverLetter,
  _id,
  status,
  onAccept,
  onReject,
}) => {
  const [resumeLink, setResumeLink] = useState<string | null>(null);
  const [isDropdownVisible, setDropdownVisible] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const navigation = useNavigation();
  const user = useAppSelector((store) => store.user.user);
  

  const {
    handleMenuPressApplication,
    isMesaageModalVisible,
    openMessageModal,
    closeMessageModal,
  } = useModal();

  const reportDetails = { _id,
  name,
  email,
  type: "applicant", };

  useEffect(() => {
    const fetchResumeURL = async () => {
      setLoading(true);
      try {
        const refreshedURL = await getRefreshedSignedURLApplications(_id);
        setResumeLink(refreshedURL);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchResumeURL();
  }, [_id]);

  const handleOpenResume = async () => {
    if (resumeLink) {
      try {
        await Linking.openURL(resumeLink);
      } catch {
        alert("Unable to open resume link.");
      }
    }
  };

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.name}>🧑 {name}</Text>
        <TouchableOpacity onPress={() => setDropdownVisible((prev) => !prev)}>
          <Entypo name="dots-three-vertical" size={20} color="#333" />
        </TouchableOpacity>
      </View>

      {isDropdownVisible && (
        <View style={styles.dropdown}>
          <TouchableOpacity
            style={styles.dropdownItem}
            onPress={() => {
              handleMenuPressApplication(reportDetails);
              setDropdownVisible(false);
            }}
          >
            <Ionicons
              name="alert-circle-outline"
              size={18}
              color="#4B9EFF"
              style={{ marginRight: 6 }}
            />
            <Text style={styles.dropdownText}>Report Job</Text>
          </TouchableOpacity>
        </View>
      )}

      <Text style={styles.email}>📧 {email}</Text>
      <Text style={styles.coverLetter}>💬 {coverLetter}</Text>

      {isLoading ? (
        <ActivityIndicator size="small" color="#4B9EFF" style={{ marginTop: 8 }} />
      ) : (
        <TouchableOpacity onPress={handleOpenResume}>
          <Text style={styles.resumeLink}>📄 View Resume</Text>
        </TouchableOpacity>
      )}

      {status === "pending" ? (
        <View style={styles.actions}>
          <TouchableOpacity style={styles.acceptButton} onPress={onAccept}>
            <Text style={styles.buttonText}>✅ Accept</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.rejectButton} onPress={onReject}>
            <Text style={styles.buttonText}>❌ Reject</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View>
          <Text
            style={[
              styles.statusText,
              status === "accepted" ? styles.accepted : styles.rejected,
            ]}
          >
            {status.toUpperCase()}
          </Text>
          {status === "accepted" && (
            <TouchableOpacity style={styles.messageButton} onPress={openMessageModal}>
              <FontAwesome5 name="paper-plane" size={16} color="#fff" />
              <Text style={styles.messageText}>Message Applicant</Text>
            </TouchableOpacity>
          )}

          {isMesaageModalVisible && (
            <MessageModal senderId={user!._id} receiverId={_id}/>
          )}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    marginVertical: 14,
    padding: 18,
    borderRadius: 14,
    backgroundColor: "#F9F9FB",
    borderWidth: 1,
    borderColor: "#ddd",
    shadowColor: "#000",
    shadowOpacity: 0.07,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  name: {
    fontSize: 18,
    fontWeight: "700",
    color: "#222",
  },
  email: {
    fontSize: 14,
    color: "#444",
    marginBottom: 4,
  },
  coverLetter: {
    fontSize: 14,
    color: "#333",
    marginBottom: 12,
  },
  resumeLink: {
    fontSize: 15,
    color: "#4B9EFF",
    textDecorationLine: "underline",
    marginBottom: 10,
  },
  actions: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 16,
  },
  acceptButton: {
    backgroundColor: "#4CAF50",
    paddingVertical: 12,
    borderRadius: 8,
    width: "48%",
  },
  rejectButton: {
    backgroundColor: "#f44336",
    paddingVertical: 12,
    borderRadius: 8,
    width: "48%",
  },
  buttonText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "600",
    fontSize: 15,
  },
  statusText: {
    fontSize: 14,
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 6,
    textAlign: "center",
    fontWeight: "600",
    marginBottom: 10,
    alignSelf: "flex-start",
  },
  accepted: {
    color: "#007A3D",
    backgroundColor: "#D7F8E3",
  },
  rejected: {
    color: "#D22C2C",
    backgroundColor: "#FDE1E1",
  },
  messageButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#4B9EFF",
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 14,
    alignSelf: "flex-start",
  },
  messageText: {
    color: "#fff",
    fontSize: 15,
    marginLeft: 8,
    fontWeight: "600",
  },
  dropdown: {
    position: "absolute",
    top: 42,
    right: 12,
    backgroundColor: "#fff",
    borderRadius: 10,
    paddingVertical: 8,
    paddingHorizontal: 14,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 5,
    zIndex: 1000,
  },
  dropdownItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 6,
  },
  dropdownText: {
    color: "#4B9EFF",
    fontSize: 14,
    fontWeight: "500",
  },
});

export default ApplicantCard;
