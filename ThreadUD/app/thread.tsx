import { View, Text, StyleSheet } from 'react-native';

export default function ThreadScreen() {
  return (
    <View style={styles.container}>
      <Text>Thread</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
