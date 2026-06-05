import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  Image,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  ScrollView,
  Keyboard,
  SafeAreaView,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import {
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import CategoryInactive from './tabassets/CategoryInactive';
import { getAllCategories, getCategories, setActiveCategoryIndex, setsubCategory } from '../../redux/reducers/daddy';
import { useDispatch, useSelector } from 'react-redux';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { globalSearch } from '../../redux/reducers/addressSlice';
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';
import commonStyles from '../../commonstyles/CommonStyles';
import StatusBarManager from '../../components/StatusBarManager';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const CategoriesScreen = ({ navigation, route }) => {
  const { allCategories, categories: mainCategoriesFromStore } = useSelector(state => state.Dashboard);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredCategories, setFilteredCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchLoading, setSearchLoading] = useState(false);
  const insets = useSafeAreaInsets();
  const dispatch = useDispatch();
  const timeoutRef = useRef();
  const { globalSearchResults } = useSelector(state => state.address);

  useEffect(() => {
    const fetchCategories = async () => {
      setLoading(true);
      await Promise.all([
        dispatch(getCategories()),
        dispatch(getAllCategories())
      ]);
      setLoading(false);
    };
    fetchCategories();
  }, [dispatch]);

  useEffect(() => {
    if (!mainCategoriesFromStore) return;

    // Map main categories from store and attach sub-categories from allCategories
    const groupedData = mainCategoriesFromStore.map(mainCat => {
      const subCats = (allCategories || []).filter(item => 
        String(item.category_id) === String(mainCat.id)
      );

      return {
        id: mainCat.id,
        category_name: mainCat.category_name,
        category_image: mainCat.category_image,
        sub_categories: subCats.map(sc => ({
          id: sc.id,
          sub_category_name: sc.sub_category_name,
          sub_category_image: sc.sub_category_image,
          category_id: sc.category_id
        }))
      };
    });

    // Handle any sub-categories that might not have a corresponding main category in the current location list
    // (Optional: if you want to show ALL categories regardless of location)
    if (allCategories) {
      allCategories.forEach(sc => {
        if (!groupedData.find(gc => String(gc.id) === String(sc.category_id))) {
          // Check if it's already in groupedData (could happen if we added it in a previous iteration)
          const existing = groupedData.find(gc => String(gc.id) === String(sc.category_id));
          if (!existing) {
             // We don't have main category info for this sub-category from the location-based list
             // So we try to extract it from the sub-category item itself if it exists
             if (sc.category_name) {
                groupedData.push({
                  id: sc.category_id,
                  category_name: sc.category_name,
                  category_image: sc.category_image,
                  sub_categories: allCategories.filter(item => String(item.category_id) === String(sc.category_id)).map(s => ({
                    id: s.id,
                    sub_category_name: s.sub_category_name,
                    sub_category_image: s.sub_category_image,
                    category_id: s.category_id
                  }))
                });
             }
          }
        }
      });
    }

    setCategories(groupedData);
    setFilteredCategories(groupedData);
  }, [allCategories, mainCategoriesFromStore]);

  const handleSearch = (query) => {
    setSearchQuery(query);
    clearTimeout(timeoutRef.current);

    if (query.trim()) {
      setSearchLoading(true);
      timeoutRef.current = setTimeout(() => {
        dispatch(globalSearch({ searchText: query })).then(() => setSearchLoading(false));
      }, 500);
    } else {
      setSearchLoading(false);
      setFilteredCategories(categories);
    }
  };

  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredCategories(categories);
      return;
    }

    const localFiltered = categories.map(category => {
      const categoryMatches = category?.category_name?.toLowerCase()?.includes(searchQuery?.toLowerCase());
      const subCategoryMatches = category?.sub_categories?.filter(sub =>
        sub.sub_category_name?.toLowerCase()?.includes(searchQuery?.toLowerCase())
      );

      return (categoryMatches || subCategoryMatches.length > 0) ? {
        ...category,
        sub_categories: categoryMatches ? category.sub_categories : subCategoryMatches
      } : null;
    }).filter(Boolean);

    const apiResults = (globalSearchResults || [])
      .filter(result => result.search_table === 'z_food_restaurant_item_lst_t')
      .map(result => ({
        id: `search-${result.search_id}`,
        category_name: 'Search Results',
        sub_categories: [{
          id: result.search_id,
          sub_category_name: result.search_text,
          sub_category_image: result.search_image
        }]
      }));

    const combinedResults = [...localFiltered, ...apiResults];
    const uniqueResults = combinedResults.filter((v, i, a) =>
      a.findIndex(t => t.id === v.id) === i
    );

    setFilteredCategories(uniqueResults);
  }, [searchQuery, categories, globalSearchResults]);

  const handleNavigation = async (item, subItem) => {
    Keyboard.dismiss();
    await dispatch(setActiveCategoryIndex(item.id || item.category_id));
    dispatch(setsubCategory(subItem));
    navigation.navigate('CategorieItems');
  };

  const renderMainCategory = ({ item }) => (
    <TouchableOpacity 
      style={styles.mainCategoryCard} 
      onPress={() => setSelectedCategory(item)}
    >
      <View style={styles.mainCategoryContent}>
        {item.category_image ? (
          <Image source={{ uri: item.category_image }} style={styles.mainCategoryImage} resizeMode="contain" />
        ) : (
          <View style={[styles.mainCategoryImage, { backgroundColor: '#F0F0F0', justifyContent: 'center', alignItems: 'center' }]}>
             <Icon name="image-outline" size={24} color="#CCC" />
          </View>
        )}
        <Text style={styles.mainCategoryName}>{item.category_name || 'Unnamed Category'}</Text>
      </View>
      <Icon name="chevron-forward" size={24} color="#A3A3A3" />
    </TouchableOpacity>
  );

  const renderSubCategory = ({ item: subItem }) => (
    <TouchableOpacity 
      onPress={() => handleNavigation(selectedCategory || { id: subItem.category_id }, subItem)} 
      style={styles.subCategoryListItem}
    >
      <View style={styles.subCategoryLeft}>
        <Image source={{ uri: subItem.sub_category_image }} style={styles.subCategoryImage} />
        <Text style={styles.subCategoryName}>{subItem.sub_category_name}</Text>
      </View>
      <Icon name="arrow-forward-circle-outline" size={24} color={commonStyles.btn2Color} />
    </TouchableOpacity>
  );

  const handleSearchResultPress = (result) => {
    Keyboard.dismiss();
    if (result.search_type == 2) {
      navigation.navigate('BannerRestaurantScreen', { ...result, fromSearch: true });
    } else {
      navigation.navigate('SearchShopList', result);
    }
  };

  const renderSearchResult = ({ item }) => (
    <TouchableOpacity style={styles.searchResultItem} onPress={() => handleSearchResultPress(item)}>
      <Image source={{ uri: item.search_image }} style={styles.searchResultImage} resizeMode="cover" />
      <View style={{ paddingHorizontal: responsiveWidth(2), flex: 1 }}>
        <Text style={styles.searchResultTitle} numberOfLines={1}>{item.search_text}</Text>
        <Text style={styles.searchResultSubtitle} numberOfLines={1}>{item.search_tagline}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.container}>
      <StatusBarManager screenName="categories" />
      <SafeAreaView style={{ backgroundColor: '#fff', paddingTop: 20 }}>
        <View style={styles.figmaHeaderContainer}>
          <View style={styles.titleWrapper}>
            {selectedCategory ? (
              <TouchableOpacity onPress={() => setSelectedCategory(null)} style={{ marginRight: 10 }}>
                <FontAwesome6 name="arrow-left-long" size={20} color="#2D2D2D" />
              </TouchableOpacity>
            ) : route.params?.isFromHome ? (
              <TouchableOpacity onPress={() => navigation.goBack()} style={{ marginRight: 10 }}>
                <FontAwesome6 name="arrow-left-long" size={20} color="#2D2D2D" />
              </TouchableOpacity>
            ) : (
              <CategoryInactive color="#2D2D2D" style={{ marginRight: 10 }} />
            )}
            <Text style={styles.reOrderTitle}>
              {selectedCategory ? selectedCategory.category_name : 'All Categories'}
            </Text>
          </View>
          
          {!selectedCategory && (
            <View style={styles.searchWrapper}>
              <View style={styles.searchBarContainer}>
                <TextInput
                  style={styles.searchPlaceholderText}
                  placeholder="Search for your favorites"
                  placeholderTextColor="#666666"
                  value={searchQuery}
                  onChangeText={handleSearch}
                />
                {searchLoading ? (
                  <ActivityIndicator size="small" color={commonStyles.btn2Color} />
                ) : (
                  <Icon name="search" size={18} color="#7A7A7A" />
                )}
              </View>
            </View>
          )}
        </View>
      </SafeAreaView>

      {loading ? (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color="#065E2C" />
        </View>
      ) : (
        <View style={{ flex: 1 }}>
          {searchQuery.trim() ? (
            <ScrollView style={styles.searchResultsContainer}>
              {globalSearchResults?.length > 0 && (
                <>
                  <Text style={styles.sectionTitle}>Search Results</Text>
                  <FlatList
                    data={globalSearchResults}
                    renderItem={renderSearchResult}
                    keyExtractor={item => item.id.toString()}
                    scrollEnabled={false}
                    contentContainerStyle={styles.searchResultsList}
                  />
                </>
              )}
              {filteredCategories.length > 0 && (
                 <>
                  <Text style={styles.sectionTitle}>Matching Categories</Text>
                  <FlatList
                    data={filteredCategories}
                    renderItem={({ item }) => (
                      <View style={styles.categorySection}>
                        <Text style={styles.categoryTitle}>{item.category_name}</Text>
                        <FlatList
                          data={item.sub_categories}
                          keyExtractor={sub => sub.id.toString()}
                          renderItem={renderSubCategory}
                          scrollEnabled={false}
                        />
                      </View>
                    )}
                    keyExtractor={item => item.id.toString()}
                    scrollEnabled={false}
                    contentContainerStyle={styles.categoriesList}
                  />
                </>
              )}
            </ScrollView>
          ) : selectedCategory ? (
            <FlatList
              data={selectedCategory.sub_categories}
              renderItem={renderSubCategory}
              keyExtractor={item => item.id.toString()}
              contentContainerStyle={styles.subCategoriesList}
              showsVerticalScrollIndicator={false}
            />
          ) : (
            <FlatList
              data={filteredCategories}
              renderItem={renderMainCategory}
              keyExtractor={item => item.id.toString()}
              contentContainerStyle={styles.categoriesList}
              showsVerticalScrollIndicator={false}
            />
          )}
        </View>
      )}
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9FAFB' },
  figmaHeaderContainer: { backgroundColor: '#FFFFFF', paddingHorizontal: 16, paddingBottom: 15, borderBottomLeftRadius: 20, borderBottomRightRadius: 20, elevation: 4, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 10 },
  titleWrapper: { marginTop: 10, minHeight: 21, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 8 },
  reOrderTitle: { fontFamily: 'Rubik', fontWeight: '700', fontSize: 18, color: '#2D2D2D' },
  searchWrapper: { marginTop: 21, width: '100%', height: 56 },
  searchBarContainer: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    paddingHorizontal: 18, 
    width: '100%', 
    height: 56, 
    backgroundColor: '#FFFFFF', 
    borderRadius: 15,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
  },
  searchPlaceholderText: { flex: 1, fontFamily: 'Rubik', fontWeight: '500', fontSize: 16, color: '#666666', padding: 0 },
  categoriesList: { paddingHorizontal: 16, paddingBottom: 120, marginTop: 20 },
  subCategoriesList: { paddingHorizontal: 16, paddingBottom: 120, marginTop: 10, backgroundColor: '#FFFFFF', borderTopLeftRadius: 25, borderTopRightRadius: 25, minHeight: responsiveHeight(70) },
  mainCategoryCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 20,
    paddingHorizontal: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    marginBottom: 18,
    // Premium Shadow logic
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 15,
    marginHorizontal: 4, 
  },
  mainCategoryContent: { flexDirection: 'row', alignItems: 'center' },
  mainCategoryImage: { width: 56, height: 56, borderRadius: 28, backgroundColor: '#F3F4F6' },
  mainCategoryName: { marginLeft: 16, fontSize: 17, fontWeight: '700', color: '#1F2937', letterSpacing: 0.3 },
  
  subCategoryListItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
    marginHorizontal: 4,
  },
  subCategoryLeft: { flexDirection: 'row', alignItems: 'center' },
  subCategoryImage: { width: 50, height: 50, borderRadius: 12, backgroundColor: '#F9FAFB' },
  subCategoryName: { marginLeft: 14, fontSize: 16, fontWeight: '600', color: '#374151', textTransform: 'capitalize' },

  categorySection: { marginBottom: 30, backgroundColor: '#FFFFFF', borderRadius: 20, padding: 15, elevation: 4, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.05, shadowRadius: 10 },
  categoryTitle: { fontSize: 18, fontWeight: '800', color: '#111827', marginBottom: 15, borderLeftWidth: 4, borderLeftColor: commonStyles.btn2Color, paddingLeft: 10 },
  loaderContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F9FAFB' },
  searchResultsContainer: { flex: 1, marginTop: 10 },
  sectionTitle: { fontSize: 20, fontWeight: '700', color: '#1F2937', marginHorizontal: 16, marginBottom: 16 },
  searchResultItem: { flexDirection: 'row', alignItems: 'center', padding: 12, marginHorizontal: 16, marginBottom: 10, backgroundColor: '#fff', borderRadius: 12, elevation: 3, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 5 },
  searchResultImage: { height: 50, width: 50, borderRadius: 25 },
  searchResultTitle: { fontSize: 16, fontWeight: '600', color: '#313131' },
  searchResultSubtitle: { fontSize: 12, color: 'grey' }
});

export default CategoriesScreen;
