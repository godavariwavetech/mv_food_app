import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, TextInput } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { responsiveHeight, responsiveWidth } from 'react-native-responsive-dimensions';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

export default function LocationSelectionScreen() {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Select Service Location</Text>
      
      {/* Search Input Container */}
      <TouchableOpacity 
        style={styles.searchContainer}
        onPress={() => navigation.navigate('SelectServiceFromLocation')}
      >
        <TextInput
          style={styles.searchInput}
          placeholder="Search for area or location"
          placeholderTextColor="#666"
          editable={false} // Makes the input non-editable, acts as button
        />
        <MaterialIcons name="search" size={24} color="#666" />
      </TouchableOpacity>

      <Text style={styles.orText}>OR</Text>

      {/* Map Selection Card */}
      <TouchableOpacity 
        style={styles.mapCard}
        onPress={() => navigation.navigate('MapScreen')}
      >
        <Image
          source={{uri: 'https://raw.githubusercontent.com/Adarsh-arya/local_daddy_images/main/map_location.png'}}
          style={styles.image}
        />
        <Text style={styles.cardTitle}>Choose from Map</Text>
        <Text style={styles.cardText}>Select your location directly on the map</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#FFF',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#333',
    marginBottom: 30,
    textAlign: 'center',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 15,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#065E2C',
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#333',
    marginLeft: 10,
  },
  orText: {
    textAlign: 'center',
    color: '#666',
    fontSize: 16,
    marginVertical: 20,
  },
  mapCard: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#065E2C',
  },
  image: {
    width: '100%',
    height: responsiveHeight(25),
    borderRadius: 8,
    marginBottom: 15,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#065E2C',
    marginBottom: 5,
  },
  cardText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
}); 