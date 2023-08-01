import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { auth } from '../../firebase';
import { useRouter } from 'expo-router';
import { imae } from '../../constants';

const ProfilePage = () => {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setIsLoggedIn(true);
        setUser(user);
      } else {
        setIsLoggedIn(false);
        router.replace('/index');
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
      {isLoggedIn && (
        <>
          <View style={styles.profileHeader}>
            <Image
              source={imae.profile}
              style={styles.profileImage}
              resizeMode="cover"
            />
            <Text style={styles.profileName}>ExampleUser</Text>
          </View>
          <View style={styles.profileOptionsContainer}>
            <TouchableOpacity style={styles.profileOption}>
              <Text style={styles.profileOptionText}>Profile Settings</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.profileOption}>
              <Text style={styles.profileOptionText}>Change Email</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.profileOption}>
              <Text style={styles.profileOptionText}>Change Password</Text>
            </TouchableOpacity>
            {/* Add more profile options here */}
            <TouchableOpacity onPress={handleSignOut} style={styles.signOutButton}>
              <Text style={styles.signOutButtonText}>Sign Out</Text>
            </TouchableOpacity>
          </View>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f9f9f9',
  },
  profileHeader: {
    alignItems: 'center',
    marginTop: 30,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
    borderWidth: 3,
    borderColor: '#fff',
  },
  profileName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  profileOptionsContainer: {
    marginTop: 30,
    width: '80%',
    backgroundColor: '#fff',
    borderRadius: 10,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },
  profileOption: {
    paddingVertical: 20,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    justifyContent: 'center',
  },
  profileOptionText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#555',
  },
  signOutButton: {
    marginTop: 30,
    marginBottom: 20,
    marginHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#f00',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  signOutButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default ProfilePage;
