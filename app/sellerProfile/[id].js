import React from "react";
import { useState, useEffect } from "react";
import { useRouter, Stack, useLocalSearchParams } from "expo-router";
import { COLORS, imae } from "../../constants";
import { View, Image, Text, TouchableOpacity, Alert } from "react-native";
import { SellerPost } from "../../components";
import { auth, db } from "../../firebase";
import GoodICons from "@expo/vector-icons/Ionicons";

const SellerProfile = () => {
  const router = useRouter();

  const { users, uid } = useLocalSearchParams();
  const userId = uid;

  const [timestamps, setTimestamps] = useState("");

  const fetchTimestamps = async () => {
    try {
      const doc = await db.collection("users").doc(userId).get();

      if (doc.exists) {
        const userData = doc.data();
        const joinDate = userData.joinedDate;

      
        const jsDate = joinDate.toDate();

        
        const formattedDate = jsDate.toLocaleDateString();

        setTimestamps(formattedDate);
      } else {
        console.log("User not found");
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };


  useEffect(() => {
    fetchTimestamps();
  }, []);

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.lightWhite }}>
      <Stack.Screen
        options={{
          headerStyle: {
            backgroundColor: COLORS.lightWhite,
          },
          title: users,
          headerTitleStyle: {
            fontSize: 18,
            fontFamily: "Avenir-Book",
          },
        }}
      />
      <View
        style={{
          justifyContent: "space-between",
          marginTop: 20,
          width: "100%",
          flexDirection: "row",
          alignItems: "flex-start",
          paddingHorizontal: 20,
          marginBottom: 20,
        }}
      >
        <View style={{ flexDirection: "row", gap: 10, alignItems: "center" }}>
          <Image
            source={imae.profile}
            style={{
              width: 70,
              height: 70,
              borderRadius: 70,

              borderColor: "#fff",
            }}
            resizeMode="cover"
          />
          <View>
            <Text
              style={{ fontSize: 22, fontWeight: "600", marginBottom: 5 }}
              numberOfLines={1}
            >
              @{users}
            </Text>
            <Text
              style={{
                fontSize: 16,
                fontFamily: "Avenir-Medium",
                fontWeight: 400,
                color: COLORS.gray,
              }}
            >
              joined at {timestamps}
            </Text>
          </View>
        </View>
        <TouchableOpacity
          onPress={() => {
            if (auth.currentUser.uid != userId) {
              router.push({
                pathname: `chat/${users}`,
                params: {
                  senderIds: auth.currentUser.uid,
                  receiverIds: userId,
                  users: users,
                  myID: auth.currentUser.uid,
                },
              });
            } else {
              Alert.alert("You cant message yourself");
            }
          }}
        >
          <View
            style={{
              borderWidth: 2,
              borderColor: COLORS.theme1,
              borderRadius: 18,
              padding: 8,
              height: 63,
              width: 63,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <GoodICons
              name="ios-chatbubbles-outline"
              size={30}
              color={COLORS.theme1}
            />
          </View>
        </TouchableOpacity>
      </View>
      <TouchableOpacity
        onPress={() => {
          router.push("/searchsc/SearchScreen");
        }}
      >
        <View
          style={{
            paddingHorizontal: 20,
            justifyContent: "center",
            alignItems: "center",

            height: 50,
            marginBottom: 10,
          }}
        >
          <View
            style={{
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
            }}
          >
            <GoodICons
              name="ios-search-outline"
              size={24}
              color={COLORS.gray2}
            />
            <Text
              style={{
                color: COLORS.gray2,
                paddingHorizontal: 12,
                fontSize: 15,
              }}
            >
              What are you looking for?
            </Text>
          </View>
        </View>
      </TouchableOpacity>
      <View>
        <SellerPost theID={userId} />
      </View>
    </View>
  );
};

export default SellerProfile;
