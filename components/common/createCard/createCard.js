import React, { useRef } from 'react';
import { View, TouchableOpacity, Animated, Text, Image, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Swipeable } from 'react-native-gesture-handler';
import { COLORS,imae } from '../../../constants';
import { db, auth } from '../../../firebase';

const CardItem = ({ item, deletePost}) => {
  const rowRef = useRef(null);

  const handleDelete = () => {
    Alert.alert(
      'Delete Post',
      'Are you sure you want to delete this post?',
      [
        {
          text: 'No',
          onPress: () => {
            console.log('user said no');
          },
        },
        {
          text: 'Yes',
          onPress: () => {
            deletePost(item.id);
          },
        },
      ]
    );
  };

  const renderLeftActions = (progress, dragX) => {
    const scale = dragX.interpolate({
      inputRange: [0, 90],
      outputRange: [0, 1],
      extrapolate: 'clamp',
    });
    return (
      <TouchableOpacity onPress={handleDelete} style={{ alignItems: 'center', justifyContent: 'center' }}>
        <Animated.View style={{ transform: [{ scale }] }}>
          <View style={{ backgroundColor: '#b5212b', borderRadius: 18, padding: 8, height: 63, width: 63, justifyContent: 'center', alignItems: 'center' }}>
            <Ionicons name="ios-trash" size={35} color="white" />
          </View>
        </Animated.View>
      </TouchableOpacity>
    );
  };

  const renderRightActions = (progress, dragX) => {
    const scale = dragX.interpolate({
      inputRange: [-90, 0],
      outputRange: [1, 0],
      extrapolate: 'clamp',
    });

    return (
      <TouchableOpacity onPress={{}} style={{ alignItems: 'center', justifyContent: 'center' }}>
        <Animated.View style={{ transform: [{ scale }] }}>
          <View style={{ backgroundColor: COLORS.theme1, borderRadius: 18, padding: 8, height: 63, width: 63, justifyContent: 'center', alignItems: 'center' }}>
            <Ionicons name="ios-create-outline" size={35} color="white" />
          </View>
        </Animated.View>
      </TouchableOpacity>
    );
  };

  const closeRow = () => {
    setTimeout(() => {
      if (rowRef.current) {
        rowRef.current.close();
      }
    }, 4000);
  };

  return (
    <View style={{ paddingHorizontal: 20, marginBottom: 10 }}>
      <Swipeable
        renderLeftActions={renderLeftActions}
        renderRightActions={renderRightActions}
        ref={rowRef}
        onSwipeableOpen={closeRow}
        leftThreshold={80}
        rightThreshold={40}
      >
        <TouchableOpacity
          style={{
            width: '100%',
            height: 125,
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: COLORS.lightWhite,
            borderRadius: 14,
            borderWidth: 1,
            borderColor: '#f0f0f0',
          }}
        >
          <View
            style={{
              width: '36%',
              height: 125,
              justifyContent: 'center',
              alignItems: 'center',
              marginRight: 12,
              shadowOffset: { width: 0, height: 0 },
              shadowColor: 'black',
              shadowOpacity: 0.2,
            }}
          >
              {item.images && item.images.length > 0 && (
              <Image source={{uri: item.images[0]}} style={{ width: '100%', height: '100%', borderTopLeftRadius: 14, borderBottomLeftRadius: 14,  }} resizeMode="cover" />
              )}
            </View>
          <View style={{ flex: 1, height: '100%', justifyContent: 'space-around' }}>
            <View>
              <Text style={{ fontSize: 18, maxWidth: '100%', color: COLORS.main, fontFamily: 'Avenir-Medium' }} numberOfLines={2}>
                {item.title}
              </Text>
              <View style={{ marginTop: 4, flexDirection: 'row', alignItems: 'center' }}>
                <Text style={{ fontSize: 18, fontFamily: 'AvenirNext-DemiBold', maxWidth: '85%', marginTop: 4, fontWeight: 600, marginRight: 4 }} numberOfLines={1}>
                  ${item.pricing}
                </Text>
              </View>
            </View>
            <View>
              <Text style={{ fontSize: 13, color: COLORS.gray2 }}>By {item.username}</Text>
              <Text style={{ fontSize: 13, color: COLORS.gray2 }}>
                {item.timestamp?.toDate().toLocaleString('en-US')}
              </Text>
            </View>
          </View>
        </TouchableOpacity>
      </Swipeable>
    </View>
  );
};

