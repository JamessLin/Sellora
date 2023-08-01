import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { View, Text, TouchableOpacity, FlatList, Alert, StyleSheet, ScrollView, RefreshControl, Image, KeyboardAvoidingView , TextInput } from 'react-native';
import { db, auth } from '../../../firebase';
import GoodICons from '@expo/vector-icons/Ionicons'
import { Swipeable } from 'react-native-gesture-handler';
import { COLORS, imae, SIZES, icons } from '../../../constants';
import { Entypo } from '@expo/vector-icons';
import { useRouter, Stack } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import CardMain from '../../../components/common/createCard/cardshow';
import { ActivityIndicator } from 'react-native-paper';
import { serverTimestamp } from 'firebase/firestore';
import BottomSheet, {
  BottomSheetView, BottomSheetTextInput, BottomSheetModal,
  BottomSheetModalProvider, BottomSheetFooter,
} from '@gorhom/bottom-sheet'

const explore = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [posts, setPosts] = useState([]);
  const [username, setUsername] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const bottomSheetRef = useRef();
  const snapPoints = useMemo(() => ['80%'], []);
  const [selectedItem, setSelectedItem] = useState(null);
  const [sselectedItem, setsSelectedItem] = useState(null);
  const currentUserId = auth.currentUser.uid;
  const bottomSheetModalRef = useRef();
  const [comments, setComments] = useState(['']);
  const [commentText, setCommentText] = useState('');
  const [selectedPostId, setSelectedPostId] = useState(null);
  const commentsRef = db.collection('comments');
  const commentInputRef = useRef(null);
  const categories = [
    { id: '', label: 'All' },
    { id: 'fashion', label: 'Fashion' },
    { id: 'sporting', label: 'Sporting' },
    { id: 'electronic', label: 'Electronic' },
    { id: 'cars', label: 'Cars' },
    { id: 'others', label: 'Others' },
  ];


  useEffect(() => {
    fetchPosts();
  }, []);

  const handlePresentModalPress = useCallback(() => {
    bottomSheetModalRef.current?.present();
  }, []);


  useEffect(() => {
    const fetchComments = async (selectedPostId) => {
      try {
        commentsRef
          .where('postId', '==', selectedPostId)
          .orderBy('timestamp', 'asc')
          .onSnapshot((snapshot) => {
            const fetchedComments = snapshot.docs.map((doc) => ({
              id: doc.id,
              ...doc.data(),
            }));
            setComments(fetchedComments);
          });
      } catch (error) {
        console.error('Error fetching comments:', error);
      }
    };

    if (selectedPostId) {
      fetchComments(selectedPostId);
    }
  }, [selectedPostId]);

  const handleCommentSubmit = () => {
    if (commentText.trim() === '') {
      alert('Please enter a comment.');
      return;
    }

    const user = auth.currentUser;

    if (user) {
      const userId = user.uid;

      // Fetch the username from Firestore
      db.collection('users')
        .doc(userId)
        .get()
        .then((doc) => {
          if (doc.exists) {
            const username = doc.data().username;


            const comment = {
              text: commentText,
              postId: selectedPostId,
              userId,
              username,
              timestamp: serverTimestamp(),
            };

            db.collection('comments').add(comment);

            setCommentText('');
            console.log(comments);
          } else {
            console.error('User document not found.');
          }
        })
        .catch((error) => {
          console.error('Error fetching user:', error);
        });
    } else {
      alert('User not authenticated. Please log in.');
    }
  };



  const refreshPosts = () => {
    setLoading(true);
    fetchPosts(selectedCategory);
  };


  const handleCategorySelection = (categoryId) => {
    setSelectedCategory(categoryId);

    fetchPosts(categoryId);
  };

  const fetchPosts = async (categoryId) => {
    try {
      setLoading(true);

      let query = db.collection('posts').orderBy('timestamp', 'desc');

      if (categoryId) {
        query = query.where('selectedCategory', '==', categoryId);
      }

      const snapshot = await query.get();
      const fetchedPosts = [];

      snapshot.forEach((doc) => {
        const post = doc.data();
        fetchedPosts.push({
          id: doc.id,
          ...post,
        });
      });

      setPosts(fetchedPosts);
      setLoading(false);
    } catch (error) {
      console.log('Error fetching posts:', error);
    }
  };


  const handleCardPress = (item) => {

    setSelectedItem(item);

  };

  const snapPointsss = useMemo(() => ['25%', '50%'], []);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const handleCardPresss = (item) => {
    console.log(item.id)
    setSelectedPostId(item.id)
    setsSelectedItem(item);
  };

  const switchToNextImage = () => {
    const nextIndex = (currentImageIndex + 1) % sselectedItem.images.length;
    setCurrentImageIndex(nextIndex);
  };
  const switchToPreviousImage = () => {
    const prevIndex =
      (currentImageIndex - 1 + sselectedItem.images.length) % sselectedItem.images.length;
    setCurrentImageIndex(prevIndex);
  };

  return (
    <SafeAreaView style={[styles.container4, { backgroundColor: COLORS.lightWhite }]}>
      <Stack.Screen
        options={{ headerShown: false }}
      />

      <View style={styles.container}>
        <Text style={{ fontFamily: 'AvenirNext-DemiBold', fontWeight: 700, fontSize: 23, }}>Explore</Text>
        <Text style={{ fontFamily: 'Avenir-Medium', fontSize: 15, color: COLORS.gray }}>Uncover Saipan's treasures. Buy local, connect.</Text>
      </View>



      <TouchableOpacity onPress={() => { router.push('/searchsc/SearchScreen') }}>
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

      <View style={{ paddingHorizontal: 20, }}>
        <FlatList
          data={categories}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[
                {
                  paddingHorizontal: 12,
                  paddingVertical: 8,
                  marginRight: 8,
                  borderRadius: 10,
                  borderWidth: 1,
                  borderColor: COLORS.border,
                  backgroundColor: COLORS.lightWhite,
                  marginBottom: 10,
                },
                item.id === selectedCategory && { backgroundColor: COLORS.theme1, borderColor: 'transparent' },
              ]}
              onPress={() => handleCategorySelection(item.id)}
            >

              <Text style={[{
                fontSize: 14,
                fontWeight: 'bold',
                color: COLORS.main,
                fontFamily: 'Avenir-Medium'
              }, item.id === selectedCategory && { color: 'white' }


              ]} >{item.label}</Text>
            </TouchableOpacity>
          )}
          horizontal
          showsHorizontalScrollIndicator={false}
        />
      </View>

      {loading ? (
        <ActivityIndicator color={COLORS.main} />
      ) : (
        <>
          {posts.length === 0 ? (
            <ScrollView contentContainerStyle={{ marginTop: 140, alignItems: 'center', justifyContent: 'center', }}
              refreshControl={
                <RefreshControl refreshing={loading} onRefresh={refreshPosts} />
              }>

              <Text style={{ fontWeight: 600, fontSize: 16, color: COLORS.border }}>
                No product in this page at this moment

              </Text>
              <Text style={{ fontWeight: 600, fontSize: 16, color: COLORS.border }}> pull down to refresh</Text>

            </ScrollView>
          ) : (
            <View style={{ height: '81%', }}>
              <FlatList
                data={posts}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => <CardMain item={item} onPress={() => handleCardPress(item)} onOpen={() => handleCardPresss(item)} postId={item.id} />}
                refreshControl={
                  <RefreshControl refreshing={loading} onRefresh={refreshPosts} />
                }
              />
            </View>

          )}
        </>
      )}

      {selectedItem && (
        <BottomSheet
          ref={bottomSheetRef}
          enablePanDownToClose={true}
          snapPoints={snapPoints}
          onClose={() => {
            bottomSheetRef.current?.close();
            setSelectedItem(false);
          }}

          detached={true}
          initialSnap={0}
          bottomInset={100}

          style={{
            backgroundColor: 'transparent',
            marginHorizontal: 24,
            shadowColor: "#000",
            shadowOffset: {
              width: 0,
              height: 9,
            },
            shadowOpacity: 0.48,
            shadowRadius: 11.95,

            elevation: 18,
          }}
        >
          <View>
            <View style={{ justifyContent: 'center', alignItems: 'center', marginBottom: 10 }}>
              <Text style={{ fontSize: 18, fontFamily: 'Avenir-Medium', fontWeight: 500 }}>{selectedItem.title}</Text>
            </View>
            <View style={{ height: 300, }}>
              {selectedItem.images && selectedItem.images.length > 0 && (
                <>
                  <Image
                    source={{ uri: selectedItem.images[0] }}
                    style={{ width: '100%', height: '80%' }}
                    resizeMode="cover"
                  />
                </>
              )}
              <View style={{ paddingHorizontal: 20, marginTop: 10, }}>
                <Text style={{ fontSize: 18, fontFamily: 'Avenir-Medium', fontWeight: 700 }}>Description</Text>
                <Text style={{ fontSize: 13, fontFamily: 'Avenir-Medium', fontWeight: 400 }} numberOfLines={1}>{selectedItem.description}</Text>
              </View>
              <View style={{ paddingHorizontal: 20, marginTop: 20, flexDirection: 'row', gap: 20, alignItems: 'center', }}>
                <View>
                  <Text style={{ fontSize: 17, fontFamily: 'Avenir-Medium', fontWeight: 700 }}>Price</Text>
                  <Text style={{ fontSize: 15, fontFamily: 'Avenir-Medium', fontWeight: 400, color: COLORS.gray }}>$ {selectedItem.pricing}</Text>
                </View>
                <View>
                  <Text style={{ fontSize: 17, fontFamily: 'Avenir-Medium', fontWeight: 700 }}>Category </Text>
                  <Text style={{ fontSize: 15, fontFamily: 'Avenir-Medium', fontWeight: 400, color: COLORS.gray }}>  {selectedItem.selectedCategory}</Text>
                </View>
              </View>
              <View style={{ paddingHorizontal: 20, flexDirection: 'row' }}>
                <View
                  style={{
                    height: 90,
                    justifyContent: 'center',
                    alignItems: 'flex-start',
                    marginRight: 12,
                    // paddingLeft: 10,
                  }}
                >
                  <Image source={imae.profile} style={{ width: 40, height: 40, borderRadius: 52 }} resizeMode="cover" />
                </View>

                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'flex-start', marginBottom: 4 }}>
                  <View>
                    <Text style={{ fontSize: 16, maxWidth: '100%', color: COLORS.main, fontWeight: 400, marginBottom: 4 }} numberOfLines={2}>
                      {selectedItem.username}
                    </Text>
                    <Text style={{ fontSize: 12, maxWidth: '85%', marginRight: 4, color: COLORS.gray }} numberOfLines={1}>
                      {selectedItem.timestamp.toDate().toLocaleString('en-US')}
                    </Text>
                  </View>
                </View>
              </View>
              <View style={{ paddingHorizontal: 20, justifyContent: 'flex-end', }}>
                <TouchableOpacity
                  style={{
                    paddingVertical: 13,
                    paddingHorizontal: 16,
                    borderRadius: 12,
                    backgroundColor: COLORS.theme1,
                    justifyContent: 'center',
                    alignItems: 'center',
                    flexDirection: 'row',
                    gap: 5,
                  }}
                  onPress={() => {
                    if (auth.currentUser.uid != selectedItem.userId) {
                      router.push({
                        pathname: `chat/${selectedItem.username}`, params: {
                          senderIds: auth.currentUser.uid, receiverIds: selectedItem.userId, users: selectedItem.username, myID: currentUserId
                        }
                      })
                    } else {
                      Alert.alert("You cant message yourself")
                    }

                  }}
                >
                  <Text style={{ color: COLORS.white, fontWeight: 'bold', fontSize: 16, }}>Message Seller</Text>
                  <GoodICons name="ios-chatbubbles-outline" size={24} color="white" />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </BottomSheet>
      )}

      <BottomSheetModalProvider>
        {sselectedItem && (
          <BottomSheet
            ref={bottomSheetRef}
            enablePanDownToClose={true}
            snapPoints={['93%']}
            onClose={() => {
              bottomSheetRef.current?.close();
              setsSelectedItem(false);
            }}

            containerStyle={{ backgroundColor: COLORS.transparentBlack3 }}
            initialSnap={0}

          >
            <View>
              <View style={{ justifyContent: 'center', alignItems: 'center', marginBottom: 10 }}>
                <Text style={{ fontSize: 18, fontFamily: 'Avenir-Medium', fontWeight: 500 }}>{sselectedItem.title}</Text>
              </View>
              <View style={{ height: 300, position: 'relative' }}>
                {sselectedItem.images && sselectedItem.images.length > 0 && (
                  <>
                    <Image
                      source={{ uri: sselectedItem.images[currentImageIndex] }}
                      style={{ width: '100%', height: '100%' }}
                      resizeMode="cover"
                    />
                    <TouchableOpacity
                      style={{
                        position: 'absolute',
                        left: 0,
                        top: 0,
                        bottom: 0,
                        justifyContent: 'center',
                        paddingLeft: 10,
                        paddingRight: 10,
                      }}
                      onPress={switchToPreviousImage}
                    >
                      <GoodICons name="arrow-back-circle-outline" size={26} color={COLORS.white} />
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={{
                        position: 'absolute',
                        right: 0,
                        top: 0,
                        bottom: 0,
                        justifyContent: 'center',
                        paddingLeft: 10,
                        paddingRight: 10,
                      }}
                      onPress={switchToNextImage}
                    >
                      <GoodICons name="arrow-forward-circle-outline" size={26} color={COLORS.white} />
                    </TouchableOpacity>
                  </>
                )}
              </View>
            </View>
            <View style={{ paddingHorizontal: 20, marginTop: 10, flexDirection: 'row', justifyContent: 'space-between' }}>
              <Text style={{ fontSize: 20, fontFamily: 'Avenir-Medium', fontWeight: 500 }}>Description</Text>
            </View>
            <View style={{ paddingHorizontal: 20 }}>
              <Text style={{ fontSize: 15, fontFamily: 'Avenir-Medium', fontWeight: 400 }} >{sselectedItem.description}</Text>
            </View>

            <View style={{ flex: 1, paddingHorizontal: 20, paddingBottom: 10, justifyContent: 'flex-end', paddingTop: 20 }}>
              <View style={{ paddingBottom: 10, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                <View style={{ flexDirection: 'row', gap: 20 }}>
                  <View>
                    <Text style={{ fontSize: 17, fontFamily: 'Avenir-Medium', fontWeight: 500 }}>Price</Text>
                    <Text style={{ fontSize: 15, fontFamily: 'Avenir-Medium', fontWeight: 700, color: COLORS.gray }}>$ {sselectedItem.pricing}</Text>
                  </View>
                  <View>
                    <Text style={{ fontSize: 17, fontFamily: 'Avenir-Medium', fontWeight: 500 }}>Category </Text>
                    <Text style={{ fontSize: 15, fontFamily: 'Avenir-Medium', fontWeight: 700, color: COLORS.gray }}>  {sselectedItem.selectedCategory}</Text>
                  </View>
                </View>
                <TouchableOpacity

                  onPress={handlePresentModalPress}
                >
                  <GoodICons name="chatbubble-ellipses-outline" size={24} color="black" />
                </TouchableOpacity>
              </View>
              <View style={{ height: 1, backgroundColor: COLORS.border, width: "100%" }} />
              <View style={{ paddingVertical: 20, }}>
                <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                  <View
                    style={{
                      justifyContent: 'center',
                      alignItems: 'flex-start',
                      marginRight: 12,
                      // paddingLeft: 10,
                    }}
                  >
                    <Image source={imae.profile} style={{ width: 43, height: 43, borderRadius: 52 }} resizeMode="cover" />
                  </View>

                  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'flex-start', marginBottom: 4 }}>
                    <View>
                      <Text style={{ fontSize: 18, maxWidth: '100%', color: COLORS.main, fontWeight: 400, marginBottom: 4 }} numberOfLines={2}>
                        {sselectedItem.username}
                      </Text>

                      <Text style={{ fontSize: 14, maxWidth: '85%', marginRight: 4, color: COLORS.gray }} numberOfLines={1}>
                        {sselectedItem.timestamp.toDate().toLocaleString('en-US')}
                      </Text>
                    </View>
                  </View>
                </View>
              </View>
              <TouchableOpacity
                style={{
                  paddingVertical: 13,
                  paddingHorizontal: 16,
                  borderRadius: 12,
                  backgroundColor: COLORS.theme1,
                  justifyContent: 'center',
                  alignItems: 'center',
                  flexDirection: 'row',
                  gap: 5,
                }}
                onPress={() => {
                  if (auth.currentUser.uid != sselectedItem.userId) {
                    router.push({
                      pathname: `chat/${sselectedItem.username}`, params: {
                        senderIds: auth.currentUser.uid, receiverIds: sselectedItem.userId, users: sselectedItem.username, myID: currentUserId
                      }
                    })
                  } else {
                    Alert.alert("You cant message yourself")
                  }

                }}
              >
                <Text style={{ color: COLORS.white, fontWeight: 'bold', fontSize: 16, }}>Message Seller</Text>
                <GoodICons name="ios-chatbubbles-outline" size={24} color="white" />
              </TouchableOpacity>
            </View>
          </BottomSheet>

        )}

        <BottomSheetModal
          ref={bottomSheetModalRef}
          snapPoints={["100%"]}
          containerStyle={{ backgroundColor: COLORS.transparentBlack3 }}
          enablePanDownToClose={true}
          handleIndicatorStyle={{ display: "none" }}


        >

          <BottomSheetView style={{ paddingHorizontal: 20, paddingBottom: 20, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 20 }}>
            <Text style={{ fontWeight: 700, fontSize: 23, }}>Comments</Text>
            <TouchableOpacity onPress={() => { bottomSheetModalRef.current?.close(); }}>
              <GoodICons name="ios-close-outline" size={30} color="black" />
            </TouchableOpacity>
          </BottomSheetView>
          <View style={{ height: 1, backgroundColor: COLORS.border, width: '100%' }} />


          {loading ? (
            <ActivityIndicator color={COLORS.main} />
          ) : (
            <>
              {comments.length === 0 ? (

                <View style={{ height: '83%' }}>
                  <Text style={{ fontWeight: 600, fontSize: 16, color: COLORS.border }}>
                    no comments
                  </Text>
                  <Text style={{ fontWeight: 600, fontSize: 16, color: COLORS.border }}> you can be the first to create comments</Text>
                </View>

              ) : (
                <View style={{ height: '83%' }}>

                  <FlatList
                    data={comments}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={({ item }) => (
                      <View style={{ width: '100%', paddingLeft: 20, marginBottom: 0, }}>

                        <TouchableOpacity

                          style={{
                            width: '100%',
                            height: 65,
                            flexDirection: 'row',
                            alignItems: 'center',

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
                            <Image source={imae.profile} style={{ width: 35, height: 35, borderRadius: 52 }} resizeMode="cover" />
                          </View>

                          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'flex-start', marginBottom: 4 }}>
                            <View>
                              <View style={{ flexDirection: 'row' }}>

                                <Text style={{ fontWeight: 500, }} >
                                  {item.username}
                                </Text>
                                <Text style={{ fontSize: 13, maxWidth: '100%', color: COLORS.main, fontWeight: 400, marginBottom: 4, color: COLORS.gray }} numberOfLines={2}>
                                  - {item.timestamp?.toDate().toLocaleString('en-US')}
                                </Text>
                              </View>

                              <Text style={{ fontSize: 16, maxWidth: '85%', marginRight: 4, }} >
                                {item.text}
                              </Text>
                            </View>
                          </View>
                        </TouchableOpacity>
                      </View>
                    )}
                  />
                </View>

              )}  
              <BottomSheetView style={{  justifyContent: 'flex-end', }}>
                <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 10, }}>
                  <BottomSheetTextInput style={{
                    fontSize: 15,
                    paddingVertical: 13,
                    paddingHorizontal: 13,
                    borderRadius: 12,
                    height: 50,
                    width: 320,
                    textAlign: 'left',
                    borderWidth: 1,
                    borderColor: COLORS.border,
                  }}
                    value={commentText}
                    onChangeText={(text) => setCommentText(text)}
                    placeholder='Write something!'
                    placeholderTextColor={COLORS.gray}

                  />

                  <TouchableOpacity
                    onPress={handleCommentSubmit}
                  >
                    <Text style={{ color: COLORS.theme1, fontSize: 18, fontWeight: 600, }}>Send</Text>

                  </TouchableOpacity>
                </View>
              </BottomSheetView>



            </>
          )}


        </BottomSheetModal>

      </BottomSheetModalProvider>
    </SafeAreaView >

  )
}

export default explore



const styles = StyleSheet.create({
  container4: {
    flex: 1,

  },
  container: {
    alignItems: "flex-start",
    paddingHorizontal: 20,
    marginBottom: 17,
  },

  headerTitle: {
    fontSize: 24,
    fontWeight: 600,
    marginBottom: 10,
  },
  profile: {
    flex: 1,
    justifyContent: 'center',

  },

  welcome: {

    fontSize: 18, marginBottom: 5, fontWeight: 600, fontFamily: 'Avenir-Book',
  },
  welcome2: {
    color: COLORS.gray, fontSize: 13,
    fontFamily: 'Avenir-Book',
  },
  searchContainer: {
    paddingHorizontal: 24,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",

    height: 50,
    marginBottom: 10,
  },


  searchBtn: {
    width: 50,
    height: 50,
    backgroundColor: COLORS.theme1,
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
  },
  searchBtnImage: {
    width: "50%",
    height: "50%",
    tintColor: COLORS.white,
  },
})