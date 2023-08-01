import React, { useState, useEffect } from 'react';
import { Text, View, SafeAreaView, TouchableOpacity, ScrollView, FlatList, Image, Animated } from 'react-native';
import { Stack } from 'expo-router';
import { db, auth } from '../../../firebase';
import { COLORS, imae } from '../../../constants';
import GoodICons from '@expo/vector-icons/Ionicons'
import { ActivityIndicator } from 'react-native-paper';
import { RefreshControl } from 'react-native-gesture-handler';
import { useRouter } from 'expo-router';
import Swipeable from 'react-native-swipeable';
 
const ChatSection = () => {
  const [loading, setLoading] = useState(false);
  const [chats, setChats] = useState([]);
  const [usernames, setUsernames] = useState({});
  const router = useRouter();


  const fetchChat = async () => {
    try {
      const currentUser = auth.currentUser;

      if (currentUser) {
        const userId = currentUser.uid;

        const chatsRef = db.collection('chats');
        const snapshot = await chatsRef
          .where('participants', 'array-contains-any', [userId])
          .get();

        const fetchedChats = [];

        snapshot.forEach(doc => {
          const chat = doc.data();
          fetchedChats.push({
            id: doc.id,
            ...chat,
          });
        });

        setChats(fetchedChats);
        setLoading(false);
      } else {
        console.log('User not authenticated.');
        setLoading(false);
      }
    } catch (error) {
      console.log('Error fetching chats:', error);
    }
  };

  const getUsername = async (userId) => {
    try {
      const docRef = db.collection('users').doc(userId);
      const docSnapshot = await docRef.get();

      if (docSnapshot.exists) {
        const userData = docSnapshot.data();
        const username = userData.username;
        return username;
      } else {
        throw new Error('User document not found');
      }
    } catch (error) {
      console.error('Error retrieving username:', error);
      throw error;
    }
  };

  useEffect(() => {
    fetchChat();
  }, []);

  useEffect(() => {
    const getUsernames = async () => {
      const usernameMap = {};
      for (const chat of chats) {
        const userId = chat.chatstarter;
        if (!usernameMap[userId]) {
          const username = await getUsername(userId);
          usernameMap[userId] = username;
        }
      }
      setUsernames(usernameMap);
    };

    if (chats.length > 0) {
      getUsernames();
    }
  }, [chats]);

  const refreshPosts = () => {
    setLoading(true);
    fetchChat();
  };



  const UserCard = (item) => {
    const currentUserId = auth.currentUser.uid;
    const isCurrentUserSender = currentUserId === item.userId;
    const username = isCurrentUserSender ? usernames[item.chatstarter] : item.username;
 
    return (
      <View style={{ width: '100%', paddingLeft: 20, marginBottom: 0, }}>
       
        <TouchableOpacity
          onPress={() => {
            if (currentUserId === item.userId) {

              router.push({
                pathname: `chat/${username}`,
                params: {
                  senderIds: item.chatstarter, receiverIds: item.userId, users: username, myID: currentUserId
                }
              });
            } else {

              router.push({
                pathname: `chat/${item.username}`,
                params: {
                  senderIds: item.chatstarter, receiverIds: item.userId, users: item.username, myID: currentUserId
                }
              });
            }
          }}
          style={{
            width: '100%',
            height: 75,
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: COLORS.lightWhite,
            // borderRadius: 14,
            // borderWidth: 1,
            borderColor: '#f0f0f0',
          }}
        >
          <View
            style={{
              height: 65,
              justifyContent: 'center',
              alignItems: 'flex-start',
              marginRight: 12,
              // paddingLeft: 10,
            }}
          >
            <Image source={imae.profile} style={{ width: 55, height: 55, borderRadius: 52 }} resizeMode="cover" />
          </View>

          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'flex-start', marginBottom: 4 }}>
            <View>
              <Text style={{ fontSize: 19, maxWidth: '100%', color: COLORS.main, fontWeight: 400, marginBottom: 4 }} numberOfLines={2}>
                {username}
              </Text>
              <Text style={{ fontSize: 13, maxWidth: '85%', marginRight: 4, color: COLORS.gray }} numberOfLines={1}>
                {item.lastMessage}
              </Text>
            </View>
          </View>
        </TouchableOpacity>      
      </View>
    );
  };

  return (
    <SafeAreaView style={{
      flex: 1,
      backgroundColor: COLORS.lightWhite
    }}>
      <Stack.Screen
        options={{ headerShown: false }}
      />

      <View style={{
        alignItems: "flex-start",
        paddingHorizontal: 20,
        marginBottom: 17,
      }}>
        <Text style={{ fontFamily: 'AvenirNext-DemiBold', fontWeight: 700, fontSize: 24, }}>Chats</Text>
        <Text style={{ fontFamily: 'Avenir-Medium', fontSize: 15, color: COLORS.gray }}>Start a chat by swiping right on the products</Text>
      </View>


      <TouchableOpacity onPress={()=>{router.push('/searchsc/SearchScreen')}}>
        <View style={{
          paddingHorizontal: 20,
          justifyContent: "center",
          alignItems: "center",

          height: 50,
          marginBottom: 10,
        }}>
          <View style={{
            flex: 1,
            backgroundColor: COLORS.lightWhite,
            alignItems: "center",
            flexDirection: "row",
            borderRadius: 14,
            height: "100%",
            width: "100%",
            paddingHorizontal: 20,
            borderWidth: 1,
            borderColor: COLORS.border,
          }}>
            <GoodICons name="ios-search-outline" size={24} color={COLORS.gray2} />
            <Text style={{ color: COLORS.gray2, paddingHorizontal: 12, fontSize: 15, }}>What are you looking for?</Text>
          </View>
        </View>
      </TouchableOpacity>

      {loading ? (
        <ActivityIndicator color={COLORS.main} />
      ) : (
        <>
          {chats.length === 0 ? (
            <ScrollView contentContainerStyle={{ marginTop: 140, alignItems: 'center', justifyContent: 'center', }}
              refreshControl={
                <RefreshControl refreshing={loading} onRefresh={refreshPosts} />
              }>

              <Text style={{ fontWeight: 600, fontSize: 16, color: COLORS.border }}>
                No chat found

              </Text>
              <Text style={{ fontWeight: 600, fontSize: 16, color: COLORS.border }}> pull down to refresh</Text>

            </ScrollView>
          ) : (
            <View style={{ height: '81%', }}>
              <FlatList
                data={chats}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => UserCard(item)}
                refreshControl={
                  <RefreshControl refreshing={loading} onRefresh={refreshPosts} />
                }
              />
            </View>

          )}
        </>
      )}
    </SafeAreaView>
  );
};


export default ChatSection;
