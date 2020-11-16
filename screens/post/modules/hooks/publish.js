import React, { useState, useRef, useContext } from 'react';
import { StyleSheet } from 'react-native';
import analytics from '@react-native-firebase/analytics';
import { useMutation, gql } from '@apollo/client';
import RootSiblings from 'react-native-root-siblings';
import { Modalize } from 'react-native-modalize';
import * as Sentry from '@sentry/react-native';
import _ from 'lodash';

import uploadPhotos from '../../../../../api/ad/uploadPhotos';

import { dispatch, Context } from '../context';

import MutationSuccess from '../mutationSuccess';

import handleApolloError from '../../../../../setup/apollo/handleError';

const CREATE_AD = gql`
  mutation createAd($data: createAdInput!) {
    createAd(data: $data)
  }
`;

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
      updatedA
      user {
        id
        # name
      }
    }
  }
`;

const QUERY_ME_UPDATE_ADS = gql`
  query me {
    me {
      id
      publishedAds {
        id
        title
        photos
        price
        createdAt
      }
    }
  }
`;

export default function usePublishMutation(navigation) {
  const modalizeRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(null);

  const logData = useContext(Context);

  const [mutateCreateAd, createAdMutationResponse] = useMutation(CREATE_AD, {
    onError(error) {
      handleApolloError(error, logData, 'publishing your ad', navigation);

      Sentry.withScope(function (scope) {
        scope.setTag('func', 'usePublishMutation:mutateCreateAd');
        scope.setLevel(Sentry.Severity.Fatal);
        scope.setContext('data', { data: JSON.stringify(logData) });
        Sentry.captureException(error);
      });
    },
  });

  const [mutateUpdateAd, updateAdMutationResponse] = useMutation(UPDATE_AD, {
    onError(error) {
      handleApolloError(
        error,
        logData,
        'updating your ad photos. But you are able to update your ad photos by editing your ad',
        navigation,
      );

      Sentry.withScope(function (scope) {
        scope.setTag('func', 'usePublishMutation:mutateUpdateAd');
        scope.setLevel(Sentry.Severity.Fatal);
        scope.setContext('data', { data: JSON.stringify(logData) });
        Sentry.captureException(error);
      });
    },
  });

  async function publish(data) {
    setLoading(true);
    try {
      const publishingDate = new Date().toISOString();

      setStatus('start publishing ad');
      const {
        data: { createAd },
      } = await mutateCreateAd({
        variables: {
          data: {
            type: 'SELL',
            category: data.category,
            location: data.location,
            title: data.title.trim(),
            price: _.toNumber(_.replace(data.price, ',', '')), // 5,000 => 5000
            description: data.description.trim(),
            phone: data.phone,
            fields: _.mapValues(data.fields, (value) => {
              if (typeof value === 'string') return value.trim();
              else return value;
            }),
            createdAt: publishingDate,
          },
        },
      });

      // eslint-disable-next-line no-new
      new RootSiblings(
        (
          <Modalize
            ref={modalizeRef}
            adjustToContentHeight
            closeAnimationConfig={{ timing: { duration: 500 } }}
            modalStyle={s.modalize}>
            <MutationSuccess
              id={createAd}
              action="published"
              navigation={navigation}
              modalizeRef={modalizeRef}
            />
          </Modalize>
        ),
      );

      const uploadedPhotosKeys = await uploadPhotos(
        data.photos,
        createAd,
        setStatus,
      );

      setStatus('publishing ad');
      await mutateUpdateAd({
        variables: {
          data: {
            id: createAd,
            photos: uploadedPhotosKeys,
            updatedAt: publishingDate,
          },
        },
        refetchQueries: [{ query: QUERY_ME_UPDATE_ADS }],
      });

      await analytics().logEvent('post_ad', {
        category: data.category,
        location: data.location,
      }); // ANALYTIC

      setLoading(false);
      setStatus(null);

      dispatch('RESET_CONTEXT');

      if (createAdMutationResponse.error || updateAdMutationResponse.error) {
      } else modalizeRef.current?.open();

      navigation.navigate('Post');

      return null;
    } catch (error) {
      setLoading(false);
      Sentry.withScope(function (scope) {
        scope.setTag('func', 'usePublishMutation');
        scope.setLevel(Sentry.Severity.Fatal);
        scope.setContext('data', { data: JSON.stringify(data) });
        Sentry.captureException(error);
      });
    }
  }

  return [publish, { loading, status }];
}

const s = StyleSheet.create({
  modalize: {
    borderTopEndRadius: 0,
    borderTopStartRadius: 0,
  },
});
