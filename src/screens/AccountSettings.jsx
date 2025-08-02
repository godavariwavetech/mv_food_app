import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome'; // For icons
import commonStyles from '../commonstyles/CommonStyles';
import { responsiveWidth } from 'react-native-responsive-dimensions';

const AccountSettings = ({navigation}) => {
  return (
    <View style={styles.container}>

      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Icon name="chevron-left" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.title}>Account Settings</Text>
        <View style={styles.placeholder} />
      </View>

      {/* Header */}
      {/* <View style={styles.header}>
        <Text style={styles.headerText}>Account Settings</Text>
      </View> */}

      {/* Settings Options */}
      <View style={styles.settingsContainer}>
    <View style={styles.section}>    
        <TouchableOpacity style={styles.option}>
          <Icon name="user" size={20} color="#007BFF" />
          <Text style={styles.optionText}>Update Profile</Text>
        </TouchableOpacity>


        {/* Notifications */}
        <TouchableOpacity style={styles.option}>
          <Icon name="bell" size={20} color="#007BFF" />
          <Text style={styles.optionText}>Notification Preferences</Text>
        </TouchableOpacity>

        {/* Logout */}
        <TouchableOpacity style={[styles.option]}>
          <Icon name="trash" size={20} color="#FF6347" />
          <Text style={[styles.optionText, styles.logoutText]}>Delete Account</Text>
        </TouchableOpacity>
      </View>
      </View>    
    </View>
  );
};

export default AccountSettings;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: commonStyles.bgColor,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
    paddingVertical: 10,
    paddingHorizontal: 15,
  },
  backButton: {
    marginRight: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    flexGrow: 1,
  },
  placeholder: {
    width: 24, 
  },
  settingsContainer: {
    marginTop: 20,
    paddingHorizontal: 20,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingVertical: 15,
    paddingHorizontal: 10,
    marginBottom: 10,
    borderRadius: 5,
    // shadowColor: '#000',
    // shadowOffset: { width: 0, height: 2 },
    // shadowOpacity: 0.1,
    // shadowRadius: 3,
    // elevation: 2,
  },
  optionText: {
    marginLeft: 15,
    fontSize: 16,
    color: '#333',
  },
  logoutOption: {
    backgroundColor: '#fff5f5',
  },
  logoutText: {
    color: '#FF6347',
    fontWeight: 'bold',
  },
  section: {
    backgroundColor: '#fff',
    width:responsiveWidth(90),
    borderRadius: 8,
    marginTop: 32,
    borderWidth: 1,
    borderColor: commonStyles.strokeLines,
    paddingHorizontal:12,
    paddingVertical:16
  },
});
