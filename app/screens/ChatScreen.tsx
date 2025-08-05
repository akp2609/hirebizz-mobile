import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  ScrollView,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  NativeSyntheticEvent,
  NativeScrollEvent,
  Linking,
  Text,
  Alert,
} from 'react-native';
import { RouteProp, useRoute } from '@react-navigation/native';
import { RootStackParamList } from '../navigation/types';
import { sendMessage, markAsSeen } from '../api/chat';
import { db } from '../config/firebaseConfig';
import { ref, onValue } from 'firebase/database';
import Icon from 'react-native-vector-icons/Ionicons';
import ParsedText from 'react-native-parsed-text';
import { Ionicons } from '@expo/vector-icons';
import moment from 'moment';
import * as Clipboard from 'expo-clipboard';

type ChatRoute = RouteProp<RootStackParamList, 'Chat'>;

type Message = {
  key: string;
  senderId: string;
  receiverId: string;
  message: string;
  timestamp: number;
  seen: boolean;
};

const ChatScreen = () => {
  const route = useRoute<ChatRoute>();
  const { chatId, participant } = route.params;

  const userId = chatId.split('_').find(id => id !== participant._id) ?? '';
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(true);
  const [isAtBottom, setIsAtBottom] = useState(true);

  const scrollViewRef = useRef<ScrollView>(null);

  const scrollToBottom = () => {
    scrollViewRef.current?.scrollToEnd({ animated: true });
  };

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const { layoutMeasurement, contentOffset, contentSize } = event.nativeEvent;
    const distanceFromBottom = contentSize.height - (contentOffset.y + layoutMeasurement.height);
    setIsAtBottom(distanceFromBottom < 50);
  };

  useEffect(() => {
    if (isAtBottom) {
      scrollToBottom();
    }
  }, [messages]);

  useEffect(() => {
    const [user1, user2] = chatId.split('_');
    const ChatRef = ref(db, `${user1}_${user2}`);
    const unsubscribe = onValue(ChatRef, snapshot => {
      const data = snapshot.val();
      if (!data) {
        setMessages([]);
        setLoading(false);
        return;
      }

      const parsed: Message[] = Object.entries(data)
        .map(([key, value]: [string, any]) => ({ key, ...value }))
        .sort((a, b) => a.timestamp - b.timestamp);

      setMessages(parsed);
      setLoading(false);

      parsed.forEach(async msg => {
        if (!msg.seen && msg.receiverId === userId) {
          await markAsSeen(chatId, msg.key);
        }
      });
    });

    return () => unsubscribe();
  }, [chatId]);

  const handleSend = async () => {
    if (!input.trim()) return;

    try {
      await sendMessage(userId, participant._id, input.trim());
      setInput('');
      scrollToBottom();
    } catch (err) {
      console.error('Send failed', err);
    }
  };

  return (
    <View style={styles.container}>
      {loading ? (
        <View style={styles.loaderContainer}>
          <Ionicons name="chatbubble-ellipses-outline" size={32} color="#4B9EFF" style={{ marginBottom: 8 }} />
          <ActivityIndicator size="large" color="#4B9EFF" />
          <Text style={styles.loaderText}>Loading chat...</Text>
        </View>
      ) : (
        <>
          <View style={styles.messageWrapper}>
            <ScrollView
              ref={scrollViewRef}
              contentContainerStyle={{ paddingBottom: 20 }}
              onScroll={handleScroll}
              scrollEventThrottle={200}
            >
              {messages.map(msg => (
                <View
                  key={msg.key}
                  style={[
                    styles.messageBubble,
                    msg.senderId === userId ? styles.outgoing : styles.incoming,
                  ]}
                >

                  <TouchableOpacity
                    onLongPress={async () => {
                      await Clipboard.setStringAsync(msg.message);
                      Alert.alert('Copied', 'Message copied to clipboard');
                    }}
                    activeOpacity={0.8}
                  >
                    <View style={{ flexDirection: 'row', alignItems: 'flex-end' }}>
                      <ParsedText
                        style={[
                          {
                            color: msg.senderId === userId ? '#fff' : '#000',
                            fontSize: 14,
                            flexShrink: 1,
                            flexWrap: 'wrap',
                          },
                        ]}
                        parse={[
                          {
                            type: 'url',
                            style: {
                              textDecorationLine: 'underline',
                              color: msg.senderId === userId ? '#B0E0FF' : '#1e90ff',
                            },
                            onPress: url => Linking.openURL(url),
                          },
                        ]}
                      >
                        {msg.message}
                      </ParsedText>


                      <Text
                        style={{
                          fontSize: 8,
                          color: msg.senderId === userId ? '#fff' : '#666',
                          marginLeft: 6,
                          marginBottom: 2,
                        }}
                      >
                        {moment(msg.timestamp).local().format('HH:mm')}
                      </Text>
                    </View>
                  </TouchableOpacity>
                </View>
              ))}

            </ScrollView>

            {!isAtBottom && (
              <TouchableOpacity style={styles.scrollButton} onPress={scrollToBottom}>
                <View style={styles.scrollButtonBackground}>
                  <Ionicons name="arrow-down" size={24} color="#4B9EFF" />
                </View>
              </TouchableOpacity>
            )}
          </View>

          <View style={styles.inputContainer}>
            <TextInput
              value={input}
              onChangeText={setInput}
              placeholder="Type your message..."
              style={styles.input}
              placeholderTextColor="#999"
            />
            <TouchableOpacity onPress={handleSend} style={styles.sendButton}>
              <Icon name="arrow-forward" size={20} color="#fff" />
            </TouchableOpacity>
          </View>
        </>
      )}
    </View>
  );
};

export default ChatScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 12,
    backgroundColor: '#FFFFFF',
  },
  messageWrapper: {
    flex: 1,
  },
  messageBubble: {
    padding: 10,
    borderRadius: 16,
    marginVertical: 4,
    maxWidth: '80%',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 3,
    overflow: 'hidden',
    alignSelf: 'flex-start',
  },

  incoming: {
    backgroundColor: '#f0f0f0',
    alignSelf: 'flex-start',
  },
  outgoing: {
    backgroundColor: '#4B9EFF',
    alignSelf: 'flex-end',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 10,
    borderRadius: 10,
    fontSize: 15,
    color: '#333',
  },
  sendButton: {
    backgroundColor: '#4B9EFF',
    padding: 14,
    marginLeft: 8,
    justifyContent: 'center',
    borderRadius: 10,
  },
  scrollButton: {
    position: 'absolute',
    bottom: 25,
    right: 10,
    padding: 4,
    borderRadius: 50,
    elevation: 4,
  },
  scrollButtonBackground: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
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

});
