import React, { useState, useRef, useContext } from 'react';
import { StyleSheet } from 'react-native';
import { useMutation, gql } from '@apollo/client';
import RootSiblings from 'react-native-root-siblings';
import { Modalize } from 'react-native-modalize';
import analytics from '@react-native-firebase/analytics';
import * as Sentry from '@sentry/react-native';
import _ from 'lodash';

import uploadPhotos from '../../../../service/amplify/storage/uploadAdPhotos';

import { dispatch, Context } from '../context';

import MutationSuccess from '../mutationSuccess';

import ApolloModalErrorHandler from '../../../../service/apollo/errorHandler/modal';

const UPDATE_AD = gql`
  mutation updateAd($data: updateAdInput!) {
    updateAd(data: $data) {
      id
      type
      category {
        field
        item
      }
      location {
        district
        city
      }
      title
      price
      description
      photos
      phone
      fields
      updatedAt
    }
  }
`;

export default function useUpdateMutation(navigation) {
  const modalizeRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(null);

  const logData = useContext(Context);

  const [mutateUpdateAd, mutationResponse] = useMutation(UPDATE_AD, {
    onError(error) {
      ApolloModalErrorHandler(error, logData, 'updating your ad', navigation);

      Sentry.withScope(function (scope) {
        scope.setTag('func', 'usePublishMutation:mutateUpdateAd');
        scope.setLevel(Sentry.Severity.Fatal);
        scope.setContext('data', { data: JSON.stringify(logData) });
        Sentry.captureException(error);
      });
    },
  });

  async function update(data) {
    setLoading(true);
    try {
      setStatus('start updating ad');

      // eslint-disable-next-line no-new
      new RootSiblings(
        (
          <Modalize
            ref={modalizeRef}
            adjustToContentHeight
            closeAnimationConfig={{ timing: { duration: 500 } }}
            modalStyle={s.modalize}>
            <MutationSuccess
              id={data.id}
              action="updated"
              navigation={navigation}
              modalizeRef={modalizeRef}
            />
          </Modalize>
        ),
      );

      const uploadedPhotosKeys = await uploadPhotos(
        data.photos,
        data.id,
        setStatus,
      );

      setStatus('updating ad');
      await mutateUpdateAd({
        variables: {
          data: {
            id: data.id,
            category: { field: data.category.field, item: data.category.item },
            location: {
              district: data.location.district,
              city: data.location.city,
            },
            title: data.title.trim(),
            price: _.toNumber(
              _.replace(_.replace(data.price, /,/g, ''), 'LKR ', ''),
            ), // LKR 5,000 => 5000
            description: data.description.trim(),
            phone: data.phone,
            fields: _.mapValues(data.fields, (value) => {
              if (typeof value === 'string') return value.trim();
              else return value;
            }),
            photos: uploadedPhotosKeys,
            removePhotos: data.removePhotos,
            updatedAt: new Date().toISOString(),
          },
        },
      });

      await analytics().logEvent('update_ad', {
        category: data.category,
        location: data.location,
      }); // ANALYTIC

      setLoading(false);
      setStatus(null);

      dispatch('RESET_CONTEXT');

      if (mutationResponse.error) {
      } else modalizeRef.current?.open();

      return navigation.navigate('Post');
    } catch (error) {
      setLoading(false);
      Sentry.withScope(function (scope) {
        scope.setTag('func', 'useUpdateMutation');
        scope.setLevel(Sentry.Severity.Fatal);
        scope.setContext('data', { data: JSON.stringify(data) });
        Sentry.captureException(error);
      });
    }
  }

  return [update, { loading, status }];
}

const s = StyleSheet.create({
  modalize: {
    borderTopEndRadius: 0,
    borderTopStartRadius: 0,
  },
});