export default CardItem;



  // const renderCardItem = ({ item, index }) => {


  //   const handleDelete = () => {
  //     Alert.alert(
  //       "Delete Post",
  //       "Are you sure you want yo delete this post?",
  //       [
  //         {
  //           text: 'No', onPress: () => { console.log('user said no') }
  //         },
  //         {
  //           text: 'Yes', onPress: () => { deletePost(item.id) }
  //         },

  //       ]
  //     )

  //   };

  //   const renderLeftActions = (progress, dragX) => {
  //     const scale = dragX.interpolate({
  //       inputRange: [0, 90],
  //       outputRange: [0, 1],
  //       extrapolate: 'clamp',
  //     });
  //     return (
  //       <TouchableOpacity onPress={handleDelete} style={{ alignItems: 'center', justifyContent: 'center' }}>
  //         <Animated.View style={{ transform: [{ scale }] }}>
  //           <View style={{ backgroundColor: '#b5212b', borderRadius: 18, padding: 8, height: 63, width: 63, justifyContent: 'center', alignItems: 'center' }}>
  //             <Ionicons name="ios-trash" size={35} color="white" />
  //           </View>
  //         </Animated.View>
  //       </TouchableOpacity>
  //     );
  //   };

  //   const renderRightActions = (progress, dragX) => {
  //     const scale = dragX.interpolate({
  //       inputRange: [-90, 0],
  //       outputRange: [1, 0],
  //       extrapolate: 'clamp',
  //     });

  //     return (
  //       <TouchableOpacity onPress={{}} style={{ alignItems: 'center', justifyContent: 'center' }}>
  //         <Animated.View style={{ transform: [{ scale }] }}>
  //           <View style={{ backgroundColor: COLORS.theme1, borderRadius: 18, padding: 8, height: 63, width: 63, justifyContent: 'center', alignItems: 'center' }}>
  //             <Ionicons name="ios-create-outline" size={35} color="white" />
  //           </View>
  //         </Animated.View>
  //       </TouchableOpacity>
  //     );
  //   };
  //   let row = [];
  //   const closeRow = (index) => {
  //     setTimeout(() => {
  //       console.log('close row', index);
  //       if (row[index]) {
  //         row[index].close();
  //       }
  //     }, 4000);
  //   };
    
  //   return (

  //     <View style={{ paddingHorizontal: 20, marginBottom: 20, }}>
  //       <Swipeable
  //         renderLeftActions={renderLeftActions}
  //         renderRightActions={renderRightActions}
  //         ref={ref => (row[index] = ref)}
  //         onSwipeableOpen={() => closeRow(index)}
  //         leftThreshold={80}
  //         rightThreshold={40}
  //       >
  //         <TouchableOpacity
  //           style={{
  //             width: '100%',
  //             height: 125,

  //             flexDirection: 'row',
  //             alignItems: 'center',
  //             backgroundColor: COLORS.lightWhite,
  //             borderRadius: 14,
  //             borderWidth: 1,
  //             borderColor: '#f0f0f0'
  //           }}>
  //           <View
  //             style={{
  //               width: '36%',
  //               height: 125,
  //               justifyContent: 'center',
  //               alignItems: 'center',
  //               marginRight: 12,
  //               shadowOffset: { width: 0, height: 0 },
  //               shadowColor: 'black',
  //               shadowOpacity: .2,
  //               elevation: 3,
  //               backgroundColor: "#0000",

  //             }}>
  //             <Image source={item.images} style={{ width: '100%', height: '100%', borderTopLeftRadius: 14, borderBottomLeftRadius: 14 }} resizeMode='cover' />
  //           </View>
  //           <View style={{
  //             flex: 1,
  //             height: '100%',
  //             justifyContent: 'space-around',
  //           }}>
  //             <View style={{
  //             }}>
  //               <Text style={{
  //                 fontSize: 18,
  //                 maxWidth: '100%',
  //                 color: COLORS.main,
  //                 fontFamily: "Avenir-Medium"
  //               }} numberOfLines={2}
  //               >
  //                 {item.title}
  //               </Text>
  //               <View style={{
  //                 marginTop: 4,
  //                 flexDirection: 'row',
  //                 alignItems: 'center',
  //               }}>
  //                 <Text style={{
  //                   fontSize: 18,
  //                   fontFamily: 'AvenirNext-DemiBold',
  //                   maxWidth: '85%',
  //                   marginTop: 4,
  //                   fontWeight: 600,
  //                   marginRight: 4,
  //                 }} numberOfLines={1}>${item.pricing}</Text>
  //               </View>
  //             </View>
  //             <View>
  //               <Text style={{ fontSize: 13, color: COLORS.gray2 }}>Created by {item.username}</Text>
  //               <Text style={{ fontSize: 13, color: COLORS.gray2 }}>
  //                 on {item.timestamp?.toDate().toLocaleString('en-US', { timeZone: 'UTC', hour12: false })}
  //               </Text>
  //             </View>
  //           </View>
  //         </TouchableOpacity>
  //       </Swipeable>
  //     </View>
  //   );
  // };