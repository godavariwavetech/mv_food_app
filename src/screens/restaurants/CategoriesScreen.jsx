import { StyleSheet, Text, View,SafeAreaView,Image,FlatList,StatusBar,TouchableOpacity } from 'react-native'
import React from 'react'
import commonStyles from '../../commonstyles/CommonStyles';
import { useNavigation } from '@react-navigation/native';
import AntDesign from 'react-native-vector-icons/AntDesign';

const categories = [
    { id: '1', title: 'Restaurant', image: require('../daddy/svg/biryani.png')},
    { id: '2', title: 'Groceries', image: require('../daddy/svg/vegetables.png') },
    { id: '3', title: 'Restaurant', image: require('../daddy/svg/biryani.png')},
    { id: '4', title: 'Groceries', image: require('../daddy/svg/vegetables.png') },
    { id: '5', title: 'Restaurant', image: require('../daddy/svg/biryani.png')},
    { id: '6', title: 'Groceries', image: require('../daddy/svg/vegetables.png') },
    { id: '7', title: 'Restaurant', image: require('../daddy/svg/biryani.png')},
    { id: '8', title: 'Groceries', image: require('../daddy/svg/vegetables.png') },
    { id: '9', title: 'Restaurant', image: require('../daddy/svg/biryani.png')},
    { id: '10', title: 'Groceries', image: require('../daddy/svg/vegetables.png') },
    { id: '11', title: 'Restaurant', image: require('../daddy/svg/biryani.png')},
    { id: '12', title: 'Groceries', image: require('../daddy/svg/vegetables.png') },
  ];

const CategoriesScreen = () => {
    const navigation = useNavigation();

  return (
    <SafeAreaView style={{ flex: 1 ,backgroundColor:commonStyles.bgColor,paddingTop:16}}>
        {/* <StatusBar barStyle="dark-content" backgroundColor={'transparent'} translucent /> */}
      <View style={{flex:1}}>
        <View style={styles.headerContainer}>
            <TouchableOpacity onPress={()=>navigation.goBack()}>
                <AntDesign name="arrowleft" size={25} color="#000"  />
            </TouchableOpacity>
            <Text style={styles.title}>Categories</Text>
        </View>
      <FlatList
        // horizontal
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
        showsVerticalScrollIndicator={false} numColumns={2} 
      />
      </View>
    </SafeAreaView>
  )
}

export default CategoriesScreen

const styles = StyleSheet.create({
    card: {
        marginRight: 16, 
       //  alignItems: 'center',
        // width:144,
        width:'48%',
        marginBottom:16,
        height:120,
       //  borderWidth:1,
        borderRadius:8,
        shadowColor: '#000',
        shadowOpacity: 0.3,
        shadowRadius: 10,
        elevation: 3, 
        backgroundColor:commonStyles.bgColor ,
        borderBottomRightRadius:8
        },
     cardImage: { width: 130, height: 80, marginBottom: 5,resizeMode:"contain" },
     categoryImgContainer:{
        position:"absolute",
        bottom:0,
        right:0,
        borderTopLeftRadius:100,
        borderTopRightRadius:100
      },
      headerContainer:{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal:16,
        paddingTop:12,
        // marginVertical: 12,
        marginTop:16
      },
      title:{
        fontSize:20,
        fontWeight:'700',
        color:'#18202E',
        textAlign: 'center',
        flex: 1,
      },
      
})