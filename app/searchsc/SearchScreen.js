import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import { View, TextInput, Button, FlatList, Text, TouchableOpacity, Image } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { db, auth } from '../../firebase'
import CardMain from '../../components/common/createCard/cardshow';
import { COLORS, imae } from '../../constants';
import { serverTimestamp } from 'firebase/firestore';
import BottomSheet, {
    BottomSheetView, BottomSheetTextInput, BottomSheetModal,
    BottomSheetModalProvider, BottomSheetFooter,
} from '@gorhom/bottom-sheet'
import GoodICons from '@expo/vector-icons/Ionicons'
import { ActivityIndicator } from 'react-native-paper';



const SearchScreen = () => {
    const router = useRouter()
    const bottomSheetRef = useRef();
    const [loading, setLoading] = useState(false);
    const snapPoints = useMemo(() => ['80%'], []);
    const bottomSheetModalRef = useRef();
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [selectedItem, setSelectedItem] = useState(null);
    const [sselectedItem, setsSelectedItem] = useState(null);
    const [comments, setComments] = useState(['']);
    const [commentText, setCommentText] = useState('');
    const [selectedPostId, setSelectedPostId] = useState(null);
    const commentsRef = db.collection('comments');
    const inputRef = useRef(null);

    const searchPostsByTitle = async (searchQuery) => {
        try {
            const postsRef = db.collection('posts');
            const querySnapshot = await postsRef
                .where('title', '>=', searchQuery)
                .where('title', '<=', searchQuery + '\uf8ff')
                .get();

            const searchResults = [];
            querySnapshot.forEach((doc) => {
                searchResults.push(doc.data());
            });

            console.log(searchResults);
            return searchResults;
        } catch (error) {
            console.error('Error searching posts by title:', error);
            return [];
        }
    };
    useEffect(() => {
        inputRef.current.focus();
    }, []);
    const handleSearch = async () => {
        if (searchQuery.trim() === '') {
            setSearchResults([]);
        } else {
            const results = await searchPostsByTitle(searchQuery);
            setSearchResults(results);
        }
    };

    const handlePresentModalPress = useCallback(() => {
        bottomSheetModalRef.current?.present();
    }, []);

    const handleCardPresss = (item) => {
        console.log(item.id)
        setSelectedPostId(item.id)
        setsSelectedItem(item);
    };

    const handleCardPress = (item) => {

        setSelectedItem(item);

    };
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


    return (
        <View style={{ flex: 1, backgroundColor: COLORS.lightWhite }}>
            <Stack.Screen options={{
                headerTitle: "Search",
                headerStyle: {
                    backgroundColor: COLORS.lightWhite
                },
            }} />

            <View style={{
                paddingHorizontal: 20,
                justifyContent: "center",
                alignItems: "center",
                marginTop: 10,
                height: 50,
                marginBottom: 20,
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
                    <TextInput
                        ref={inputRef}
                        placeholder="Enter title to search"
                        placeholderTextColor={COLORS.gray}
                        value={searchQuery}
                        onChangeText={(text) => setSearchQuery(text)}
                        style={{ fontSize: 16, paddingHorizontal: 10 }}
                        onKeyPress={handleSearch}
                    />

                </View>

            </View>


            {searchResults.length === 0 ? (
                <View style={{ marginTop: 140, alignItems: 'center', justifyContent: 'center', }}
                >
                    <Text style={{ fontWeight: 600, fontSize: 16, color: COLORS.border }}>
                        No search

                    </Text>
                    <Text style={{ fontWeight: 600, fontSize: 16, color: COLORS.border }}>Search Something</Text>

                </View>
            ) : (
                <FlatList
                    data={searchResults}
                    renderItem={({ item }) => (
                        <CardMain item={item} onPress={() => handleCardPress(item)} onOpen={() => handleCardPresss(item)} />
                    )}
                    keyExtractor={(item) => item.timestamp}
                />
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
                                                pathname: `/${selectedItem.username}`, params: {
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
                            <View style={{ height: 300, }}>
                                {sselectedItem.images && sselectedItem.images.length > 0 && (
                                    <>
                                        <Image
                                            source={{ uri: sselectedItem.images[0] }}
                                            style={{ width: '100%', height: '100%' }}
                                            resizeMode="cover"
                                        />
                                    </>
                                )}
                            </View>
                        </View>
                        <View style={{ paddingHorizontal: 20, marginTop: 10, flexDirection: 'row', justifyContent: 'space-between' }}>
                            <Text style={{ fontSize: 20, fontFamily: 'Avenir-Medium', fontWeight: 400 }}>{sselectedItem.title}</Text>
                            <TouchableOpacity

                                onPress={handlePresentModalPress}
                            >
                                <GoodICons name="chatbubble-ellipses-outline" size={24} color="black" />
                            </TouchableOpacity>
                        </View>

                        <View style={{ paddingHorizontal: 20, marginTop: 10, }}>
                            <Text style={{ fontSize: 23, fontFamily: 'Avenir-Medium', fontWeight: 700 }}>Description</Text>
                        </View>
                        <View style={{ paddingHorizontal: 20 }}>
                            <Text style={{ fontSize: 15, fontFamily: 'Avenir-Medium', fontWeight: 400 }} >{sselectedItem.description}</Text>
                        </View>

                        <View style={{ paddingHorizontal: 20, marginTop: 20, flexDirection: 'row', gap: 20, alignItems: 'center', }}>
                            <View>
                                <Text style={{ fontSize: 17, fontFamily: 'Avenir-Medium', fontWeight: 700 }}>Price</Text>
                                <Text style={{ fontSize: 15, fontFamily: 'Avenir-Medium', fontWeight: 400, color: COLORS.gray }}>$ {sselectedItem.pricing}</Text>
                            </View>
                            <View>
                                <Text style={{ fontSize: 17, fontFamily: 'Avenir-Medium', fontWeight: 700 }}>Category </Text>
                                <Text style={{ fontSize: 15, fontFamily: 'Avenir-Medium', fontWeight: 400, color: COLORS.gray }}>  {sselectedItem.selectedCategory}</Text>
                            </View>
                        </View>

                        <View style={{ flex: 1, paddingHorizontal: 20, paddingBottom: 10, justifyContent: 'flex-end', }}>
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
                                            pathname: `/${sselectedItem.username}`, params: {
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

                    keyboardBlurBehavior="restore"
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

                                <View style={{ height: '84%', }}>
                                    <Text style={{ fontWeight: 600, fontSize: 16, color: COLORS.border }}>
                                        no comments
                                    </Text>
                                    <Text style={{ fontWeight: 600, fontSize: 16, color: COLORS.border }}> you can be the first to create comments</Text>
                                </View>

                            ) : (
                                <View style={{ height: '84%', }}>
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
                                                            <Text style={{ fontSize: 14, maxWidth: '100%', color: COLORS.main, fontWeight: 400, marginBottom: 4, color: COLORS.gray }} numberOfLines={2}>
                                                                {item.username} - {item.timestamp?.toDate().toLocaleString('en-US')}
                                                            </Text>
                                                            <Text style={{ fontSize: 18, maxWidth: '85%', marginRight: 4, }} >
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

                            <View style={{ justifyContent: 'center', alignItems: 'flex-end', flexDirection: 'row', gap: 10, marginBottom: 30 }}>

                                <BottomSheetTextInput style={{
                                    fontSize: 15,
                                    paddingVertical: 13,
                                    paddingHorizontal: 13,
                                    borderRadius: 12,
                                    height: 50,
                                    width: 300,
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
                                    style={{ marginBottom: 15, }}
                                >
                                    <Text style={{ color: COLORS.theme1, fontSize: 18, fontWeight: 600, }}>Send</Text>

                                </TouchableOpacity>

                            </View>

                        </>
                    )}


                </BottomSheetModal>

            </BottomSheetModalProvider>
        </View>
    )
}

export default SearchScreen




