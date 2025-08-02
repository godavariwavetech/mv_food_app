import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useNavigation } from '@react-navigation/native';
import commonStyles from '../commonstyles/CommonStyles';
import { colors } from '../config/theme';

const PrivacyPolicy = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Icon name="chevron-left" size={24} color={colors.darkGray} />
        </TouchableOpacity>
        <Text style={styles.title}>Privacy Policy</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.scrollView}>
        <View style={styles.section}>
        <Text style={styles.content}>
          1. Introduction: This Privacy Policy explains how we collect, use, and protect your personal data.
        </Text>
        <Text style={styles.content}>
          2. Information Collection: We collect information when you use our app, including device data and usage patterns.
        </Text>
        <Text style={styles.content}>
          3. Data Use: Your data is used to improve our services and provide personalized experiences.
        </Text>
        <Text style={styles.content}>
          4. Data Sharing: We may share your data with third-party vendors for service improvement.
        </Text>
        <Text style={styles.content}>
          5. Security Measures: We implement robust security measures to protect your data.
        </Text>
        <Text style={styles.content}>
          6. Changes to Policy: This policy may change without notice.
        </Text>
        <Text style={styles.content}>
          7. Contact Us: For questions or concerns, please contact us via email.
        </Text>
        </View>
      </ScrollView>
    </View>
  );
};

export default PrivacyPolicy;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    backgroundColor:commonStyles.bgColor,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
    paddingVertical: 10,
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
  scrollView: {
    flexGrow: 1,
    backgroundColor:commonStyles.bgColor
  },
  content: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 15,
    color: '#333',
  },
  section: {
    backgroundColor: colors.white,
    borderRadius: 8,
    marginTop: 32,
    borderWidth: 1,
    borderColor: commonStyles.strokeLines,
    paddingHorizontal:12,
    paddingVertical:16,
  },
});
