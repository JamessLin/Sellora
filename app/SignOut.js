// SignOut.js

import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { auth } from "../firebase"
import { useRouter } from "expo-router";



const SignOut = () => {
  const router = useRouter()
  const [isLoggedIn, setIsLoggedIn] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setIsLoggedIn(true);


      } else {
        setIsLoggedIn(false);
        router.replace('/')
      }
    });


    return () => unsubscribe();
  }, []);



  const handleSignOut = () => {
    auth
      .signOut()
      .then(() => {

        console.log('User signed out successfully.');
      })
      .catch((error) => {

        console.error('Error while signing out:', error);
      });
  };

  return (
    <View style={styles.container}>
      <Text>Welcome, User! You are logged in.</Text>
      <TouchableOpacity onPress={handleSignOut} style={styles.signOutButton}>
        <Text style={styles.signOutButtonText}>Sign Out</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  signOutButton: {
    marginTop: 20,
    padding: 10,
    backgroundColor: '#f00', 
    borderRadius: 5,
  },
  signOutButtonText: {
    color: '#fff', 
    fontWeight: 'bold',
  },
});

export default SignOut;
