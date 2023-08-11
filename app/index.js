import { TouchableOpacity, Image, StyleSheet, Text, View } from "react-native";
import React, { useState, useEffect, useCallback } from "react";

import { db, auth } from "../firebase";

import { imae, COLORS, SIZES, icons } from "../constants";
import { TextButton, FormInput } from "../components";
import { Stack, useRouter } from "expo-router";
import { MotiView, useAnimationState } from "moti";

import { Shadow } from "react-native-shadow-2";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { Ionicons } from "@expo/vector-icons";

import { serverTimestamp } from "firebase/firestore";
import Entypo from "@expo/vector-icons/Entypo";
import * as SplashScreen from "expo-splash-screen";

const index = () => {
  const router = useRouter();

  const [mode, setMode] = useState("login");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [signupemail, setsignupEmail] = useState("");
  const [signuppassword, setsignupPassword] = useState("");

  const [temppassword, settemppassword] = useState("");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const [disPasswordVisible, dsetIsPasswordVisible] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setIsLoggedIn(true);
        router.replace("/home");
      } else {
        setIsLoggedIn(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const handleLogin = () => {
    auth
      .signInWithEmailAndPassword(email, password)
      .then((userCredentials) => {
        const user = userCredentials.user;
        console.log(user.email);
      })
      .catch((error) => {
        const errorCode = error.code;
        let errorMessage = error.message;

        if (
          errorCode === "auth/user-not-found" ||
          errorCode === "auth/wrong-password"
        ) {
          errorMessage =
            "Invalid email or password. Please check your credentials and try again.";
        }

        alert(errorMessage);
      });
  };

  const handleSignup = () => {
    if (temppassword !== signuppassword) {
      alert("Passwords do not match. Please make sure your passwords match.");
      return;
    }
    auth
      .createUserWithEmailAndPassword(signupemail, signuppassword)
      .then((userCredentials) => {
        const user = userCredentials.user;

        db.collection("users")
          .doc(user.uid)
          .set({
            username: username,
            joinedDate: serverTimestamp(),
          })
          .then(() => {
            console.log("User document created in Firestore.");
          })
          .catch((error) => {
            console.error("Error creating user document:", error);
          });

        console.log(user);
      })
      .catch((error) => alert(error.message));
  };

  const dtogglePasswordVisibility = () => {
    dsetIsPasswordVisible((prev) => !prev);
  };

  const togglePasswordVisibility = () => {
    setIsPasswordVisible((prev) => !prev);
  };

  const animationState = useAnimationState({
    login: {
      height: SIZES.height * 0.3,
    },
    signUp: {
      height: SIZES.height * 0.45,
    },
  });

  React.useEffect(() => {
    animationState.transitionTo("login");
  }, []);

  function SignIn() {
    return (
      <MotiView
        state={animationState}
        style={{
          marginTop: 15,
          height: SIZES.height * 0.3,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Shadow distance={4}>
          <View style={styles.authContainer}>
            <KeyboardAwareScrollView
              enableOnAndroid={true}
              keyboardDismissMode="on-drag"
              keyboardShouldPersistTaps={"handled"}
              extraScrollHeight={-300}
              contentContainerStyle={{
                flexGrow: 1,
                justifyContent: "center",
              }}
            >
              <FormInput
                containerStyle={{
                  borderRadius: SIZES.radius,
                  backgroundColor: COLORS.lightWhite,
                  height: 55,
                  justifyContent: "center",
                }}
                placeholder="Email Address"
                value={email}
                onChange={(text) => setEmail(text)}
                preprendComponent={
                  <Ionicons
                    name="ios-mail"
                    size={24}
                    color={COLORS.gray2}
                    style={{ marginRight: SIZES.base }}
                  />
                }
              />
              <FormInput
                containerStyle={{
                  marginTop: SIZES.radius,
                  borderRadius: SIZES.radius,
                  backgroundColor: COLORS.lightWhite,
                  height: 55,
                  justifyContent: "center",
                }}
                placeholder="Password"
                value={password}
                secureTextEntry={!isPasswordVisible}
                onChange={(text) => setPassword(text)}
                preprendComponent={
                  <Ionicons
                    name="ios-lock-closed"
                    size={24}
                    color={COLORS.gray2}
                    style={{ marginRight: SIZES.base }}
                  />
                }
                appendComponent={
                  <TouchableOpacity onPress={togglePasswordVisibility}>
                    <Text
                      style={{ color: COLORS.theme1, marginRight: SIZES.base }}
                    >
                      {isPasswordVisible ? "Hide" : "Show"}
                    </Text>
                  </TouchableOpacity>
                }
              />
            </KeyboardAwareScrollView>
            <TextButton
              label="Log in"
              contentContainerStyle={{
                height: 55,
                borderRadius: SIZES.radius,
                backgroundColor: COLORS.theme1,
              }}
              labelStyle={{
                fontSize: SIZES.h3,
                lineHeight: 22,
              }}
              onPress={handleLogin}
            />
          </View>
        </Shadow>
      </MotiView>
    );
  }

  function SignUp() {
    return (
      <MotiView
        state={animationState}
        style={{
          marginTop: 15,
          height: SIZES.height * 0.45,
        }}
      >
        <Shadow distance={4}>
          <View style={styles.authContainer}>
            <KeyboardAwareScrollView
              enableOnAndroid={true}
              keyboardDismissMode="on-drag"
              keyboardShouldPersistTaps={"handled"}
              extraScrollHeight={-300}
              contentContainerStyle={{
                flexGrow: 1,
                justifyContent: "center",
              }}
            >
              <FormInput
                containerStyle={{
                  borderRadius: SIZES.radius,
                  backgroundColor: COLORS.lightWhite,
                  height: 55,
                  justifyContent: "center",
                }}
                placeholder="Username"
                value={username}
                onChange={(text) => setUsername(text)}
                preprendComponent={
                  <Ionicons
                    name="ios-person"
                    size={24}
                    color={COLORS.gray2}
                    style={{ marginRight: SIZES.base }}
                  />
                }
              />
              <FormInput
                containerStyle={{
                  marginTop: SIZES.radius,
                  borderRadius: SIZES.radius,
                  backgroundColor: COLORS.lightWhite,
                  height: 55,
                  justifyContent: "center",
                }}
                placeholder="Email Address"
                value={signupemail}
                onChange={(text) => setsignupEmail(text)}
                preprendComponent={
                  <Ionicons
                    name="ios-mail"
                    size={24}
                    color={COLORS.gray2}
                    style={{ marginRight: SIZES.base }}
                  />
                }
              />
              <FormInput
                containerStyle={{
                  marginTop: SIZES.radius,
                  borderRadius: SIZES.radius,
                  backgroundColor: COLORS.lightWhite,
                  height: 55,
                  justifyContent: "center",
                }}
                placeholder="Password"
                value={temppassword}
                secureTextEntry={!disPasswordVisible}
                onChange={(text) => settemppassword(text)}
                preprendComponent={
                  <Ionicons
                    name="ios-lock-closed"
                    size={24}
                    color={COLORS.gray2}
                    style={{ marginRight: SIZES.base }}
                  />
                }
              />
              <FormInput
                containerStyle={{
                  marginTop: SIZES.radius,
                  borderRadius: SIZES.radius,
                  backgroundColor: COLORS.lightWhite,
                  height: 55,
                  justifyContent: "center",
                }}
                placeholder="Confirm Password"
                value={signuppassword}
                secureTextEntry={true}
                onChange={(text) => setsignupPassword(text)}
                preprendComponent={
                  <Ionicons
                    name="ios-lock-closed"
                    size={24}
                    color={COLORS.gray2}
                    style={{ marginRight: SIZES.base }}
                  />
                }
              />
            </KeyboardAwareScrollView>
            <TextButton
              label="Create Account"
              contentContainerStyle={{
                height: 55,
                borderRadius: SIZES.radius,
                backgroundColor: COLORS.theme1,
              }}
              labelStyle={{
                fontSize: SIZES.h3,
                lineHeight: 22,
              }}
              onPress={handleSignup}
            />
          </View>
        </Shadow>
      </MotiView>
    );
  }

  function renderAuthContainer() {
    if (mode == "login") {
      return SignIn();
    } else {
      return SignUp();
    }
  }

  const [appIsReady, setAppIsReady] = useState(false);

  useEffect(() => {
    async function prepare() {
      try {
    
        await new Promise((resolve) => setTimeout(resolve, 2000));
      } catch (e) {
        console.warn(e);
      } finally {
        // Tell the application to render
        setAppIsReady(true);
      }
    }

    prepare();
  }, []);
  const onLayoutRootView = useCallback(async () => {
    if (appIsReady) {
      await SplashScreen.hideAsync();
    }
  }, [appIsReady]);

  if (!appIsReady) {
    return null;
  }

  return (
    <View style={styles.container}>
   

      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Image source={imae.logo} style={styles.images} />
        {renderAuthContainer()}

        <View
          style={{
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "flex-end",
            marginTop: 10,
            zIndex: 0,
          }}
        >
          <Text style={{ fontSize: 11, color: "rgba(160, 161, 180, 0.6)" }}>
            {mode === "login"
              ? "Don't have an account? "
              : "Already have an account? "}
          </Text>

          <TouchableOpacity
            onPress={() => {
              if (mode === "login") {
                animationState.transitionTo("signUp");
                setMode("signUp");
              } else {
                animationState.transitionTo("login");
                setMode("login");
              }
            }}
          >
            <Text
              style={{ color: COLORS.theme1, fontWeight: "bold", fontSize: 11 }}
            >
              {mode === "login" ? "Create new account" : "Sign in here"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default index;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: "#fff",
  },
  images: {
    justifyContent: "center",
    alignSelf: "center",

    width: 350,
    height: 70,
  },
  authContainer: {
    flex: 1,
    width: SIZES.width - SIZES.padding * 2,
    padding: SIZES.padding,
    borderRadius: SIZES.radius,
    marginBottom: 10,
    backgroundColor: "#fff",
  },
});
