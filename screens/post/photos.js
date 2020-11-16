import React, {
  useEffect,
  useState,
  useRef,
  useCallback,
  useContext,
} from 'react';
import {
  FlatList,
  Image,
  StyleSheet,
  View,
  TouchableOpacity,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import * as MediaLibrary from 'expo-media-library';
import * as ImagePicker from 'expo-image-picker';
import { Modalize } from 'react-native-modalize';
import * as Sentry from '@sentry/react-native';
import _ from 'lodash';

import { Header, Icon, Typography, Button, Toast } from '../../../library';
import { COLOR, SIZE } from '../../../library/Theme';
import { TYPOGRAPHY } from '../../../library/Theme/library';
import themeStyles from '../../../library/Theme/styles';

const previewImageScale = SIZE.width / 4 - (SIZE.margin + SIZE.margin / 5);
const offSet = Math.round((SIZE.height / previewImageScale) * 3);

import { dispatch, Context } from './modules/context';

const LibraryImage = React.memo(
  ({ item, isSelected, selectPhoto, photosLength }) => {
    const _onPressPhoto = () => {
      if (isSelected === null) return;
      selectPhoto({
        item: { uri: item.uri, width: item.width, height: item.height },
        photosLength,
      });
    };

    return (
      <TouchableOpacity onPress={_onPressPhoto}>
        <Icon
          name="checkmark-circle"
          size={SIZE.icon}
          style={styles.selectedIcon}
          color={COLOR.SUCCESS}
          hide={!isSelected}
        />
        <Image
          source={{
            uri: item.uri,
          }}
          style={styles.photo}
        />
        <Typography style={styles.previewImageScale}>
          {item.width}x{item.height}
        </Typography>
        {isSelected && <View style={styles.previewImageOverlay} />}
      </TouchableOpacity>
    );
  },
);

const CameraPhoto = ({ item, seTakenPhotos, takenPhotos }) => {
  const onRemove = () => {
    seTakenPhotos(_.remove(takenPhotos, (e) => e.uri !== item.uri));
  };

  return (
    <View>
      <Icon
        name="close-circle"
        family="AntDesign"
        size={SIZE.icon}
        style={styles.removeIcon}
        color={COLOR.ERROR}
        touch
        onPress={onRemove}
      />
      <Image
        source={{
          uri: item.uri,
        }}
        style={styles.photo}
      />
      <Typography style={styles.previewImageScale}>
        {item.width}x{item.height}
      </Typography>
    </View>
  );
};

export default function Photos() {
  ////////////////////////////////////
  const { setTabBarVisible } = useContext(
    require('../../navigation/tabs/post').TabBarVisibleContext,
  );
  useFocusEffect(
    React.useCallback(() => setTabBarVisible(false), [setTabBarVisible]),
  );
  ////////////////////////////////////

  const contextPhotos = useContext(Context).photos;

  const albumModalizeRef = useRef(null);
  // all get assets[photos]
  const [assets, setAssets] = useState([]);
  const [totalAssets, setTotalAssets] = useState(0);
  const [endCursor, setEndCursor] = useState(0);

  // user albums list
  const [albums, setAlbums] = useState([]);
  // selected album
  const [selectedAlbum, setSelectedAlbum] = useState({});
  // assets selected photo
  const [selectedPhotos, setSelectPhotos] = useState({});
  // taken photo
  const [takenPhotos, seTakenPhotos] = useState([]);
  // cloud photos
  const [cloudPhotos, setCloudPhotos] = useState([]);

  /**
   * initialize context photos & get all albums from user
   */
  useEffect(() => {
    // initializing selected & taken photos holders[object(selectedPhoto), array(takenPhoto)]
    const contextSelectedPhotos = {};
    const contextCloudPhotos = {};
    const contextTakenPhotos = [];

    // mapping through context photos
    contextPhotos.forEach((photo) => {
      const key = Object.keys(photo)[0];
      const values = Object.values(photo)[0];

      if (values.source === 'CLOUD') {
        contextCloudPhotos[key] = values;
      }

      if (values.source === 'CAMERA') {
        contextTakenPhotos.push({ uri: key, ...values });
      }

      if (values.source === 'LIBRARY') {
        contextSelectedPhotos[key] = values;
      }
    });

    // setting initialized photos
    setSelectPhotos(contextSelectedPhotos);
    seTakenPhotos(contextTakenPhotos);
    setCloudPhotos(contextCloudPhotos);

    MediaLibrary.getAlbumsAsync().then((res) => {
      setAlbums(res);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /**
   * get all assets from user
   * @param {number} first assets offset
   */
  const _getAssetsAsync = (first) => {
    MediaLibrary.getAssetsAsync({
      first,
      sortBy: [MediaLibrary.SortBy.creationTime],
      mediaType: [MediaLibrary.MediaType.photo],
      album: selectedAlbum.id,
    }).then(({ assets, hasNextPage, endCursor, totalCount }) => {
      setAssets(assets);
      setTotalAssets(totalCount);
      if (hasNextPage) setEndCursor(Number(endCursor));
    });
  };

  /**
   * call _getAssetsAsync when user select a new album from album list
   */
  useEffect(() => {
    _getAssetsAsync(offSet);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedAlbum]);

  const _onEndReached = () => {
    if (assets.length === totalAssets) return null;
    _getAssetsAsync(endCursor + offSet);
  };

  /**
   * select & unselect assets list photos
   */
  const selectPhoto = useCallback(
    ({ item, photosLength }) => {
      setSelectPhotos((photos) => {
        const sel = { ...photos };
        if (sel.hasOwnProperty(item.uri)) {
          delete sel[item.uri];
        } else {
          if (photosLength === 5) {
            Toast({ message: 'maximum up to 5 photos' });
            return sel;
          }
          sel[item.uri] = {
            width: item.width,
            height: item.height,
            source: 'LIBRARY',
          };
        }
        return sel;
      });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [setSelectPhotos],
  );

  /**
   * select a album & clear assets, totalAssets and endCursor
   * @param {object} album [title, id]
   */
  const _onPressSelectAlbum = async (album) => {
    if (album.id === selectedAlbum.id) return albumModalizeRef.current?.close();
    setSelectedAlbum(album);
    setAssets([]);
    setTotalAssets(0);
    setEndCursor(0);
    albumModalizeRef.current?.close();
  };

  const totalSelectedLength =
    Object.keys(selectedPhotos).length +
    takenPhotos.length +
    Object.keys(cloudPhotos).length;

  // open camera and take a cute picture and push to takenPhotos
  const _launchCamera = () => {
    ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
    })
      .then((res) => {
        if (totalSelectedLength === 5) return null;
        seTakenPhotos([
          ...takenPhotos,
          {
            uri: res.uri,
            width: res.width,
            height: res.height,
            source: 'CAMERA',
          },
        ]);
      })
      .catch((error) => {
        Sentry.captureException(error);
      });
  };

  /**
   * updating context state.photos with [takenPhotos, selectedPhotos] based on [takenPhotos, selectedPhotos] state change
   */
  useEffect(() => {
    const takenPhotosObj = {};
    takenPhotos.forEach(({ uri, width, height, source }) => {
      takenPhotosObj[uri] = { width, height, source };
    });

    const mergeSelectAndTakenPhotos = _.merge(
      takenPhotosObj,
      selectedPhotos,
      cloudPhotos,
    );

    const mergedObjectToArray = Object.keys(mergeSelectAndTakenPhotos).map(
      (uri) => {
        return { [uri]: mergeSelectAndTakenPhotos[uri] };
      },
    );

    dispatch('SET_PHOTOS', mergedObjectToArray);
  }, [takenPhotos, selectedPhotos, cloudPhotos]);

  return (
    <React.Fragment>
      <Header
        title={
          totalSelectedLength === 5
            ? 'max up to 5'
            : `${totalSelectedLength} selected`
        }
        endContent={
          <Icon
            name="camera"
            size={SIZE.icon * 1.5}
            touch
            disabled={totalSelectedLength === 5}
            onPress={_launchCamera} // onPress this to launch camera
          />
        }
      />

      {/* CAMERA PHOTOS HOLDER  */}
      <View style={styles.cameraPhotoContainer}>
        <FlatList
          data={takenPhotos}
          renderItem={({ item }) => (
            <CameraPhoto
              item={item}
              seTakenPhotos={seTakenPhotos}
              takenPhotos={takenPhotos}
            />
          )}
          keyExtractor={({ uri }) => uri}
          horizontal
        />
      </View>

      {/* ASSETS PHOTO LIST  */}
      <View style={styles.container}>
        <Button
          small
          variant="contained"
          onPress={albumModalizeRef.current?.open}>
          {selectedAlbum.id ? selectedAlbum.title : 'all albums'}
        </Button>
        <FlatList
          data={assets}
          renderItem={({ item }) => (
            <LibraryImage
              key={item.uri}
              item={item}
              selectPhoto={selectPhoto}
              isSelected={selectedPhotos.hasOwnProperty(item.uri)}
              photosLength={totalSelectedLength}
            />
          )}
          keyExtractor={({ uri }) => uri}
          numColumns={4}
          onEndReached={_onEndReached}
        />
      </View>

      {/* ASSET COUNT  */}
      <View style={styles.listLibraryCount}>
        <Typography
          color={COLOR.WHITE}
          variant="caption"
          style={styles.listLibraryCountText}>
          {assets.length} / {totalAssets}
        </Typography>
      </View>

      {/* ALBUMS SHEET MODALIZE  */}
      <Modalize
        modalStyle={styles.modalizeModalStyle}
        childrenStyle={{ margin: SIZE.margin }}
        ref={albumModalizeRef}
        modalHeight={450}>
        {albums.map(({ title, id }) => (
          <Button key={id} onPress={() => _onPressSelectAlbum({ id, title })}>
            {title}
          </Button>
        ))}
        <Button onPress={() => _onPressSelectAlbum({ id: null })}>
          all albums
        </Button>
      </Modalize>
    </React.Fragment>
  );
}

const styles = StyleSheet.create({
  cameraPhotoContainer: {
    height: previewImageScale + SIZE.BASE,
    ...themeStyles.container,
  },
  container: {
    flex: 1,
    ...themeStyles.container,
  },
  listLibraryCount: {
    alignItems: 'center',
    bottom: SIZE.margin * 2,
    justifyContent: 'center',
    position: 'absolute',
    width: '100%',
  },
  listLibraryCountText: {
    backgroundColor: COLOR.FILL,
    borderRadius: SIZE.radius,
    padding: SIZE.padding / 2,
  },
  modalizeModalStyle: {
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
  },
  photo: {
    height: previewImageScale,
    margin: SIZE.margin / 5,
    width: previewImageScale,
  },
  previewImageOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: COLOR.FILL,
    margin: SIZE.margin / 5,
  },
  previewImageScale: {
    bottom: 0,
    color: COLOR.MUTED,
    fontSize: TYPOGRAPHY.variant.caption * 0.8,
    position: 'absolute',
    right: SIZE.margin / 2.5,
  },
  removeIcon: {
    margin: SIZE.margin / 2,
    position: 'absolute',
    right: 0,
    zIndex: 11,
  },
  selectedIcon: {
    alignItems: 'center',
    bottom: 0,
    justifyContent: 'center',
    left: 0,
    position: 'absolute',
    right: 0,
    top: 0,
    zIndex: 11,
  },
});
