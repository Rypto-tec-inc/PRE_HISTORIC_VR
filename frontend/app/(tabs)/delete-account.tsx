import React from 'react';
import { Alert, Button, StyleSheet, Text, View } from 'react-native';

export default function DeleteAccountScreen() {
  const handleDelete = () => {
    Alert.alert('Delete Account', 'This feature will allow you to permanently delete your account. (Coming soon)');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Delete Account</Text>
      <Text style={styles.text}>
        Deleting your account is permanent and cannot be undone. All your data will be removed from our servers.
      </Text>
      <Button title="Delete My Account" color="#ef4444" onPress={handleDelete} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#191919',
    padding: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 16,
  },
  text: {
    fontSize: 16,
    color: '#ccc',
    lineHeight: 24,
    textAlign: 'center',
    marginBottom: 24,
  },
}); 