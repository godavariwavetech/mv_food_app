import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {getServicesList, setSelectedServiceLocation} from '../../redux/reducers/daddy';
import {Shadow} from 'react-native-shadow-2';
import {responsiveWidth} from 'react-native-responsive-dimensions';
import Icon from 'react-native-vector-icons/MaterialIcons';

export default function ServiceLocationsScreen({navigation,route}) {
//   const {serviceLocations} = useSelector(state => state.Dashboard);
const [serviceLocations,setServiceLocations]=useState([])
  const dispatch = useDispatch();
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredLocations, setFilteredLocations] = useState(serviceLocations || []);

  const handleLocationSelect = location => {
    dispatch(setSelectedServiceLocation(location));
    // navigation.replace('UserHome');
  };

  console.log(serviceLocations,"serviceLocations")

//   console.log(route.params,"route.params")

const getLocations = async()=>{
    try {
      const response = await dispatch(getServicesList({latitude: route.params?.latitude, longitude: route.params?.longitude}));
      console.log(response.payload.data,"response")
      if(response?.payload?.data){
        setServiceLocations(response.payload.data);
        setFilteredLocations(response.payload.data);
      }
    } catch (error) {
      console.error('Error fetching locations:', error);
    }
}

  useEffect(() => {
    if(!route.params){
      return;
    }
    getLocations();
  }, [route.params]);

  const handleSearch = text => {
    setSearchQuery(text);
    if (serviceLocations && serviceLocations.length > 0) {
      const filtered = serviceLocations.filter(location =>
        location.location_name.toLowerCase().includes(text.toLowerCase()),
      );
      setFilteredLocations(filtered);
    }
  };

  const renderLocationItem = ({item}) => (
    <Shadow
      distance={15}
      offset={[0, 5]}
      startColor="rgba(0, 0, 0, 0.1)"
      style={styles.locationCard}>
      <TouchableOpacity
        style={styles.locationButton}
        onPress={() => handleLocationSelect(item)}>
        <Image
          source={{uri: item.location_image}}
          style={styles.locationImage}
        />
        <View style={styles.locationInfo}>
          <Text style={styles.locationName}>{item.location_name}</Text>
          <Text style={styles.deliveryRange}>
            Delivery Range: {item.maximum_delivery_service_km} km
          </Text>
        </View>
        <Icon name="chevron-right" size={24} color="#065E2C" />
      </TouchableOpacity>
    </Shadow>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Service Available Locations</Text>
        <Text style={styles.subtitle}>
          Select a location where our service is available
        </Text>
      </View>

      <View style={styles.searchContainer}>
        <Icon name="search" size={24} color="#666" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search locations..."
          value={searchQuery}
          onChangeText={handleSearch}
          placeholderTextColor="#666"
        />
      </View>

      {serviceLocations.length === 0 ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#065E2C" />
          <Text style={styles.loadingText}>Loading locations...</Text>
        </View>
      ) : filteredLocations.length === 0 ? (
        <View style={styles.noResultsContainer}>
          <Text style={styles.noResultsText}>No locations found</Text>
        </View>
      ) : (
        <FlatList
          data={filteredLocations}
          keyExtractor={item => item.id.toString()}
          renderItem={renderLocationItem}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    padding: 20,
    backgroundColor: '#065E2C',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#fff',
    opacity: 0.8,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    margin: 16,
    paddingHorizontal: 16,
    borderRadius: 12,
    height: 50,
  },
  searchIcon: {
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  listContainer: {
    padding: 16,
  },
  locationCard: {
    marginBottom: 16,
    borderRadius: 12,
    backgroundColor: '#fff',
    overflow: 'hidden',
  },
  locationButton: {
    flexDirection: 'row',
    padding: 16,
    alignItems: 'center',
  },
  locationImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 16,
  },
  locationInfo: {
    flex: 1,
  },
  locationName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  deliveryRange: {
    fontSize: 14,
    color: '#666',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#065E2C',
    fontWeight: '500',
  },
  noResultsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noResultsText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
}); 