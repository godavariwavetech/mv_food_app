import React from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,SafeAreaView
} from 'react-native';
import commonStyles from '../../commonstyles/CommonStyles';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Icon from 'react-native-vector-icons/Feather';
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';
import Truck from '../daddy/svg/Truck';
import Clock from '../daddy/tabassets/Clock';
import { useNavigation } from '@react-navigation/native';
// import { SafeAreaView } from 'react-native-safe-area-context';

const categories = [
  { id: '1', title: 'Restaurant', image: require('../daddy/svg/biryani.png')},
  { id: '2', title: 'Groceries', image: require('../daddy/svg/vegetables.png') },
  { id: '3', title: 'Restaurant', image: require('../daddy/svg/biryani.png')},
  { id: '4', title: 'Groceries', image: require('../daddy/svg/vegetables.png') },
];

const popularFoods = [
  { id: '1', title: 'Spicy Noodles', rating: 4.8,image: require('../daddy/svg/biryani.png') ,text:'found in 10 restaurants'},
  { id: '2', title: 'Hyderabad Biryani', rating: 4.7, image: require('../daddy/svg/biryani.png'),text:'found in 10 restaurants' },
  { id: '3', title: 'Chicken Curry', rating: 4.6, image: require('../daddy/svg/biryani.png'),text:'found in 10 restaurants' },
  { id: '4', title: 'Paneer Butter Masala', rating: 4.5, image: require('../daddy/svg/biryani.png'),text:'found in 10 restaurants' },
  { id: '5', title: 'Veg Fried Rice', rating: 4.4, image: require('../daddy/svg/biryani.png'),text:'found in 10 restaurants' },
];

const restaurants = [
  {
    id: '1',
    title: 'Krishna Kalyani Restaurant',
    image: require('../daddy/svg/food.png'),
    cuisine: 'Chinese - Western - Chicken - Asian - Cafe',
    rating: 4.7,
    delivery: 'Free',
    time: '20 min',
  },
  {
    id: '2',
    title: 'Krishna Kalyani Restaurant',
    image: require('../daddy/svg/food.png'),
    cuisine: 'Chinese • Western • Chicken • Asian • Cafe',
    rating: 4.7,
    delivery: 'Free',
    time: '20 min',
  },
  {
    id: '3',
    title: 'Krishna Kalyani Restaurant',
    image: require('../daddy/svg/biryani.png'),
    cuisine: 'Chinese • Western • Chicken • Asian • Cafe',
    rating: 4.7,
    delivery: 'Free',
    time: '20 min',
  },
];

const famousPlaces = [];

