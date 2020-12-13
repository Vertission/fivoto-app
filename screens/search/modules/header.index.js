import React, { useContext } from 'react';
import { View, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import _ from 'lodash';
import { Button, Input } from '../../../library';
import { SIZE, COLOR } from '../../../library/Theme';
import analytics from '@react-native-firebase/analytics';

import { dispatch, Context } from './context';

export default function Header({ search, setSearch, disabled }) {
  const { category, location } = useContext(Context);

  const navigation = useNavigation();

  const _onSearchQuery = async () => {
    dispatch('SET_QUERY', _.trim(search).toLocaleLowerCase());
    if (!_.isEmpty(search)) {
      await analytics().logSearch({ search_term: search }); // ANALYTIC
    }
  };

  const _onQueryFlush = () => {
    setSearch(null);
    dispatch('SET_QUERY', null);
  };

  const categoryText = category.item
    ? category.item
    : category.field
    ? category.field
    : 'category';

  const LocationText = location.city
    ? location.city
    : location.district
    ? location.district
    : 'location';

  return (
    <React.Fragment>
      <View style={styles.container}>
        <Input
          disabled={disabled}
          value={search}
          icon={_.isEmpty(search) ? 'search' : 'close-circle'}
          placeholder="search..."
          iconProps={{
            touch: true,
            onPress: _.isEmpty(search) ? _onSearchQuery : _onQueryFlush,
          }}
          returnKeyType="search"
          returnKeyLabel="search"
          style={{ marginBottom: SIZE.margin / 2 }}
          inputContainerStyle={{ marginTop: SIZE.margin }}
          onChangeText={setSearch}
          onSubmitEditing={_onSearchQuery}
        />
        <View style={styles.buttonContainer}>
          <Button
            disabled={disabled}
            onPress={() => navigation.navigate('Category')}
            small
            style={styles.button}
            icon="pricetag"
            variant="contained">
            {_.truncate(categoryText, {
              length: 10,
              separator: ' ',
            })}
          </Button>
          <Button
            disabled={disabled}
            onPress={() => navigation.navigate('Location')}
            small
            style={styles.button}
            icon="pin"
            variant="contained">
            {_.truncate(LocationText, {
              length: 10,
              separator: ' ',
            })}
          </Button>
        </View>
      </View>
    </React.Fragment>
  );
}

const styles = StyleSheet.create({
  button: {
    width: '49%',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  container: {
    backgroundColor: COLOR.WHITE,
    elevation: SIZE.elevation / 2,
    paddingHorizontal: SIZE.padding / 2,
  },
});
