import React, { useContext, useRef, useState } from 'react';
import { StyleSheet, View, TouchableNativeFeedback } from 'react-native';
import { Modalize } from 'react-native-modalize';
import _ from 'lodash';

import { dispatch, Context } from './modules/context';

import {
  Container,
  Typography,
  Header,
  Button,
  Image,
  Indicator,
} from '../../library';
import { SIZE, COLOR } from '../../library/Theme';

import { useQueryCategories } from '../../setup/apollo/query/utils';

import ApolloScreenErrorHandler from '../../setup/apollo/errorHandler/screen';

export default function Category({ navigation, route }) {
  const modalizeRef = useRef(null);
  const { category: contextCategory } = useContext(Context);
  const [categories, { loading, error, refetch }] = useQueryCategories();
  const [categoryField, setCategoryField] = useState(null);
  const [categoryItems, setCategoryItems] = useState([]);

  const _onSelect = async (category) => {
    if (!_.isEqual(contextCategory, category)) dispatch('RESET_FIELDS'); // reset fields when category changes
    dispatch('SET_CATEGORY', category);
    route.params?.toForm
      ? navigation.navigate('Form')
      : navigation.navigate('Location');
  };

  const _onPressHeader = () => {
    route.params?.toForm ? navigation.navigate('Form') : navigation.goBack();
  };

  const _onSelectCategory = ({ items, category }) => {
    setCategoryField(category);
    setCategoryItems(items);
    modalizeRef.current?.open();
  };

  const RenderItem = ({ item }) => {
    const onPress = async () => {
      // modalizeRef.current?.close();
      _onSelect({ field: categoryField, item });
    };

    return (
      <Button onPress={onPress} textProps={{ transform: 'capitalize' }}>
        {item}
      </Button>
    );
  };

  if (loading) return <Indicator.Loading />;
  else if (error)
    return <ApolloScreenErrorHandler error={error} refetch={refetch} />;
  else
    return (
      <React.Fragment>
        <Header title="select category" onPress={_onPressHeader} />
        <Container style={{ alignItems: 'center', justifyContent: 'center' }}>
          <View style={s.categories}>
            {categories.map(({ category, image, items }) => (
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
        </Container>
        {/* CATEGORY ITEMS  */}
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

const WIDTH = SIZE.width / 3 - SIZE.BASE,
  HEIGHT = SIZE.height / 4 - SIZE.BASE * 3;

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
    elevation: SIZE.elevation,
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
  modalize: {
    borderTopEndRadius: 0,
    borderTopStartRadius: 0,
  },
  name: {
    marginTop: SIZE.margin / 2,
  },
});
