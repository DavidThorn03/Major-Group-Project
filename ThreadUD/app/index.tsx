import { Text, View, StyleSheet } from "react-native";
import { Linking } from 'react-native';
import { Link } from 'expo-router';
export default function Index() {
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
      <Link href="/login">Login Page</Link>
    </View>
  );
}
