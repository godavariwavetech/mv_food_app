import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Image,
  TextInput,
  StatusBar,
  ScrollView,
  ActivityIndicator,
  Alert,
  Platform,
  Modal,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';
import { getProfile, updateProfile } from '../../redux/reducers/auth';
import CustomModal from '../../components/CustomModal';
import { launchImageLibrary } from 'react-native-image-picker';

const { width, height } = Dimensions.get('window');

// Reusable Input Component
const CustomInput = ({ label, value, onChangeText, placeholder, icon, keyboardType = 'default', editable = true, onPress }) => {
  return (
    <View style={styles.inputContainer}>
      <TouchableOpacity 
        activeOpacity={onPress ? 0.7 : 1} 
        onPress={onPress}
        disabled={!onPress}
        style={[styles.inputBox, !editable && { backgroundColor: '#F5F5F5' }]}
      >
        <View style={styles.inputLeft}>
          {icon && <View style={styles.inputIcon}>{icon}</View>}
          <TextInput
            style={styles.textInput}
            value={value}
            onChangeText={onChangeText}
            placeholder={placeholder}
            placeholderTextColor="#A8A8A8"
            keyboardType={keyboardType}
            editable={onPress ? false : editable}
            pointerEvents={onPress ? 'none' : 'auto'}
          />
        </View>
        {label === 'Gender' && <Icon name="keyboard-arrow-down" size={24} color="#82889A" />}
        {onPress && label === 'Date of Birth' && <Icon name="calendar-today" size={20} color="#82889A" />}
      </TouchableOpacity>
      <View style={styles.labelContainer}>
        <Text style={styles.labelText}>{label}</Text>
      </View>
    </View>
  );
};

