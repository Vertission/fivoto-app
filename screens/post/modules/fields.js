import React, { useContext } from 'react';
import { StyleSheet, View, Linking } from 'react-native';
import { Permissions } from 'react-native-unimodules';
import { useNavigation } from '@react-navigation/native';
import { gql, useQuery } from '@apollo/client';
import _ from 'lodash';

import {
  Container,
  Header,
  Button,
  Divider,
  Image,
  Tab,
  Indicator,
  CheckBox,
  Typography,
  Input,
  Picker,
  Radio,
  Modal,
  Icon,
  Snackbar,
  Toast,
} from '../../../library';

import { SIZE, COLOR } from '../../../library/Theme';
import { TYPOGRAPHY } from '../../../library/Theme/library';

import Phone from './phone';
import SortPhotos from './photos.sort';

import dash from '../../../utils/dash';

import ApolloScreenErrorHandler from '../../../service/apollo/errorHandler/screen';

import { Context, dispatch } from './context';

export default function PostModuleField() {
  const navigation = useNavigation();
  const context = useContext(Context);

  const { data: dataField, loading, error } = useQuery(gql`
    query {
      fields
    }
  `);

  if (loading) return <Indicator.Loading />;
  else if (error)
    return <ApolloScreenErrorHandler error={error} refetch={refetch} />;
  else {
    const data = {
      field:
        dataField.fields[context.category.item?.split(' ').join('_')] || {},
    };

    const fields = [];

    const inputTypeMapper = (type) => {
      if (type === 'number') return 'numeric';
      else return 'default';
    };

    const fieldKeys = Object.keys(data.field);
    dash.array_swap(fieldKeys, 2, 5);
    dash.array_swap(fieldKeys, 4, 5);
    dash.array_swap(fieldKeys, 2, 0);
    dash.array_swap(fieldKeys, 2, 1);

    fieldKeys.map((field) => {
      const Field = (field) => {
        const fieldProps = data.field[field];
        switch (field) {
          case 'title':
            /**
             * map title field
             */
            return fields.push(
              <Input
                key={'title'}
                label="Title"
                maxLength={50}
                value={context.title}
                onChangeText={(value) => dispatch('SET_TITLE', value)}
                helper="required*"
                placeholder="YOUR AD TITLE"
                labelStyle={{ fontSize: TYPOGRAPHY.variant.h5 }}
              />,
            );
          case 'price':
            /**
             * map price field with negotiable true and false
             */
            return fields.push(
              <React.Fragment key={'price'}>
                <Input
                  underlineColorAndroid="transparent"
                  onChangeText={(price) => dispatch('SET_PRICE', price)}
                  value={context.price}
                  keyboardType="numeric"
                  maxLength={21}
                  label="Price"
                  helper="required*"
                  placeholder="YOUR AD PRICE"
                  style={{ marginBottom: 0 }}
                  labelStyle={{ fontSize: TYPOGRAPHY.variant.h5 }}
                />

                {fieldProps.negotiable && (
                  <CheckBox
                    value={context.fields.negotiable}
                    onValueChange={(value) =>
                      dispatch('SET_FIELDS', { field: 'negotiable', value })
                    }
                    label="Negotiable"
                    style={{ container: SIZE.margin * 3 }}
                  />
                )}
              </React.Fragment>,
            );

          case 'description':
            /**
             * map description field
             */
            return fields.push(
              <React.Fragment key={'description'}>
                <Tab onPress={() => navigation.navigate('Description')}>
                  {context.description
                    ? _.truncate(context.description.replace(/\n/g, ' '), 10)
                    : 'Description'}
                </Tab>
              </React.Fragment>,
            );

          case 'subFields':
            /**
             * map sbu field
             */
            return fieldProps.map((field) => {
              switch (field.variant) {
                case 'select':
                  /**
                   * map sub field select
                   */

                  if (!context.fields[field.name]) {
                    dispatch('SET_FIELDS', {
                      field: field.name,
                      value: field.items[0],
                    });
                  }

                  return fields.push(
                    <Picker
                      key={field.name}
                      label={field.name}
                      pickers={field.items}
                      selectedValue={context.fields[field.name]}
                      onValueChange={(value) =>
                        dispatch('SET_FIELDS', {
                          field: field.name,
                          value,
                        })
                      }
                      labelStyle={{
                        fontSize: TYPOGRAPHY.variant.h5,
                        textTransform: 'capitalize',
                      }}
                    />,
                  );

                /**
                 * map sub field input
                 */
                case 'input':
                  return fields.push(
                    <Input
                      key={field.name}
                      label={field.name}
                      value={context.fields[field.name]}
                      underlineColorAndroid="transparent"
                      keyboardType={inputTypeMapper(field.type)}
                      onChangeText={(value) =>
                        dispatch('SET_FIELDS', {
                          field: field.name,
                          value,
                        })
                      }
                      labelStyle={{
                        fontSize: TYPOGRAPHY.variant.h5,
                        textTransform: 'capitalize',
                      }}
                    />,
                  );
                /**
                 * map sub field inputSelect TEST:
                 */
                case 'inputSelect':
                  return fields.push(
                    <React.Fragment key={field.name}>
                      <Typography variant="h5" transform="capitalize">
                        {field.name}
                      </Typography>
                      <View
                        style={{
                          flexDirection: 'row',
                          width: '100%',
                          marginTop: SIZE.margin * 0.5,
                        }}>
                        <Input
                          underlineColorAndroid="transparent"
                          onChangeText={(value) =>
                            dispatch('SET_FIELDS', {
                              field: field.name,
                              value: {
                                value,
                                key:
                                  context.fields[field.name]?.key ||
                                  field.items[0],
                              },
                            })
                          }
                          value={context.fields[field.name]?.value}
                          keyboardType={inputTypeMapper(field.type)}
                          inputContainerStyle={{
                            marginBottom: 0,
                            marginTop: 0,
                            width: '50%',
                          }}
                          style={{
                            borderTopRightRadius: 0,
                            borderBottomRightRadius: 0,
                          }}
                        />
                        <Picker
                          pickers={field.items}
                          selectedValue={context.fields[field.name]?.key}
                          onValueChange={(value) =>
                            dispatch('SET_FIELDS', {
                              field: field.name,
                              value: {
                                key: value,
                                value: context.fields[field.name]?.value,
                              },
                            })
                          }
                          style={{
                            borderBottomLeftRadius: 0,
                            borderTopLeftRadius: 0,
                            width: '50%',
                          }}
                        />
                      </View>
                    </React.Fragment>,
                  );
                default:
                  return null;
              }
            });
          /**
           * display phone
           */
          case 'phone':
            return fields.push(
              <Phone
                key={'phone'}
                maxLength={fieldProps.maxLength}
                maxPhone={fieldProps.maxPhone}
              />,
            );
          /**
           * display image drop zone
           */
          case 'photo':
            /**
             * library and camera requesting logic
             */
            const _onPressPhotos = async () => {
              const CAM_ROLL = await Permissions.askAsync(
                Permissions.MEDIA_LIBRARY,
              );
              const CAM = await Permissions.askAsync(Permissions.CAMERA);

              if (!CAM_ROLL.granted)
                Snackbar.show('Please Allow permission for library');
              if (!CAM.granted)
                Snackbar.show('Please Allow permission for camera');

              const CAMERA_ROLL_PERMISSION = await Permissions.getAsync(
                Permissions.MEDIA_LIBRARY,
              );

              if (!CAMERA_ROLL_PERMISSION.canAskAgain) {
                Modal.show({
                  title: 'Storage Permission Required',
                  description:
                    'Fivoto requires permission to access your storage in order to add photos to the ad, You could allow storage permission by opening the app settings.',
                  actions: [
                    {
                      title: 'open settings',
                      onPress: () => Linking.openSettings(),
                    },
                  ],
                });
              }

              const CAMERA_PERMISSION = await Permissions.getAsync(
                Permissions.CAMERA,
              );
              if (!CAMERA_PERMISSION.canAskAgain) {
                Modal.show({
                  title: 'Camera Permission Required',
                  description:
                    'Fivoto requires permission to access your camera in order to add photos to the ad, You could allow camera permission by opening the app settings.',
                  actions: [
                    {
                      title: 'open settings',
                      onPress: () => Linking.openSettings(),
                    },
                  ],
                });
              }

              if (CAMERA_ROLL_PERMISSION.granted && CAMERA_PERMISSION.granted) {
                navigation.navigate('Photos');
              }
            };

            return fields.push(
              <React.Fragment key={'photos'}>
                <View style={styles.selection}>
                  <Icon name="photos" style={{ width: SIZE.BASE * 2 }} />
                  <Typography color={COLOR.MUTED}>Photos</Typography>
                </View>
                <Tab onPress={_onPressPhotos}>select photos</Tab>
                <SortPhotos />
                <Divider />
              </React.Fragment>,
            );
        }
      };

      return Field(field);
    });

    return <View>{fields}</View>;
  }
}

const styles = StyleSheet.create({
  selection: {
    alignItems: 'center',
    flexDirection: 'row',
  },
});
