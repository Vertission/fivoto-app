import React, { useContext } from 'react';
import { View } from 'react-native';
import { gql, useQuery } from '@apollo/client';

import {
  Container,
  Header,
  Button,
  Image,
  Indicator,
  CheckBox,
  Typography,
  Input,
  Picker,
  Radio,
} from '../../../library';

import { SIZE, COLOR } from '../../../library/Theme';
import { TYPOGRAPHY } from '../../../library/Theme/library';

import ApolloScreenErrorHandler from '../../../service/apollo/errorHandler/screen';

import { Context, dispatch } from './context';

export default function PostModuleField() {
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

    Object.keys(data.field).map((field) => {
      const Field = (field) => {
        const fieldProps = data.field[field];
        switch (field) {
          case 'title':
            /**
             * map title field
             */
            return fields.push(
              <Input
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
              <React.Fragment>
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
                  return fields.push(
                    <Picker
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
                    <React.Fragment>
                      <Typography style={styles.label}>{field.name}</Typography>
                      <View
                        style={{
                          flexDirection: 'row',
                          width: '100%',
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
                          keyboardType={field.type}
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
                /**
                 * map sub field inputSelect
                 */
                case 'radio':
                  const data = field.options.map((ele) => ({
                    label: ele,
                  }));

                  return fields.push(
                    <Radio
                      data={data}
                      label={field.name}
                      initial={
                        field.options.indexOf(context.fields[field.name]) + 1
                      }
                      selectedItem={(item) =>
                        dispatch('SET_FIELDS', {
                          field: field.name,
                          value: item.label,
                        })
                      }
                    />,
                  );
                default:
                  return null;
              }
            });
          // /**
          //  * display phone
          //  */
          // case 'phone':
          //   return fields.push(
          //     <Phone
          //       maxLength={fieldProps.maxLength}
          //       maxPhone={fieldProps.maxPhone}
          //     />,
          //   );
          // /**
          //  * display image drop zone
          //  */
          // case 'photo':
          //   return fields.push(<Photos maxFiles={fieldProps.max} />);
        }
      };

      return Field(field);
    });

    return <View>{fields}</View>;
  }
}
