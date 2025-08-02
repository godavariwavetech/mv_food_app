import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/FontAwesome'; // Use any other icon set you prefer
import commonStyles from '../commonstyles/CommonStyles';
import { colors } from '../config/theme';

const TermsAndConditions = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      {/* Header with Back Button and Title */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}>
-           <Icon name="chevron-left" size={20} color="#333" />
+           <Icon name="chevron-left" size={20} color={colors.darkGray} />
        </TouchableOpacity>
        <Text style={styles.title}>Terms and Conditions</Text>
      </View>

      {/* Scrollable Content */}
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.section}>
          <Text style={styles.content}>
            1. Your use of the Service is at your sole risk. The service is
            provided on an "as is" and "as available" basis.
          </Text>
          <Text style={styles.content}>
            2. Support for services is only available in English, via email.
          </Text>
          <Text style={styles.content}>
            3. You understand that third-party vendors provide the necessary
            hardware, software, networking, storage, and related technology
            required to run the Service.
          </Text>
          <Text style={styles.content}>
            4. You must not modify, adapt or hack the Service or falsely imply
            association with another service.
          </Text>
          <Text style={styles.content}>
            5. You may not use this service in violation of applicable laws or
            regulations.
          </Text>
          <Text style={styles.content}>
            6. Reproduction or duplication of any portion of the Service without
            permission is prohibited.
          </Text>
          <Text style={styles.content}>
            7. We reserve the right to remove content that violates these terms.
          </Text>
          <Text style={styles.content}>
            8. Abuse or harassment of any user or staff will result in immediate
            termination of your account.
          </Text>
          <Text style={styles.content}>
            9. These terms and conditions are subject to change without notice.
          </Text>
          <Text style={styles.content}>
            10. By using this service, you agree to these terms and conditions.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
};

export default TermsAndConditions;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: commonStyles.bgColor,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    justifyContent: 'center',
  },
  backButton: {
    marginRight: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    alignSelf: 'center',
    flex: 1,
    textAlign: 'center',
  },
  scrollView: {
    flex: 1,
    backgroundColor:commonStyles.bgColor
  },
  section: {
    backgroundColor: colors.white,
    borderRadius: 8,
    marginTop: 32,
    borderWidth: 1,
    borderColor: commonStyles.strokeLines,
    paddingHorizontal:12,
    paddingVertical:16
  },
  content: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 15,
    color: colors.darkGray,
  },
});
