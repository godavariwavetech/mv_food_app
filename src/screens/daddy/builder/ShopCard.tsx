import React from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
//@ts-ignore
import AntDesign from "react-native-vector-icons/AntDesign"
//@ts-ignore
import EvilIcons from "react-native-vector-icons/EvilIcons";
import Trapezium from "../tabassets/Trapezium";
import { responsiveHeight, responsiveWidth } from "react-native-responsive-dimensions";
import {Shadow} from 'react-native-shadow-2';

interface ShopCardProps {
  name: string;
  category: string;
  rating: string;
  deliveryTime: string;
  imageUri: string;
  handleNavigation:any
}

const ShopCard = ({
  name,
  category,
  rating,
  deliveryTime,
  imageUri,
  handleNavigation
}: ShopCardProps) => {
  return (
    <TouchableOpacity onPress={handleNavigation} style={styles.container}>
      <Image
        source={{ uri: imageUri }}
        style={styles.image}
        resizeMode="cover"
      />
                  <Shadow
                    distance={13}
                    offset={[3, 3]}
                    startColor="rgba(128, 128, 128, 0.2)"
                    // style={{marginHorizontal: 5, marginVertical: 10}}
                    >
      <View style={styles.infoContainer}>
        <Text style={styles.name}>{name}</Text>
        <Text style={styles.category}>{category}</Text>
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <AntDesign name="staro" color="#065E2C"  />

            <Text style={styles.statText}>{rating}</Text>
          </View>
          <View style={styles.statItem}>
          <EvilIcons name="clock" color="#065E2C"   />

            <Text style={styles.statText}>{deliveryTime}</Text>
          </View>
        </View>
        {/* <Trapezium children={<View style={{width:200,justifyContent:"space-evenly",alignSelf:"center",paddingHorizontal:responsiveWidth(5)}}>

        <Image
        source={{ uri: imageUri }}
        style={styles.image}
        resizeMode="cover"
      />
        <View style={{gap:2}}>

          <Text style={styles.name}>{name}</Text>
          <Text style={styles.category}>{category}</Text>
          <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <AntDesign name="staro" color="#065E2C"  />

            <Text style={styles.statText}>{rating}</Text>
          </View>
          <View style={styles.statItem}>
          <EvilIcons name="clock" color="#065E2C"   />

            <Text style={styles.statText}>{deliveryTime}</Text>
          </View>
        </View>
        </View>
        </View>} /> */}
      </View>
      </Shadow>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    // backgroundColor: "#fff",
    // borderRadius: 8,
    // overflow: "hidden",
    // shadowColor: "#000",
    // shadowOffset: { width: 0, height: 1 },
    // shadowOpacity: 0.1,
    // shadowRadius: 2,
    // elevation: 1,
    width:responsiveWidth(47),
    alignItems:"center",
    justifyContent:"center"
    // marginRight: 16,
    // marginBottom: 16,
    // width: "45%",
  },
  image: {
    width: responsiveWidth(37),
    height: responsiveWidth(28),
    borderRadius:20,
    transform:[{translateY:responsiveHeight(3.5)}],
    zIndex:10,
    // alignSelf:'center'
    // marginBottom:responsiveHeight(1)
    // transform:[{translateY:-30}]
  },
  infoContainer: {
    // padding: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
    backgroundColor:"#fff",
    borderRadius:12,
    width:responsiveWidth(43),
    height:responsiveHeight(13),
    // paddingVertical:25,
    // height:123,
    // width:183,
    alignItems:"flex-start",
    justifyContent:"flex-end",
    paddingBottom:responsiveHeight(1.5),
    paddingHorizontal:responsiveWidth(5),
    gap:2
    // marginRight: 16,
    // marginBottom: 16,
    
  },
  name: {
    fontWeight: "700",
    fontSize: 16,
    textAlign:"left",
    color:"#32343E",
    // marginVertical:5
  },
  category: {
    color: "#646982",
    fontSize: 13,
     textAlign:"left"
  },
  statsContainer: {
    flexDirection: "row",
    marginTop: 4,
  },
  statItem: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 12,
  },
  statIcon: {
    width: 16,
    height: 16,
    marginRight: 4,
  },
  statText: {
    fontSize: 12,
    fontWeight:"700",
    color:"#3D3D3D"
  },

});

export default ShopCard;
