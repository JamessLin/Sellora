import { StyleSheet, Text, View, TouchableOpacity, TextInput, Button } from 'react-native'

import React, { useState, useEffect, useCallback } from 'react'
import { GiftedChat, Bubble, InputToolbar, Send } from 'react-native-gifted-chat'
import { COLORS, imae } from '../constants'
import { db, auth } from '../firebase'
import { useRouter, useLocalSearchParams, Stack } from 'expo-router'
import { Ionicons } from '@expo/vector-icons';
import { Feather } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { SafeAreaView } from 'react-native-safe-area-context'
import CustomInputToolbar from '../components/custominput';



const ChatPage = () => {
  const [messages, setMessages] = useState([])
  const router = useRouter();
  const { senderIds, receiverIds, users, myID } = useLocalSearchParams();
  const chatId = `${senderIds}_${receiverIds}`;
  const [images, setImages] = useState(null)


  useEffect(() => {

    const userSnapshot = db.collection('users').doc(receiverIds).get();
    if (userSnapshot.exists) {
      const userData = userSnapshot.data();
      setUsername(userData.username);
    }
    const querySnapshot = db
      .collection('chats')
      .doc(chatId)
      .collection('messages')
      .orderBy('createdAt', 'desc')
      .onSnapshot(snapshot => {
        const allMessages = snapshot.docs.map(doc => {
          return { ...doc.data(), createdAt: doc.data().createdAt.toDate() };
        });
        setMessages(allMessages);
      });

    return () => querySnapshot();
  }, []);

  const onSend = messageArray => {

    const msg = messageArray[0];
    let myMsg;
    if (myID === receiverIds) {
      myMsg = {
        ...msg,
        senderId: myID,
        receiverId: senderIds,
      };

      lastMessageText = msg.text;
    } else {
      myMsg = {
        ...msg,
        senderId: senderIds,
        receiverId: receiverIds,
      };
      lastMessageText = msg.text;
    }


  
    setMessages(previousMessages => GiftedChat.append(previousMessages, myMsg));



    db.collection('chats')
      .doc(chatId)
      .set({
        username: users,
        userId: receiverIds,
        chatstarter: senderIds,
        avatar: imae.profile,
        participants: [senderIds, receiverIds],
        lastMessage: lastMessageText
      })
      .then(() => {
        db.collection('chats')
          .doc(chatId)
          .collection('messages')
          .add({
            ...myMsg,
            createdAt: new Date(),
          })
          .catch(error => {
            console.log('Error adding message:', error);
          });
      })
      .catch(error => {
        console.log('Error adding chat:', error);
      });
  };



  return (
    <View style={{ flex: 1, paddingVertical: 20, backgroundColor: COLORS.lightWhite }}>
      <Stack.Screen
        options={{
          title: users,
          headerTitleStyle: {
            fontSize: 18,
          },
          headerStyle: {
            backgroundColor: COLORS.lightWhite
          },

        }}

      />

      <GiftedChat
        messages={messages}
        onSend={messages => onSend(messages)}
        user={
          {
          _id: myID,
          name: users,
        }}
        renderBubble={props => {
          return (
            <Bubble {...props} wrapperStyle={{
            
              right: {
                backgroundColor: COLORS.theme1
              },

            }} />
          )
        }}
        renderInputToolbar={props =>  <CustomInputToolbar {...props} />}

     

      />
    </View >

  )

}




export default ChatPage

const styles = StyleSheet.create({})

