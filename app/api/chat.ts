import axiosInstance from './axiosInstance'

export const getChatMessages = async (user1: string, user2: string) => {
  const res = await axiosInstance.get(`/chat/thread/${user1}/${user2}`)
  return res.data
}

export const sendMessage = async (senderId: string, receiverId: string, message: any) => {
  const res = await axiosInstance.post('/chat/send', { senderId, receiverId, message })
  return res.data
}

export const markAsSeen = async (chatId: string, messageKey: string) => {
  const res = await axiosInstance.patch('/chat/mark-as-seen', { chatId, messageKey })
  return res.data
}

export const getChatThreads = async (userId: string) => {
  const res = await axiosInstance.get(`/chat/user-threads/${userId}`)
  console.log("from api", res.data)
  return res.data.threads
}