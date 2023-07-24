import React, { useRef, useCallback, useState, useMemo, useEffect } from 'react';
import { View, SafeAreaView, Text, ScrollView, Platform, TouchableOpacity, Image, Modal, StyleSheet, TextInput } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { Welcome, UserPost } from '../../../components';
import { COLORS, icons, imae } from '../../../constants';
import BottomSheet, {
    BottomSheetView, BottomSheetTextInput, BottomSheetModal,
    BottomSheetModalProvider,
} from '@gorhom/bottom-sheet'
import { db, auth } from '../../../firebase'
import { serverTimestamp } from 'firebase/firestore';

import GoodICons from '@expo/vector-icons/Ionicons'
import * as ImagePicker from 'expo-image-picker';
import ActionButton from 'react-native-action-button-warnings-fixed';

export default function Home() {
    const router = useRouter();
    const [isOpen, setIsOpen] = useState(false);
    const bottomSheetRef = useRef();
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [images, setImages] = useState([]);
    const [pricing, setPricing] = useState('');

    const [selectedCategory, setSelectedCategory] = useState('');
    //this for bottomsheet modal fucken UPDATES 
    const bottomSheetModalRef = useRef();
    const snapPoints1 = useMemo(() => ['89%'], []);

    const handleClosePress = () => bottomSheetRef.current.close()
    const snapPoints = useMemo(() => ['100%'], []);


    const categories = [
        { id: 'fashion', label: 'Fashion' },
        { id: 'sporting', label: 'Sporting' },
        { id: 'electronic', label: 'Electronic' },
        { id: 'cars', label: 'Cars' },
        { id: 'others', label: 'Others' },
    ];

    const handleCategorySelection = (categoryId) => {
        setSelectedCategory(categoryId);

    };


    const openBottomSheet = useCallback((index) => {

        bottomSheetRef.current?.snapToIndex(index);

    }, [])



    const handlePresentModalPress = useCallback(() => {
        bottomSheetModalRef.current?.present();
    }, []);

    const handleButtonClick = useCallback(() => {
        if (isOpen === true) {
            setIsOpen(false);

            handleClosePress()
        } else {
            openBottomSheet(0);
            setIsOpen(true);
        }
    }, [isOpen, openBottomSheet]);


    const handleCreatePost = () => {
        if (!title || !description || images.length === 0 || !pricing || !selectedCategory) {
            alert('Please fill in all the required fields.');
            return;
        }
        const user = auth.currentUser;

        if (user) {
            const userId = user.uid;


            db.collection('users').doc(userId).get()
                .then((doc) => {
                    if (doc.exists) {
                        const username = doc.data().username;


                        db.collection('posts')
                            .add({
                                title,
                                description,
                                images,
                                pricing,
                                userId,
                                username,
                                selectedCategory,
                                timestamp: serverTimestamp(),
                            })
                            .then(() => {
                                alert('Post created successfully!');

                                setTitle('');
                                setDescription('');
                                setImages([]);
                                setPricing('');
                            })
                            .catch((error) => {
                                alert('Error creating post:', error);
                            });
                    } else {
                        alert('User document not found.');
                    }
                })
                .catch((error) => {
                    alert('Error retrieving user document:', error);
                });
        } else {
            alert('User not authenticated. Please log in.');
        }
    };

    useEffect(() => {
        (async () => {

            if (Platform.OS !== "web") {
                const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync()
                if (status !== 'granted') {
                    alert('no permission granted')
                }
            }
        })

    }, [])

    const pickImage = async () => {
        let permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (permissionResult.granted === false) {
            alert('Permission denied for accessing media library');
            return;
        }

        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsMultipleSelection: true,
            selectionLimit: 5,
            aspect: [4, 3],
            quality: 0.8,
        });

        if (!result.canceled) {
            const selectedImages = result.assets.map((asset) => asset.uri);
            setImages((prevImages) => [...prevImages, ...selectedImages]);
        }
    };

    const handleDeleteImage = (index) => {
        setImages((prevImages) => {
            const updatedImages = [...prevImages];
            updatedImages.splice(index, 1);
            return updatedImages;
        });
    };

    const titleInputRef = useRef(null);
    const descriptionInputRef = useRef(null);
    const pricingInputRef = useRef(null);

    useEffect(() => {
        if (isOpen && titleInputRef.current) {
            titleInputRef.current.focus();
        }
    }, [isOpen]);

    const handleDescriptionSubmit = () => {
        setDescription(prevDescription => prevDescription + '\n');
    };

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.lightWhite }}>
            <Stack.Screen
                options={{
                    headerTitle: 'Sellora',
                    headerTitleStyle: {
                        fontSize: 18,
                        fontFamily: 'Avenir-Book',
                    },
                    headerStyle: {
                        backgroundColor: COLORS.lightWhite,

                    },
                    headerLeft: () => (
                        <TouchableOpacity style={{ backgroundColor: COLORS.lightWhite, width: 42, height: 42, borderRadius: 10, backgroundColor: COLORS.white, justifyContent: 'center', alignItems: 'center' }}>
                            <Image source={icons.menu}
                                resizeMode="cover"
                                style={{ height: 23, width: 23 }}
                            />
                        </TouchableOpacity>
                    ),
                    headerRight: () => (
                        <TouchableOpacity style={{ width: 42, height: 42, borderRadius: 10, justifyContent: 'center', alignItems: 'center', backgroundColor: COLORS.white }} 
                        onPress={() => {
                            router.push('/SignOut') 
                            // router.push('/ChatPage')
                             }}>
                            <GoodICons name="ios-person-outline" size={24} color={COLORS.main} />

                        </TouchableOpacity>
                    )

                }}

            />
            <View
                style={{
                    flex: 1
                }}>
                <Welcome />

                <View style={{ flex: 1 }}>
                    <UserPost />
                </View>


            </View>

            <BottomSheetModalProvider>
                {isOpen && (

                    <BottomSheet
                        ref={bottomSheetRef}
                        snapPoints={snapPoints}
                        enablePanDownToClose={true}
                        onClose={() => {
                            bottomSheetModalRef.current?.close();
                            setIsOpen(false);


                        }
                        }
                        initialSnap={0}

                    >

                        <BottomSheetView style={{ alignItems: 'center', marginBottom: 26, }}>
                            <Text style={{ fontWeight: 600, fontSize: 16, paddingTop: 18, paddingBottom: 20, }}> Create Item</Text>
                            <Seperator />
                        </BottomSheetView>

                        <BottomSheetView style={{
                            alignItems: 'flex-start',
                            justifyContent: 'flex-start',
                            paddingHorizontal: 14,
                        }}
                        >


                            <BottomSheetTextInput style={{
                                fontSize: 25,
                                padding: 8,

                                backgroundColor: 'transparent',
                                textAlign: 'left',
                                marginBottom: 20,
                            }}
                                ref={titleInputRef}
                                value={title}
                                onChangeText={(text) => setTitle(text)}

                                placeholder='Title'
                                placeholderTextColor={COLORS.gray}
                                onSubmitEditing={() => descriptionInputRef.current.focus()}
                            />

                            <BottomSheetTextInput style={{
                                fontSize: 16,
                                padding: 8,

                                backgroundColor: 'transparent',
                                textAlign: 'left'
                            }}

                                ref={descriptionInputRef}
                                value={description}
                                onChangeText={(text) => setDescription(text)}

                                placeholder='Description (required)'
                                placeholderTextColor={COLORS.gray}
                                onSubmitEditing={handleDescriptionSubmit}
                                multiline

                            />
                        </BottomSheetView>

                        <View style={{ flex: 1, justifyContent: 'flex-end', paddingHorizontal: 22, marginBottom: 12, }}>
                            <ScrollView horizontal={true} style={{ marginTop: 10 }}>
                                {images.map((image, index) => (
                                    <View key={index} style={{ marginRight: 10 }}>
                                        <Image source={{ uri: image }} style={{ width: 50, height: 50 }} />
                                        <TouchableOpacity
                                            style={{
                                                position: 'absolute',
                                                top: 5,
                                                right: 5,
                                                width: 20,
                                                height: 20,
                                                borderRadius: 10,
                                                backgroundColor: COLORS.lightGrey,
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                            }}
                                            onPress={() => handleDeleteImage(index)}
                                        >
                                            <GoodICons name="ios-close" size={12} color={COLORS.transparentBlack8} />
                                        </TouchableOpacity>
                                    </View>
                                ))}
                            </ScrollView>


                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 20 }}>
                                <TouchableOpacity
                                    style={{
                                        width: 45,
                                        aspectRatio: 1,

                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        borderRadius: 12,
                                        backgroundColor: COLORS.white

                                    }}
                                    onPress={pickImage}
                                >
                                    <GoodICons name="ios-image-outline" size={24} color={COLORS.transparentBlack8} />
                                </TouchableOpacity>
                                <BottomSheetTextInput style={{
                                    fontSize: 15,
                                    paddingVertical: 13,
                                    paddingHorizontal: 13,
                                    borderRadius: 12,

                                    textAlign: 'left',
                                    borderWidth: 1,
                                    borderColor: COLORS.border,

                                }}
                                    ref={pricingInputRef}
                                    value={pricing}
                                    onChangeText={(text) => setPricing(text)}
                                    keyboardType='numeric'
                                    placeholder='Pricing (required, in USD $)'
                                    placeholderTextColor={COLORS.gray}

                                />
                                <TouchableOpacity
                                    style={{
                                        paddingVertical: 13,
                                        paddingHorizontal: 16,
                                        borderRadius: 12,
                                        backgroundColor: COLORS.theme1,
                                    }}

                                    onPress={handlePresentModalPress}
                                >
                                    <Text style={{ color: COLORS.white, fontWeight: 'bold', fontSize: 16 }}>Next</Text>
                                </TouchableOpacity>

                            </View>
                        </View>


                    </BottomSheet>



                )}
                <BottomSheetModal
                    ref={bottomSheetModalRef}
                    snapPoints={["88.7%"]}
                    style={{
                        borderWidth: 1,
                        borderColor: COLORS.border,
                    }}
                    enablePanDownToClose={true}
                    handleIndicatorStyle={{ display: "none" }}

                >
                    <View style={{ paddingHorizontal: 20, marginBottom: 20, flexDirection: 'row', justifyContent: 'space-between' }}>
                        <Text style={{ fontSize: 20, fontFamily: 'AvenirNext-DemiBold' }}>Select Category</Text>
                        <TouchableOpacity onPress={() => { bottomSheetModalRef.current?.close(); }}>
                            <GoodICons name="ios-close-outline" size={24} color="black" />
                        </TouchableOpacity>
                    </View>

                    {categories.map((category) => (
                    
                        <View style={{
                            marginBottom: 10,
                            borderRadius: 10,
                            paddingHorizontal: 20,
                        }}    key={category.id}>
                            <TouchableOpacity
                                key={category.id}
                                onPress={() => handleCategorySelection(category.id)}
                                style={{
                                    borderWidth: 1,
                                    borderColor: COLORS.border,
                                    borderRadius: 10,
                                    paddingVertical: 10,
                                    paddingHorizontal: 20,
                                    backgroundColor: selectedCategory === category.id ? COLORS.theme1 : 'white',
                                }}
                            >
                                <Text style={{ color: selectedCategory === category.id ? 'white' : 'black' }}>
                                    {category.label}
                                </Text>
                            </TouchableOpacity>
                        </View>
                    ))}
                    <View style={{ paddingHorizontal: 20, justifyContent: 'center', alignItems: 'flex-end' }}>
                        <TouchableOpacity
                            style={{
                                paddingVertical: 10,
                                paddingHorizontal: 20,
                                borderRadius: 10,
                                backgroundColor: COLORS.theme1,
                                width: 126,
                            }}

                            onPress={handleCreatePost}
                        >
                            <Text style={{ color: COLORS.white, fontWeight: 'bold' }}>Create Item!</Text>
                        </TouchableOpacity>
                    </View>
                </BottomSheetModal>
            </BottomSheetModalProvider>
            {!isOpen && (
                <ActionButton
                    buttonColor={COLORS.theme1}

                    onPress={handleButtonClick}
                    renderIcon={active => active ? (<GoodICons name="ios-add" size={30} color="white" />) : (<GoodICons name="ios-add" size={30} color="white" />)}

                />)}

        </SafeAreaView>
    )
}


const Seperator = () => <View style={{
    height: 1,
    width: '100%',
    backgroundColor: COLORS.border,
    marginBotton: 25,
}} />