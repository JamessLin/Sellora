import { useState, useEffect, useRef, useCallback, useMemo } from 'react'
import { View, Text, TextInput, Image, TouchableOpacity } from 'react-native'
import { useRouter } from 'expo-router'
import GoodICons from '@expo/vector-icons/Ionicons'
import styles from './welcome.style'
import { icons, SIZES, imae, COLORS } from '../../../constants'
import { db, auth } from '../../../firebase'
import React from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage';

const Welcome = () => {
  const router = useRouter();

  const [username, setUsername] = useState('');



  useEffect(() => {
    const fetchUsername = async () => {
      try {
        const user = auth.currentUser;
        if (user) {
          const userSnapshot = await db.collection('users').doc(user.uid).get();
          if (userSnapshot.exists) {
            const userData = userSnapshot.data();
            setUsername(userData.username);
          }
        }
      } catch (error) {
        console.error('Error fetching username:', error);
      }
    };

    fetchUsername();
  }, []);



  return (
    <View>

      <View style={styles.container}>

        <View style={{
          flex: 1, alignItems: "center",
          justifyContent: "center",
        }}>
          <View style={styles.profile}>
            <Text style={styles.welcome} numberOfLines={1}>Håfa a'dai,</Text>
            <Text style={{ fontSize: 25, fontFamily: 'Avenir-Book', fontWeight: 900, marginBottom:1, }} numberOfLines={1}> @{username} 👋 </Text>
          </View>
          <Text style={styles.welcome2} >Connecting our island, one sale at a time!</Text>

        </View>


      </View>
      <TouchableOpacity onPress={()=>router.push('/searchsc/SearchScreen')}>
        <View style={styles.searchContainer}>
          <View style={styles.searchWrapper}>
            <GoodICons name="ios-search-outline" size={24} color= {COLORS.gray2}/>
            <Text style={{ color: COLORS.gray2 , paddingHorizontal:12, fontSize:15,}}>What are you looking for?</Text>

          </View>

        </View>


      </TouchableOpacity>
    </View>
  )
}

export default Welcome