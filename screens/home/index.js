import React, { useRef, useState } from 'react';
import {
  StyleSheet,
  View,
  ScrollView,
  TouchableNativeFeedback,
} from 'react-native';
import SyncStorage from 'sync-storage';
import { Modalize } from 'react-native-modalize';

import {
  Header,
  Icon,
  Typography,
  Image,
  Button,
  Toast,
  Indicator,
} from '../../library';
import { SIZE, COLOR } from '../../library/Theme';

import { useQueryCategories } from '../../service/apollo/query/utils';

import { dispatch } from '../post/modules/context';
import { dispatch as searchDispatch } from '../search/modules/context';

import ApolloScreenErrorHandler from '../../service/apollo/errorHandler/screen';

export default function Home({ navigation }) {
  const modalizeRef = useRef(null);
  const [categoryField, setCategoryField] = useState(null);
  const [categoryItems, setCategoryItems] = useState([]);

  const [categories, { loading, error, refetch }] = useQueryCategories();

  const _onSelectCategory = ({ items, category }) => {
    setCategoryField(category);
    setCategoryItems(items);
    modalizeRef.current?.open();
  };

  const _onPressPostAd = () => {
    if (!SyncStorage.get('@sign')) {
      Toast({ message: 'Please sign to publish your ads' });
      return navigation.navigate('Account', { screen: 'Login' });
    } else {
      dispatch('RESET_CONTEXT');
      return navigation.navigate('Post', { screen: 'Category' });
    }
  };

  const RenderItem = ({ item }) => {
    const onPress = async () => {
      modalizeRef.current?.close();
      searchDispatch('SET_CATEGORY', { field: categoryField, item });
      navigation.navigate('Search', { screen: 'Search' });
    };

    return (
      <Button onPress={onPress} textProps={{ transform: 'capitalize' }}>
        {item}
      </Button>
    );
  };

  const HomeHeader = (
    <Header
      backSpace={false}
      startContent={
        <Icon
          name="menu"
          size={SIZE.icon * 1.5}
          touch
          onPress={navigation.toggleDrawer}
        />
      }
    />
  );

  if (loading) return <Indicator.Loading />;
  else if (error)
    return (
      <React.Fragment>
        {HomeHeader}
        <ApolloScreenErrorHandler
          error={error}
          refetch={refetch}
          navigateReport={() =>
            navigation.navigate('ReportIssue', { error: JSON.stringify(error) })
          }
        />
      </React.Fragment>
    );
  return (
    <React.Fragment>
      {HomeHeader}

      <ScrollView style={s.scrollView} showsVerticalScrollIndicator={false}>
        {/* CATEGORY LIST  */}
        <View style={s.categories}>
          {categories.map(({ category, items, image }) => (
            <TouchableNativeFeedback
              key={category}
              activeOpacity={0.5}
              onPress={() => _onSelectCategory({ category, items })}>
              <View style={s.category}>
                <View>
                  <Image url={image} style={s.image} />
                </View>
                <Typography
                  variant="caption"
                  transform="capitalize"
                  align="center"
                  style={s.name}>
                  {category}
                </Typography>
              </View>
            </TouchableNativeFeedback>
          ))}
        </View>

        <View style={s.postAdvert}>
          <Typography
            color={COLOR.MUTED}
            variant="caption"
            align="center"
            transform="uppercase">
            start posting your ads now!
          </Typography>
          <Button variant="contained" large onPress={_onPressPostAd}>
            post my ad
          </Button>
        </View>
      </ScrollView>

      <Modalize
        ref={modalizeRef}
        adjustToContentHeight
        modalStyle={s.modalize}
        closeAnimationConfig={{ timing: { duration: 500 } }}
        flatListProps={{
          data: categoryItems,
          renderItem: RenderItem,
          keyExtractor: (item) => item,
          contentContainerStyle: {
            padding: SIZE.padding,
          },
        }}
      />
    </React.Fragment>
  );
}

const WIDTH = SIZE.width / 3 - SIZE.BASE / 2,
  HEIGHT = SIZE.height / 4 - SIZE.BASE * 2.5;

const s = StyleSheet.create({
  categories: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  category: {
    alignItems: 'center',
    backgroundColor: COLOR.WHITE,
    borderRadius: SIZE.radius,
    height: HEIGHT - SIZE.margin * 1.5,
    justifyContent: 'center',
    marginVertical: SIZE.margin,
    padding: SIZE.padding / 4,
    width: WIDTH - SIZE.margin,
  },
  image: {
    height: WIDTH / 2.5,
    width: WIDTH / 2.5,
  },
  postAdvert: {
    marginVertical: SIZE.margin,
  },
  scrollView: {
    margin: SIZE.margin,
  },
  modalize: {
    borderTopEndRadius: 0,
    borderTopStartRadius: 0,
  },
});