export default function HomeScreen() {
  const navigation = useNavigation()
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: commonStyles.bgColor }}>
      {/* <StatusBar barStyle="dark-content" backgroundColor={'transparent'} translucent /> */}
    <ScrollView style={{flex:1}} contentContainerStyle={{ paddingBottom: 20 }} 
    showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity>
        <Ionicons name="menu-outline" size={22} color="#656565" />
        </TouchableOpacity>
        <TouchableOpacity style={{flexDirection:'row',alignItems:'center'}} onPress={() => {}}>
          <Ionicons name="location-outline" size={21} color="#656565" />
          <Text style={styles.location}> Mohammadpur, Dhaka</Text>
        </TouchableOpacity>
        <Image source={require('../daddy/svg/profile.png')} style={styles.avatar} />
      </View>

      <View style={{paddingHorizontal:16}}>
      <Text style={styles.greeting}>Good Morning,</Text>
      <Text style={styles.name}>Hemanth Kumar</Text>

      {/* Search */}
      {/* <TextInput
        placeholder="Search for Lunch"
        style={styles.searchInput}
      /> */}
      <View style={styles.searchContainer}>
        <Icon name="search" size={20} color="#656565" style={styles.searchIcon} />
        <TextInput
          placeholder="Search for Lunch"
          placeholderTextColor="#656565"
          style={styles.searchInput}
        />
      </View>

      </View>

      {/* Categories */}
      <View style={[commonStyles.row,commonStyles.mt32,{paddingHorizontal:16}]}>
        <Text style={[commonStyles.title]}>Categories</Text>
        <TouchableOpacity onPress={()=>navigation.navigate('CategoriesScreen')}>
          <Text style={styles.moreText}>More</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        horizontal
        data={categories} contentContainerStyle={{padding:16}}
        keyExtractor={item => item.id}
        renderItem={({ item,index }) => (
          <TouchableOpacity style={styles.card} onPress={()=>{}}>
            <Text style={[{paddingLeft:8,paddingTop:8},commonStyles.text3]}>{item.title}</Text>
            <View style={[{backgroundColor:`${index%2==0? '#E7FFD3':'#FFF5B7'}`},styles.categoryImgContainer]}>
              <Image source={item.image} style={styles.cardImage} />
            </View>
          </TouchableOpacity>
        )}
        showsHorizontalScrollIndicator={false}
      />

      {/* Popular Foods */}
      <View style={[commonStyles.row,commonStyles.mt24,{paddingHorizontal:16}]}>
        <Text style={[commonStyles.title]}>Popular Foods</Text>
        <TouchableOpacity onPress={()=>navigation.navigate('RestaurantsScreen')}>
          <Text style={styles.moreText}>More</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        horizontal
        data={popularFoods} contentContainerStyle={{padding:16}}
        keyExtractor={item => item.id}
        renderItem={({ item,index }) => (
          <TouchableOpacity style={styles.popularCard} onPress={()=>{}}>
            <View style={[{backgroundColor:`${index%2==0? '#FFF5B7':'#E7FFD3'}`},styles.popularImgContainer]}>
              <View style={{flex:1,justifyContent:'center',alignItems:'center'}}>
              <Image source={item.image} style={styles.foodImage} />
              </View>
              <Text style={[commonStyles.text3,{paddingLeft:16,paddingBottom:16,fontWeight:'700',color:'#656565'}]}>⭐ {item.rating}</Text>
            </View>
            <View style={styles.popularFoodsBottomContainer}>
            <Text style={commonStyles.label}>{item.title}</Text>
            <Text style={{fontSize:11,fontWeight:'400'}}>{item.text}</Text>
            </View>
          </TouchableOpacity>
        )}
        showsHorizontalScrollIndicator={false}
      />

      {/* Restaurants Near You */}
      <View style={[commonStyles.row,commonStyles.mt24,{paddingHorizontal:16}]}>
        <Text style={[commonStyles.title]}>Restaurants Near You</Text>
        <TouchableOpacity>
          <Text style={styles.moreText}>More</Text>
        </TouchableOpacity>
      </View>
      {/* <Text style={styles.sectionTitle}>Restaurants Near You</Text> */}
      <FlatList horizontal
        
          data={restaurants}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity style={styles.restaurantCard} onPress={() => {}}>
              <Image source={item.image} style={styles.restaurantImage} />
              <View style={{ padding: 16,gap:2}}>
                <Text style={commonStyles.label}>{item.title}</Text>
                <Text style={{fontSize:13,fontWeight:'400',color:'#656565'}}>{item.cuisine}</Text>
                <View style={[{flexDirection:'row',alignItems:'center',gap:12},commonStyles.mt12]}>
                  <Text style={commonStyles.text4}>⭐ {item.rating}</Text>
                  {/* <FontAwesome6 name='van-shuttle' size={12} color="#656565" /> */}
                  <View style={[{flexDirection:'row',alignItems:'center',gap:4}]}>
                    <Truck />
                    <Text style={commonStyles.text4}>{item.delivery}</Text>
                  </View>
                  <View style={{flexDirection:'row',alignItems:'center',gap:4}}>
                    <Text>⏱️</Text>
                    <Text style={commonStyles.text4}>{item.time}</Text>
                  </View>
                </View>
                {/* <View> */}
                  {/* <Clock /> */}
                {/* </View> */}
                {/* <Text>⭐ {item.rating} • {item.delivery} • ⏱️ {item.time}</Text> */}
              </View>
            </TouchableOpacity>
          )}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 16 }}
        />
      {/* {restaurants.map(item => (
        <View key={item.id} style={styles.restaurantCard}>
          <Image source={item.image} style={styles.restaurantImage} />
          <Text style={styles.restaurantName}>{item.title}</Text>
          <Text>{item.cuisine}</Text>
          <Text>⭐ {item.rating} • {item.delivery} • ⏱️ {item.time}</Text>
        </View>
      ))} */}

      {/* Famous Places */}
      {/* <Text style={styles.sectionTitle}>Famous Places</Text> */}
      <View style={[commonStyles.row,commonStyles.mt24,{paddingHorizontal:16}]}>
        <Text style={[commonStyles.title]}>Famous Places</Text>
        <TouchableOpacity>
          <Text style={styles.moreText}>More</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        horizontal
        data={famousPlaces} contentContainerStyle={{padding:16}}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View style={styles.placeCard}>
            <Image source={{uri:item.image}} style={styles.placeImage} />
            <View style={{padding:8}}>
              <Text style={{fontSize:14,fontWeight:'600'}} numberOfLines={2}>{item.title}</Text>
              <View style={{flexDirection:'row',alignItems:'center',gap:4}}>
                <Text style={[commonStyles.text5,{color:'#878787'}]}>{item.distance}</Text>
                <Text style={[commonStyles.text5,{color:'#878787'}]}> • ⭐ {item.rating}</Text>
              </View>
            </View>
          </View>
        )}
        showsHorizontalScrollIndicator={false}
      />
    </ScrollView>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16, backgroundColor: '#fff' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',padding:16 },
  location: { fontSize: 17,fontWeight:"300",letterSpacing:-0.34},
  avatar: { width: 40, height: 40, borderRadius: 20 },
  greeting: { fontSize: 18, color: 'rgba(101, 101, 101, 0.50)',fontWeight:'400',letterSpacing:-0.36 },
  name: { fontSize: 25, fontWeight: '700',letterSpacing:-0.5 },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F7F7F7',
    borderRadius: 10,
    paddingHorizontal: 12,
    marginTop: 16,
    height: 50,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#656565',
    fontWeight:'400',
  },
  // searchInput: {
  //   backgroundColor: '#f0f0f0',
  //   borderRadius: 10,
  //   paddingHorizontal: 15,
  //   marginTop: 10,
  //   height: 40,
  // },
  sectionTitle: { marginTop: 20, fontSize: 18, fontWeight: 'bold' ,paddingLeft:16 },
  card: {
     marginRight: 16, 
    //  alignItems: 'center',
     width:144,
     height:110,
    //  borderWidth:1,
     borderRadius:8,
     shadowColor: '#000',
     shadowOpacity: 0.3,
     shadowRadius: 10,
     elevation: 3, 
     backgroundColor:commonStyles.bgColor ,
     borderBottomRightRadius:8
     },
  cardImage: { width: 120, height: 70, marginBottom: 5,resizeMode:"contain" },
  popularCard: { width:212,height:270,borderRadius: 8, marginRight: 16,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 3,flex:1
  },
  foodImage: { width: '85%', height: '68%'},
  foodTitle: { fontWeight: 'bold', marginTop: 5 },
  restaurantCard: { marginTop: 16,marginRight:16},
  restaurantImage: { width: 300, height: 137, borderRadius: 10 ,resizeMode:"cover"},
  restaurantName: { fontSize: 16, fontWeight: 'bold', marginTop: 5 },
  placeCard: { marginRight: 10, width: 154},
  placeImage: { width: '100%', height: 100, borderRadius: 10 },

  popularImgContainer:{
    height:186,
    borderTopLeftRadius:8,
    borderTopRightRadius:8
  },
  popularFoodsBottomContainer:{
    flex:1,
    backgroundColor:'#F5F5F5',
    borderBottomLeftRadius:8,
    borderBottomRightRadius:8,
    justifyContent:'center',
    padding:16,
  },
  categoryImgContainer:{
    position:"absolute",
    bottom:0,
    right:0,
    borderTopLeftRadius:60,
    borderTopRightRadius:60
  },
  moreText:{
    fontSize:14,
    fontWeight:'700',
    color:'rgba(101, 101, 101, 0.50)',
    // marginTop:8,
  },
});
