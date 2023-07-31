import React from 'react';
import { InputToolbar, Composer, Send, Actions } from 'react-native-gifted-chat';
import { TouchableOpacity, View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../constants';
import { Feather } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';

const CustomInputToolbar = (props) => {
    const pickImage = async () => {
        let permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (permissionResult.granted === false) {
            alert('Permission denied for accessing media library');
            return;
        }
    
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            // allowsEditing: true,
            aspect: [4, 3],
            quality: 0.8,
        });
    
        if (!result.canceled) {
            const selectedImages = result.assets.map((asset) => asset.uri);
            setImages((prevImages) => [...prevImages, ...selectedImages]);
        }
    };
    //   const renderSend = (sendProps) => {
    //     return (
    //       <Send {...sendProps}>
    //         <View style={{ marginBottom:13, height:27, alignItems:'center', justifyContent:'center' }}>
    //           <Ionicons name="send" size={26} color={COLORS.theme1} />
    //         </View>
    //       </Send>
    //     );
    //   }; 
    const renderSend = (sendProps) => {
        return (

            <Send {...sendProps} containerStyle={{paddingHorizontal:5}} >
                <View style={{ marginBottom: 15, }}>
                    <Text style={{ color: COLORS.theme1, fontSize: 18, fontWeight: 600, }}>Send</Text>

                </View>

            </Send>

        );
    };

    const renderActions = () => {
        return (
            <Actions
                {...props}
                containerStyle={{
                    width: 44,
                    height: 44,
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginLeft: 4,
                    padding: 0,
                    marginBottom: 4,


                }}
                icon={() => (
                    <Feather name="image" size={26} color={COLORS.theme1} />
                )}
                options={{
                    'Take From Camera': () => {
                        pickImage()
                    },
                    'Choose From Library': () => {
                        pickImage()
                    },
                    Cancel: () => {
                        console.log('Cancel');
                    },
                }}
                optionTintColor="white"
            />
        );
    };

    const renderComposer = (composerProps, sendProps) => {
        return (



            <Composer
                {...composerProps}
                // textInputStyle={{
                //   color: '#000',
                //   backgroundColor: '#FFFFFF',
                //   borderRadius: 20,
                //   marginTop: 5,
                //   paddingHorizontal: 16,
                //   alignItems:'center',
                //   justifyContent: 'center',
                //     fontSize:17,
                //   height: 50, 
                // }}
                textInputProps={{
                    marginHorizontal: 2,
                    blurOnSubmit: true,
                    height: 40,
                    paddingTop: 13,
                    backgroundColor: COLORS.white,
                    paddingHorizontal: 15,
                    borderColor: COLORS.border,
                    borderRadius: 60,
                    fontSize: 17,
                    alignItems: 'center',
                    justifyContent: 'center',
                    // borderWidth: 1,
                    width: "100%",

                }}
            />

        );
    };

    return (
        <InputToolbar
            {...props}
            containerStyle={{
                backgroundColor: COLORS.lightWhite,
                borderTopColor: COLORS.border,
                paddingHorizontal: 20,


                // Add padding to move the input toolbar up
            }}
            renderActions={renderActions}
            renderComposer={renderComposer}
            renderSend={renderSend}
        />
    );
};

export default CustomInputToolbar;
