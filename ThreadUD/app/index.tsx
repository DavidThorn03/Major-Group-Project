import React, { useEffect, useState } from "react";
import { View, Text, Button, FlatList, TextInput, Linking } from "react-native";
import { useNavigation } from '@react-navigation/native';

const HomeScreen = () => {
    const navigation = useNavigation();
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text>We start here!!!</Text>
      <Text>VS Code extentions for react:</Text>
      <Text>- React Native Tools</Text>
      <Text>- ESLint</Text>
      <Text>For more development stuff: </Text>
      <Text style={{color: 'blue'}}
            onPress={() => Linking.openURL('https://docs.expo.dev/get-started/start-developing/')}>
        React Native Getting started
      </Text>
      <Text style={{color: 'blue'}}
            onPress={() => Linking.openURL('https://callstack.github.io/react-native-paper/')}>
        React Native Paper - For UI components
      </Text>
      <Text style={{color: 'blue'}}
            onPress={() => Linking.openURL('https://reactnative.dev/docs/turbo-native-modules-ios#implement-localstorage-with-nsuserdefaults')}>
        Save to local storage
      </Text>
      <Text>Next, go to the</Text>
      <Button title="Log in" onPress={() => navigation.navigate("login")} />
    </View>
  );
}
export default HomeScreen;
