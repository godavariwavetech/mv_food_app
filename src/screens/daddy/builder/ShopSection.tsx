import React from "react";
import { View, Text, StyleSheet, FlatList } from "react-native";
import ShopCard from "./ShopCard";
import { responsiveHeight, responsiveWidth } from "react-native-responsive-dimensions";
import {useNavigation} from '@react-navigation/native';

const ShopSection = ({shops}:any) => {
 const navigation:any = useNavigation()

  const handleNavigation = (item:any) =>{
    navigation.navigate("RestaurantScreen",{shopId:item.shop_id,shopItem:item.shop_items_tb_nm,item})
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Top rated shops now at your door step</Text>
      <View style={styles.shopGrid}>
        <FlatList
        data={shops}
        numColumns={2}
        keyExtractor={item=>item.shop_id}
        style={{paddingBottom:responsiveHeight(5)}}
        columnWrapperStyle={{alignItems:"center",marginLeft:responsiveWidth(3)}}
        renderItem={({item})=>{
          return <ShopCard
          key={item.shop_id}
          name={item.shop_name}
          category={"Mutton-Fish-chicken"}
          rating={item.shop_rating}
          deliveryTime={"30"}
          imageUri={item.shop_image}
          handleNavigation={()=>handleNavigation(item)}
        />
        }}
        ListEmptyComponent={()=>{
          return <View style={{width:responsiveWidth(100),height:responsiveHeight(25),alignItems:"center",justifyContent:"center"}}>
              <Text style={{fontSize:16,fontWeight:"700",color:"#000"}}>Oops! No shops found.</Text>
            </View>
        }}
        />
        {/* {shops.map((shop) => (
          <ShopCard
            key={shop.id}
            name={shop.name}
            category={shop.category}
            rating={shop.rating}
            deliveryTime={shop.deliveryTime}
            imageUri={shop.imageUri}
          />
        ))} */}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 16,
    // paddingHorizontal: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    color:"#065E2C",
    // marginBottom: 12,
    marginLeft:responsiveWidth(5)
  },
  shopGrid: {
    // flexDirection: "row",
    // flexWrap: "wrap",
    // justifyContent: "space-between",
  },
});

export default ShopSection;
