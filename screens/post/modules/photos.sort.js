import React, { useContext } from 'react';
import { StyleSheet, View, TouchableOpacity, Image } from 'react-native';
import DraggableFlatList from 'react-native-draggable-flatlist';
import _ from 'lodash';

import { dispatch, Context } from './context';

import { Typography, Icon, Modal } from '../../../../library';
import { SIZE, COLOR } from '../../../../library/Theme';

export default function SortPhotos() {
  const { photos, removePhotos } = useContext(Context);

  const RenderPhoto = ({ item, index, drag, isActive }) => {
    const photoUri = Object.keys(item)[0];
    const { source } = Object.values(item)[0];

    const onRemove = () => {
      Modal.show({
        title: 'Remove image',
        description: 'Do you want to remove this image from your ad?',
        actions: [
          {
            title: 'Yes, Remove',
            onPress: () => {
              dispatch(
                'SET_PHOTOS',
                _.remove(photos, (e) => e !== item),
              );

              if (source === 'CLOUD') {
                dispatch('SET_REMOVE_PHOTOS', [...removePhotos, photoUri]);
              }
            },
          },
        ],
      });
    };

    return (
      <TouchableOpacity onLongPress={drag} key={index}>
        <Icon
          name="move"
          size={SIZE.icon * 1.5}
          style={[s.dragIcon, { zIndex: isActive ? 11 : 0 }]}
        />
        <Icon
          name="remove-circle"
          family="AntDesign"
          size={SIZE.icon * 1.2}
          style={s.removeIcon}
          color={COLOR.ERROR}
          touch
          onPress={onRemove}
        />
        <Image source={{ uri: photoUri }} style={s.image} />
      </TouchableOpacity>
    );
  };

  const _onDragEnd = ({ data }) => {
    dispatch('SET_PHOTOS', data);
  };

  return (
    <View>
      <View style={s.draggableContainer}>
        <View
          style={[s.guide, { display: _.isEmpty(photos) ? 'flex' : 'none' }]}>
          <Typography variant="caption" color={COLOR.MUTED}>
            {'\u2B24'} use original photos
          </Typography>
          <Typography variant="caption" color={COLOR.MUTED}>
            {'\u2B24'} don't use watermarked photos
          </Typography>
        </View>
        <DraggableFlatList
          data={photos}
          renderItem={RenderPhoto}
          keyExtractor={(item) => Object.keys(item)[0]}
          onDragEnd={_onDragEnd}
          horizontal
        />
      </View>
      <Typography variant="caption" align="center" color={COLOR.MUTED}>
        hold & drag photo to move
      </Typography>
    </View>
  );
}

const s = StyleSheet.create({
  dragIcon: {
    alignItems: 'center',
    bottom: 0,
    justifyContent: 'center',
    left: 0,
    position: 'absolute',
    right: 0,
    top: 0,
  },
  draggableContainer: {
    height: 130,
  },
  guide: {
    alignItems: 'center',
    height: '100%',
    justifyContent: 'center',
    position: 'relative',
  },
  image: {
    height: 120,
    margin: SIZE.margin / 2,
    width: 120,
  },
  removeIcon: {
    margin: SIZE.margin,
    position: 'absolute',
    right: 0,
    top: -3,
    zIndex: 11,
  },
});
