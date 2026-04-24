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
import { getAllCategories, setActiveCategoryIndex, setsubCategory } from '../../redux/reducers/daddy';
import { useDispatch, useSelector } from 'react-redux';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { globalSearch } from '../../redux/reducers/addressSlice';
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';
import commonStyles from '../../commonstyles/CommonStyles';
import StatusBarManager from '../../components/StatusBarManager';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const CategoriesScreen = ({ navigation, route }) => {
  const { allCategories } = useSelector(state => state.Dashboard);
  const [categories, setCategories] = useState([]);
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
      await dispatch(getAllCategories());
      setLoading(false);
    };
    fetchCategories();
  }, [dispatch]);

  useEffect(() => {
    if (!allCategories) return;
    const groupedData = allCategories.reduce((acc, item) => {
      const { category_id, category_name, ...subCategory } = item;
      if (!acc[category_id]) {
        acc[category_id] = {
          category_id,
          category_name,
          sub_categories: []
        };
      }
      acc[category_id].sub_categories.push(subCategory);
      return acc;
    }, {});
    const result = Object.values(groupedData);
    setCategories(result);
    setFilteredCategories(result);
  }, [allCategories]);

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

    const localFiltered = route.params?.isFromHome
      ? []
      : categories.map(category => {
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
        category_id: `search-${result.search_id}`,
        category_name: 'Search Results',
        sub_categories: [{
          id: result.search_id,
          sub_category_name: result.search_text,
          sub_category_image: result.search_image
        }]
      }));

    const combinedResults = [...localFiltered, ...apiResults];
    const uniqueResults = combinedResults.filter((v, i, a) =>
      a.findIndex(t => t.category_id === v.category_id) === i
    );

    setFilteredCategories(uniqueResults);
  }, [searchQuery, categories, globalSearchResults]);

  const handleNavigation = async (item, subItem) => {
    Keyboard.dismiss();
    await dispatch(setActiveCategoryIndex(item.category_id));
    dispatch(setsubCategory(subItem));
    navigation.navigate('CategorieItems');
  };

  const handleSearchResultPress = (result) => {
    Keyboard.dismiss();
    if (result.search_type == 2) {
      navigation.navigate('BannerRestaurantScreen', { ...result, fromSearch: true });
    } else {
      navigation.navigate('SearchShopList', result);
    }
  };

  const renderCategory = ({ item }) => (
    <View style={styles.categorySection}>
      <Text style={styles.categoryTitle}>{item.category_name}</Text>
      <FlatList
        data={item.sub_categories}
        keyExtractor={sub => sub.id.toString()}
        numColumns={3}
        columnWrapperStyle={styles.itemsGrid}
        scrollEnabled={false}
        renderItem={({ item: subItem }) => (
          <TouchableOpacity onPress={() => handleNavigation(item, subItem)} style={styles.itemContainer}>
            <View style={styles.itemCard}>
              <Image source={{ uri: subItem.sub_category_image }} resizeMode='stretch' style={styles.itemImage} />
            </View>
            <Text numberOfLines={1} style={styles.itemName}>{subItem.sub_category_name}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );

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
            {route.params?.isFromHome ? (
              <TouchableOpacity onPress={() => navigation.goBack()} style={{ marginRight: 10 }}>
                <FontAwesome6 name="arrow-left-long" size={20} color="#2D2D2D" />
              </TouchableOpacity>
            ) : (
              <CategoryInactive color="#2D2D2D" style={{ marginRight: 10 }} />
            )}
            <Text style={styles.reOrderTitle}>All Categories</Text>
          </View>
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
                    renderItem={renderCategory}
                    keyExtractor={item => item.category_id.toString()}
                    scrollEnabled={false}
                    contentContainerStyle={styles.categoriesList}
                  />
                </>
              )}
            </ScrollView>
          ) : (
            <FlatList
              data={filteredCategories}
              renderItem={renderCategory}
              keyExtractor={item => item.category_id.toString()}
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
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  figmaHeaderContainer: { backgroundColor: '#FFFFFF', paddingHorizontal: 16, paddingBottom: 15 },
  titleWrapper: { marginTop: 10, height: 21, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 8 },
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
    borderWidth: 0.5, 
    borderColor: '#A3A3A3', 
    borderRadius: 15 
  },
  searchPlaceholderText: { flex: 1, fontFamily: 'Rubik', fontWeight: '500', fontSize: 16, color: '#666666', padding: 0 },
  categoriesList: { paddingHorizontal: 16, paddingBottom: 100, marginTop: 20 },
  categorySection: { marginBottom: 20 },
  categoryTitle: { fontSize: 18, fontWeight: '700', color: '#1F2937', marginBottom: 10 },
  itemsGrid: { justifyContent: 'flex-start', gap: responsiveWidth(4) },
  itemContainer: { width: responsiveWidth(28), marginBottom: 15 },
  itemCard: { width: '100%', height: responsiveHeight(12), borderRadius: 8, backgroundColor: '#f9f9f9', overflow: 'hidden' },
  itemImage: { width: '100%', height: '100%' },
  itemName: { fontSize: 12, fontWeight: '500', color: '#313131', textAlign: 'center', marginTop: 5, textTransform: 'capitalize' },
  loaderContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  searchResultsContainer: { flex: 1, marginTop: 10 },
  sectionTitle: { fontSize: 20, fontWeight: '700', color: '#1F2937', marginHorizontal: 16, marginBottom: 16 },
  searchResultItem: { flexDirection: 'row', alignItems: 'center', padding: 12, marginHorizontal: 16, marginBottom: 10, backgroundColor: '#fff', borderRadius: 12 },
  searchResultImage: { height: 50, width: 50, borderRadius: 25 },
  searchResultTitle: { fontSize: 16, fontWeight: '600', color: '#313131' },
  searchResultSubtitle: { fontSize: 12, color: 'grey' }
});

export default CategoriesScreen;