export default function MyAccountScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const dispatch = useDispatch();
  
  const { customerId,profile, loading, message } = useSelector(state => state.Auth);

  console.log(customerId,">>>>>>>>>>>>>>>>>customerId",profile);
  
  const [name, setName] = useState('Alex');
  const [gender, setGender] = useState('male');
  const [mobile, setMobile] = useState('');
  const [email, setEmail] = useState('alex@gmail.com');
  
  const [profileImage, setProfileImage] = useState(null);
  const [imagesData, setImagesData] = useState(null);
  
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [isGenderModalOpen, setIsGenderModalOpen] = useState(false);

  const genderOptions = ['Male', 'Female', 'Other'];

  useEffect(() => {
    dispatch(getProfile());
  }, []);

  useEffect(() => {
    if (profile) {
      setName(profile.customer_name || '');
      setGender(profile.customer_gender || '');
      setMobile(profile.customer_mobile_number || '');
      setEmail(profile.customer_email || '');
    }
  }, [profile]);

  const handleUpdate = async () => {
    if (!name || !mobile) {
      Alert.alert('Error', 'Name and Mobile Number are required.');
      return;
    }

    const profileData = {
      user_id: profile?.id,
      customer_name: name,
      customer_gender: gender,
      customer_mobile_number: mobile,
      customer_email: email,
      imagesData: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAIAAACRXR/mAAAAVklEQVR4nOzOMRHAIAAAsV6vFioMt8jDAMtPMCQK8v1zPPd5Twf2tAqtQqvQKrQKrUKr0Cq0Cq1Cq9AqtAqtQqvQKrQKrUKr0Cq0Cq1Cq9AqVgAAAP//KykBhbeiw1UAAAAASUVORK5CYII=", // Base64 string
      profile_image: profile?.customer_image || '', // Assuming backend needs existing image path or similar if not changing
    };

    console.log(profileData,">>>>>>>>>>>>>>PROFIE DTAAA");

    const result = await dispatch(updateProfile(profileData));
    console.log(result,">>>>>>>>>>>RESULTTTTTTTTT");
    if (updateProfile.fulfilled.match(result)) {
      setShowSuccessModal(true);
      dispatch(getProfile());
    } else {
      Alert.alert('Update Failed', message || 'Something went wrong while updating your profile.');
    }
  };

  const handlePickImage = () => {
    const options = {
      mediaType: 'photo',
      includeBase64: true,
      maxHeight: 1000,
      maxWidth: 1000,
    };

    launchImageLibrary(options, (response) => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.errorCode) {
        console.log('ImagePicker Error: ', response.errorMessage);
        Alert.alert('Error', 'Failed to open gallery. Please ensure permissions are granted.');
      } else if (response.assets && response.assets.length > 0) {
        const source = { uri: response.assets[0].uri };
        setProfileImage(source);
        setImagesData(`data:image/png;base64,${response.assets[0].base64}`);
      }
    });
  };

  const selectGender = (val) => {
    setGender(val);
    setIsGenderModalOpen(false);
  };

  return (
    <View style={styles.mainContainer}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      
      {/* HEADER GRADIENT */}
      <LinearGradient
        colors={['#EE6F00', '#C24501']}
        style={styles.headerGradient}
      />

      {/* HEADER ROW */}
      <View style={[styles.headerRow, { paddingTop: insets.top + 20 }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Icon name="arrow-back" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My Account</Text>
      </View>

      {/* SCROLLABLE CONTENT */}
      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        style={styles.scrollView}
      >
        <View style={styles.headerSpacer} />

        <View style={styles.profileCard}>
          <TouchableOpacity style={styles.profileImageContainer} onPress={handlePickImage} activeOpacity={0.8}>
            <Image 
              source={profileImage || require("../daddy/tabassets/dummy-profile.png")} 
              style={styles.profileImage}
            />
            <View style={styles.cameraIconContainer}>
              <MaterialCommunityIcons name="camera" size={18} color="#FFFFFF" />
            </View>
          </TouchableOpacity>

          <View style={styles.userDetailsBox}>
            <Text style={styles.userName}>{name || profile?.customer_name || 'User'}</Text>
            <Text style={styles.userContact}>
              {mobile || profile?.customer_mobile_number} {email || profile?.customer_email ? `| ${email || profile?.customer_email}` : ''}
            </Text>
          </View>

          <View style={styles.formContainer}>
            <CustomInput label="Name" value={name} onChangeText={setName} />
            <CustomInput label="Gender" value={gender} onPress={() => setIsGenderModalOpen(true)} />
            <CustomInput 
              label="Mobile Number" 
              value={mobile} 
              onChangeText={setMobile} 
              keyboardType="phone-pad" 
              editable={false} 
            />
            <CustomInput label="Email" value={email} onChangeText={setEmail} keyboardType="email-address" />
          </View>
        </View>
      </ScrollView>

      {/* FOOTER BUTTON */}
      <View style={styles.bottomContainer}>
        <TouchableOpacity 
          style={styles.updateButton} 
          activeOpacity={0.8}
          onPress={handleUpdate}
          disabled={loading.updateProfile}
        >
          {loading.updateProfile ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text style={styles.updateButtonText}>Update Profile</Text>
          )}
        </TouchableOpacity>
      </View>

      {/* Gender Selection Modal */}
      <Modal
        visible={isGenderModalOpen}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setIsGenderModalOpen(false)}
      >
        <TouchableOpacity 
          style={styles.modalOverlay} 
          activeOpacity={1} 
          onPress={() => setIsGenderModalOpen(false)}
        >
          <View style={styles.genderModalContainer}>
            <Text style={styles.modalTitle}>Select Gender</Text>
            {genderOptions.map((item) => (
              <TouchableOpacity 
                key={item} 
                style={styles.genderOption} 
                onPress={() => selectGender(item)}
              >
                <Text style={[styles.genderOptionText, gender === item && styles.selectedGenderText]}>
                  {item}
                </Text>
                {gender === item && <Icon name="check" size={20} color="#FC6011" />}
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>

      <CustomModal
        visible={showSuccessModal}
        title="Success"
        message="Your profile has been updated successfully."
        confirmText="Great!"
        onConfirm={() => setShowSuccessModal(false)}
        showCancel={false}
        cancelText=''
      />
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  headerGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 208,
    borderBottomLeftRadius: 26,
    borderBottomRightRadius: 26,
    zIndex: 1,
  },
  headerRow: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    zIndex: 10,
  },
  backButton: {
    padding: 5,
  },
  headerTitle: {
    fontFamily: 'SF Pro',
    fontWeight: '700',
    fontSize: 18,
    color: '#FFFFFF',
    marginLeft: 8,
  },
  scrollView: {
    flex: 1,
    zIndex: 5,
  },
  scrollContent: {
    paddingBottom: 140,
  },
  headerSpacer: {
    height: 128,
  },
  profileCard: {
    width: width * 0.92, 
    alignSelf: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingBottom: 24,
    alignItems: 'center',
    elevation: 8, 
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },
  profileImageContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginTop: -50,
    borderWidth: 3,
    borderColor: '#FFFFFF',
    backgroundColor: '#FFF',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    position: 'relative',
  },
  profileImage: {
    width: '100%',
    height: '100%',
    borderRadius: 50,
  },
  cameraIconContainer: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#FC6011',
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  userDetailsBox: {
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 20,
  },
  userName: {
    fontFamily: 'SF Pro Display',
    fontWeight: '700',
    fontSize: 20,
    color: '#525252',
    marginBottom: 4,
  },
  userContact: {
    fontFamily: 'SF Pro Display',
    fontWeight: '500',
    fontSize: 12,
    color: '#525252',
    marginBottom: 6,
    textAlign: 'center',
  },
  formContainer: {
    width: '100%',
    gap: 16, 
  },
  inputContainer: {
    width: '100%',
    position: 'relative',
    marginTop: 6,
  },
  inputBox: {
    width: '100%',
    height: 48,
    backgroundColor: '#FFFFFF',
    borderWidth: 0.8,
    borderColor: '#D8D8D8',
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 14,
  },
  inputLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  inputIcon: {
    marginRight: 8,
  },
  textInput: {
    flex: 1,
    height: 48,
    fontFamily: 'SF Pro Display',
    fontSize: 15,
    color: '#3E4851',
    padding: 0, 
  },
  labelContainer: {
    position: 'absolute',
    top: -10,
    left: 14,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 6,
    zIndex: 2,
  },
  labelText: {
    fontFamily: 'SF Pro Display',
    fontWeight: '600',
    fontSize: 12,
    color: '#525252',
  },
  bottomContainer: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    backgroundColor: '#FFFFFF',
    paddingBottom: 40,
    paddingTop: 10,
    alignItems: 'center',
    borderTopWidth: 0.5,
    borderTopColor: '#F0F0F0',
    zIndex: 20,
  },
  updateButton: {
    width: width * 0.85, 
    height: 48,
    backgroundColor: '#FC6011',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  updateButtonText: {
    fontFamily: 'SF Pro Display',
    fontWeight: '700',
    fontSize: 16,
    color: '#FFFFFF',
  },
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  genderModalContainer: {
    width: width * 0.8,
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 20,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#000',
    marginBottom: 15,
    textAlign: 'center',
  },
  genderOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 0.5,
    borderBottomColor: '#EEE',
  },
  genderOptionText: {
    fontSize: 16,
    color: '#333',
  },
  selectedGenderText: {
    color: '#FC6011',
    fontWeight: '600',
  },
});