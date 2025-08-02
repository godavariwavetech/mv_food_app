import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput } from 'react-native';

const MoreDetailsScreen = () => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>More Details</Text>
      </View>
      <TextInput placeholder="Name" style={styles.input} />
      <TextInput placeholder="Contact number" style={styles.input} />
      <TextInput placeholder="Door no/Flat no/Building" style={styles.input} />
      <TextInput placeholder="Pincode" style={styles.input} />
      <TextInput placeholder="Nearby Landmark" style={styles.input} />
      <TouchableOpacity style={styles.saveButton}>
        <Text style={styles.saveButtonText}>Save Address</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 20 },
  header: { alignItems: 'center', marginBottom: 20 },
  title: { fontSize: 24, fontWeight: 'bold', color: '#065E2C' },
  input: { backgroundColor: '#f0f0f0', borderRadius: 8, padding: 10, marginBottom: 15 },
  saveButton: { backgroundColor: '#065E2C', padding: 15, borderRadius: 5, alignItems: 'center' },
  saveButtonText: { color: '#fff', fontWeight: 'bold' },
});

export default MoreDetailsScreen; 