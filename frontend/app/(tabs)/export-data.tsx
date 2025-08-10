import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export default function ExportDataScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Export My Data</Text>
      <Text style={styles.text}>
        Here you can request a copy of your data. (Feature coming soon)
      </Text>
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
  },
}); 