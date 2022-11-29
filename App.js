import React, { useState, useEffect } from "react";
import { NavigationContainer } from '@react-navigation/native';
import { View, SafeAreaView, Platform, Linking, Button, Text } from "react-native";
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SafariView from "react-native-safari-view";
import { WebView } from "react-native-webview";
import linking from "./linking.js";
import { GoogleSignin, GoogleSigninButton, statusCodes } from '@react-native-google-signin/google-signin';

const Stack = createNativeStackNavigator();

const MyStack = () => {
  return (
    <NavigationContainer linking={linking}>
      <Stack.Navigator initialRouteName={"login"}>
        <Stack.Group screenOptions={{ headerShown: false }}>
            <Stack.Screen name="login" component={Login} />
            <Stack.Screen name="home" component={Home} />
        </Stack.Group>
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const Login = (props) => {
  //... some other code here
  const [uri, setURL] = useState("");

  // // Set up Linking
  // useEffect(() => {
  //   Linking.addEventListener("url", (url) => {
  //     console.log(url);
  //     handleOpenURL(url.url);
  //   });
  //   Linking.getInitialURL().then((url) => {
  //     if (url) {
  //       handleOpenURL({ url });
  //     }
  //   });
  //   return () => {
  //     Linking.removeAllListeners("url");
  //   };
  // }, []);

  useEffect(() => {
    console.log('configured');
    GoogleSignin.configure({
      // scopes: ['profile','email'], // what API you want to access on behalf of the user, default is email and profile
      webClientId: '1009828463388-gadnuo344ords3nqge8rnfjs6bhkeokq.apps.googleusercontent.com', // client ID of type WEB for your server (needed to verify user ID and offline access)
      offlineAccess: true, // if you want to access Google API on behalf of the user FROM YOUR SERVER
      // forceCodeForRefreshToken: true, // [Android] related to `serverAuthCode`, read the docs link below *.
      // androidClientId: '1009828463388-u5kus4550fpav2g7as0mbf2064f50urr.apps.googleusercontent.com',
    });
  },[]);

  const handleOpenURL = (url) => {
    // Extract stringified user string out of the URL
    const user = decodeURI(url).match(
      /googleId=([^#]+)\/username=([^#]+)\/email=([^#]+)/
    );
    // 2 - store data in Redux
    const userData = {
      isAuthenticated: true,
      firstName: user[1],
      lastName: user[2],
      //some users on fb may not registered with email but rather with phone
      email: user && user[3] ? user[3] : "NA",
    };
    //redux function
    login(userData);
    if (Platform.OS === "ios") {
      SafariView.dismiss();
    } else {
      setURL("");
    }
  };

  const signInWithGoogle = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      console.log('userInfo', userInfo);
      fetch('http://192.168.178.40:4000/auth/google', {
        credentials: 'include',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          serverAuthCode: userInfo.serverAuthCode,
        })
      }).then(res => {
        console.log(res.headers);
      })
    } catch (error) {
      console.log(error);
    }
  };

  const signInWithLocal = async() => {
    fetch('http://192.168.178.40:4000/auth/login', {
      credentials: 'include',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        username: 'daiado',
        password:'jengjeng',
      })
    }).then(res => {
      console.log(res.body);
    });
  };

  const hehe = () => {
    fetch('http://192.168.178.40:4000/auth/try', {
        credentials: 'include',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          message: 'hello world',
        })
      }).then(res => {
        console.log(res.headers);
      })
  };

  const logout = () => {
    fetch('http://192.168.178.40:4000/auth/logout', {
      credentials: 'include',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          message: 'hello world',
        })
    });
  }

  // const signInWithGoogle = async () => {
  //   fetch('http://192.168.178.40:4000/auth/eagle', {
  //     method: 'POST',
  //   });
  // };

  //method that opens a given url
  //based on the platform will use either SafariView or Linking
  //SafariView is a better practice in IOS
  const openUrl = (url) => {
    // // Use SafariView on iOS
    if (Platform.OS === "ios") {
      SafariView.show({
        url,
        fromBottom: true,
      });
    } else {
      setURL(url);
    }
  };

  //... more code here

  return (
    <>
      {uri !== "" ? (
        <SafeAreaView style={{ flex: 1 }}>
          <WebView
            userAgent={
              Platform.OS === "android"
                ? "Chrome/18.0.1025.133 Mobile Safari/535.19"
                : "AppleWebKit/602.1.50 (KHTML, like Gecko) CriOS/56.0.2924.75"
            }
            source={{ uri }}
          />
        </SafeAreaView>
      ) : (
        //... more code here
        <View>
          <Button
            title="Google login"
            width="45%"
            text="Google"
            type="google"
            icon="plus"
            onPress={() => signInWithGoogle()}
          />
          <Button
            title="Local login"
            width="45%"
            text="Google"
            type="google"
            icon="plus"
            onPress={() => signInWithLocal()}
          />
          <Button
            title="hehe"
            width="45%"
            text="Google"
            type="google"
            icon="plus"
            onPress={() => hehe()}
          />
          <Button
            title="logout"
            width="45%"
            text="Google"
            type="google"
            icon="plus"
            onPress={() => logout()}
          />
        </View>
        //... more code here
      )}
    </>
  );
};

const Home = ({}) => {
  return <Text>This is Dennis's profile</Text>;
};

export default MyStack;