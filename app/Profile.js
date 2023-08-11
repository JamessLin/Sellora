import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  TextInput,
  Alert,
} from "react-native";
import { auth, db } from "../firebase";
import { useRouter, Stack } from "expo-router";
import { imae, COLORS, SIZES } from "../constants";
import * as ImagePicker from "expo-image-picker";
import { TextButton, BetterInput } from "../components";
import { Ionicons } from "@expo/vector-icons";

import { Entypo } from "@expo/vector-icons";

const ProfilePage = () => {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const inputRef = useRef(null);
  const [newusername, setnewUsername] = useState("");
  useEffect(() => {
    const fetchUsername = async () => {
      try {
        const user = auth.currentUser;
        if (user) {
          const userSnapshot = await db.collection("users").doc(user.uid).get();
          if (userSnapshot.exists) {
            const userData = userSnapshot.data();
            setUsername(userData.username);
          }
        }
      } catch (error) {
        console.error("Error fetching username:", error);
      }
    };

    fetchUsername();
  }, []);

  useEffect(() => {
    async () => {
      if (Platform.OS !== "web") {
        const { status } =
          await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== "granted") {
          alert("no permission granted");
        }
      }
    };
  }, []);

  const pickImage = async () => {
    let permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (permissionResult.granted === false) {
      alert("Permission denied for accessing media library");
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
  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          headerStyle: {
            backgroundColor: COLORS.lightWhite,
          },
          headerTitle: "Edit Profile",
          headerTitleStyle: {
            fontSize: 18,
            fontFamily: "Avenir-Book",
          },
        }}
      />
      <View
        style={{
          alignItems: "center",
          marginTop: 30,
        }}
      >
        <TouchableOpacity onPress={pickImage}>
          <Image
            source={imae.profile}
            style={{
              width: 150,
              height: 150,
              borderRadius: 150,
              marginBottom: 10,
              borderWidth: 3,
              borderColor: "#fff",
            }}
            resizeMode="cover"
          />
        </TouchableOpacity>
        <Text
          style={{
            fontSize: 24,
            fontWeight: "bold",
            color: "#333",
          }}
        >
          @{username}
        </Text>
      </View>
      <View
        style={{
          justifyContent: "center",
          alignItems: "center",
          marginBottom: 10,
        }}
      >
        <Text
          style={{ fontSize: 16, fontFamily: "Avenir-Medium", fontWeight: 400 }}
        >
          {auth.currentUser && auth.currentUser.email}
        </Text>
      </View>
      <View style={{ paddingHorizontal: 30, marginTop: 40 }}>
        <View>
          <Text
            style={{
              color: COLORS.gray2,
              fontSize: 16,
              fontFamily: "Avenir-Medium",
              fontWeight: 400,
            }}
          >
            Email Address
          </Text>
          <BetterInput
            containerStyle={{
              borderBottomWidth: 1,
              borderColor: COLORS.gray2,
              height: 40,
              justifyContent: "center",
              marginBottom: 40,
            }}
            placeholder={auth.currentUser && auth.currentUser.email}
            value={email}
            onChange={(text) => setEmail(text)}
          />
        </View>

        <View>
          <Text
            style={{
              color: COLORS.gray2,
              fontSize: 16,
              fontFamily: "Avenir-Medium",
              fontWeight: 400,
            }}
          >
            Username
          </Text>
          <BetterInput
            containerStyle={{
              borderBottomWidth: 1,
              borderColor: COLORS.gray2,
              height: 40,
              justifyContent: "center",
              marginBottom: 40,
            }}
            placeholder={username}
            value={newusername}
            onChange={(text) => setnewUsername(text)}
            preprendComponent={
              <Entypo
                name="email"
                size={18}
                color="black"
                style={{ marginRight: 5, color: COLORS.gray2 }}
              />
            }
          />
        </View>

        <View>
          <Text
            style={{
              color: COLORS.gray2,
              fontSize: 16,
              fontFamily: "Avenir-Medium",
              fontWeight: 400,
            }}
          >
            Password
          </Text>
          <BetterInput
            containerStyle={{
              borderBottomWidth: 1,
              borderColor: COLORS.gray2,
              height: 40,
              justifyContent: "center",
              marginBottom: 20,
            }}
            placeholder={"New Password"}
            value={password}
            onChange={(text) => setPassword(text)}
          />
        </View>
      </View>
      <View
        style={{
          marginTop: 50,
          flexDirection: "row",
          paddingHorizontal: 30,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <TouchableOpacity
          style={{
            paddingVertical: 17,
            paddingHorizontal: 19,
            width: 130,
            backgroundColor: "transparent",
            borderWidth: 1,
            borderTopLeftRadius: 30,
            borderBottomLeftRadius: 30,
            borderColor: COLORS.border,
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "row",
          }}
          onPress={() => {
            router.back();
          }}
        >
          <Text
            style={{
              fontSize: 17,
              fontFamily: "Avenir-Medium",
              fontWeight: 400,
            }}
          >
            Cancel
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={{
            paddingVertical: 17,
            paddingHorizontal: 19,
            width: 130,
            borderTopRightRadius: 30,
            borderBottomRightRadius: 30,
            backgroundColor: COLORS.theme1,
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "row",
          }}
          onPress={() => {
            Alert.alert("Update Profile", "Are you sure you want to save?", [
              {
                text: "No",
                onPress: () => {
                  console.log("user said no");
                },
              },
              {
                text: "Yes",
                onPress: () => {
                  Alert.alert("Changed Password");
                  setPassword('')
                  
                },
              },
            ]);
          }}
        >
          <Text
            style={{
              fontSize: 17,
              fontFamily: "Avenir-Medium",
              fontWeight: 400,
              color: COLORS.white,
            }}
          >
            Save
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.lightWhite,
  },
});

export default ProfilePage;
