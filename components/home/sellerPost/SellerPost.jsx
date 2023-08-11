import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, FlatList, Alert, Image, Animated, RefreshControl } from 'react-native';
import { db, auth } from '../../../firebase';
import styles from './post.style';
import { COLORS } from '../../../constants';
import { ScrollView, Swipeable } from 'react-native-gesture-handler';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { ActivityIndicator } from 'react-native-paper';
import CardMain from '../../common/createCard/cardshow';

const SellerPost = ({theID}) => {
  const router = useRouter();
   const openedRow = useRef();
  const [loading, setLoading] = useState(true);
  const [posts, setPosts] = useState([]);
 

  const fetchPosts = async () => {
    try {  
        const postsRef = db
          .collection("posts")
          .where("userId", "==", theID)
          .orderBy("timestamp", "desc");

        const snapshot = await postsRef.get();
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


  useEffect(() => {
    fetchPosts();
  }, []);



  const refreshPosts = () => {
    setLoading(true);
    fetchPosts();
  };






  return (

    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>User Items ({posts.length})</Text>

      </View>

      <View style={styles.cardsContainer}>
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
                  This user have not created any post yet.

                </Text>
                <Text style={{ fontWeight: 600, fontSize: 16, color: COLORS.border }}> Refresh and see if they created new post.</Text>
              </ScrollView>
            ) : (
              
                <FlatList
                  data={posts}
                  keyExtractor={(item) => item.id.toString()}
                  refreshing={loading}
                  onRefresh={refreshPosts}
                  renderItem={({ item }) => <CardMain item={item}/>}

                />

            
            )}
          </>
        )}
      </View>
    </View>
  );
};

export default SellerPost;




// const fetchPosts = async () => {
//   try {
//     const postsRef = db.collection('posts');
//     const snapshot = await postsRef.get();
//     const fetchedPosts = [];
//     for (const doc of snapshot.docs) {
//       const post = doc.data();
//       const userSnapshot = await db.collection('users').doc(post.userId).get();
//       if (userSnapshot.exists) {
//         const username = userSnapshot.data().username;
//         console.log('Username: ', username); // Debugging statement
//         fetchedPosts.push({
//           id: doc.id,
//           username: username,
//           ...post,
//         });
//       } else {
//         console.log('User not found for post with ID: ', doc.id); // Debugging statement
//       }
//     }
//     setPosts(fetchedPosts);
//     setLoading(false);
//   } catch (error) {
//     console.log('Error fetching posts: ', error);
//   }
// };

