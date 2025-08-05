import React, { useEffect, useState } from 'react'
import { View, Text, FlatList, TouchableOpacity, Image, ActivityIndicator, StyleSheet } from 'react-native'
import { useAppSelector } from '../store/hooks'
import { useNavigation } from '@react-navigation/native'
import { RootStackParamList } from '../navigation/types'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { getChatThreads } from '../api/chat'


type Thread = {
  chatId: string
  participant: {
    _id: string
    name: string
    email: string
    profilePicture?: string
  }
  latestMessage: {
    message: string
    receiverId: string
    senderId: string
    seen: Boolean
    reminderSent: Boolean
  }
}

const ChatListScreen = () => {
  const user = useAppSelector((state) => state.user.user)
  const [threads, setThreads] = useState<Thread[]>([])
  const [loading, setLoading] = useState(false)

  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList, 'Chat'>>()

  useEffect(() => {
    const fetchThreads = async () => {
      try {
        console.log("User", user?._id)
        if (!user) return
        setLoading(true)
        const res = await getChatThreads(user._id)
        console.log(res)
        setThreads(res)
      } catch (err) {
        console.error('Failed to fetch chat threads:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchThreads()
  }, [])

  const renderItem = ({ item }: { item: Thread }) => (
    <TouchableOpacity
      onPress={() => {
        navigation.navigate('Chat', {
          chatId: item.chatId,
          participant: item.participant,
        })

      }

      }
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
        backgroundColor: '#fff',
      }}
    >
      <Image
        source={{ uri: item.participant.profilePicture }}
        style={{ width: 48, height: 48, borderRadius: 24, marginRight: 12 }}
      />
      <View style={{ flex: 1 }}>
        <Text style={{ fontWeight: 'bold', fontSize: 16 }}>{item.participant.name}</Text>
        <Text
          numberOfLines={1}
          ellipsizeMode="tail"
          style={{ color: '#777', fontSize: 14, marginTop: 4 }}
        >
          {item.latestMessage?.message || 'Start chatting...'}
        </Text>
      </View>
    </TouchableOpacity>
  )

  if (!user) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Login required</Text>
      </View>
    )
  }



  return (
    <View style={{ flex: 1, backgroundColor: '#FFFFFF' }}>
      {loading ? (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color="#4B9EFF" />
          <Text style={styles.loaderText}>Loading chats...</Text>
        </View>
      ) : !threads || threads.length === 0 ? (
        <Text style={{ textAlign: 'center' }}>You have no chats yet</Text>
      ) : (
        <FlatList
          data={threads}
          keyExtractor={(item) => item.chatId}
          renderItem={renderItem}
          ItemSeparatorComponent={() => <View style={{ height: 1, backgroundColor: '#eee' }} />}
        />
      )}
    </View>
  )
}

export default ChatListScreen


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
});