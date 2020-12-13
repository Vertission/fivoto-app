import React, { useState } from 'react';
import { FlatList } from 'react-native';
import _ from 'lodash';
import analytics from '@react-native-firebase/analytics';

import { Indicator, Tab, Header } from '../../library';
import styles from '../../library/Theme/styles';

import { useQueryCategories } from '../../service/apollo/query/utils';

import { dispatch } from './modules/context';

import ApolloScreenErrorHandler from '../../service/apollo/errorHandler/screen';

export default function Category({ navigation }) {
  const [categories, { loading, refetch, error }] = useQueryCategories();
  const [category, setCategory] = useState(null);

  const RenderCategory = ({ item }) => {
    const _onPress = () => {
      if (item.category.includes('all')) {
        dispatch('SET_CATEGORY', {});
        navigation.navigate('Search');
      } else setCategory(item.category);
    };

    return <Tab onPress={_onPress}>{item.category}</Tab>;
  };

  const categoryItems = _.find(categories, { category })?.items;

  const RenderCategoryItems = ({ item }) => {
    const _onPress = async () => {
      if (item.includes('all')) {
        dispatch('SET_CATEGORY', { field: category, item: null });

        await analytics().logSelectContent({
          content_type: 'category',
          item_id: category,
        }); // ANALYTIC
      } else {
        dispatch('SET_CATEGORY', { field: category, item });

        await analytics().logSelectContent({
          content_type: 'category',
          item_id: item,
        }); // ANALYTIC
      }
      navigation.navigate('Search');
    };

    return <Tab onPress={_onPress}>{item}</Tab>;
  };

  if (loading) return <Indicator.Loading />;
  else if (error)
    return (
      <React.Fragment>
        <Header />
        <ApolloScreenErrorHandler refetch={refetch} error={error} />
      </React.Fragment>
    );
  return (
    <React.Fragment>
      <Header
        title="select category"
        onPress={() =>
          category ? setCategory(null) : navigation.navigate('Search')
        }
      />
      <FlatList
        style={styles.container}
        data={
          category
            ? [`all ${category}`, ...categoryItems]
            : [{ category: 'all category' }, ...categories]
        }
        renderItem={category ? RenderCategoryItems : RenderCategory}
        keyExtractor={(item) => (category ? item : item.category)}
      />
    </React.Fragment>
  );
}
