import React, { useRef } from 'react';
import {
  StyleSheet,
  View,
  FlatList,
  Animated,
  TouchableWithoutFeedback,
} from 'react-native';
import Image from '../Image';

import { SIZE, COLOR } from '../Theme';

const { width: WIDTH, height: HEIGHT } = SIZE;

export default function Carousel(property) {
  let {
    data = [],
    width = WIDTH,
    height = HEIGHT / 3,
    imageProps = {},
    ...rest
  } = property;

  const flatListRef = useRef();
  const scrollX = new Animated.Value(0);
  let position = Animated.divide(scrollX, WIDTH);

  const imageContainerStyles = [styles.imageContainer, { width }, { height }];

  const imageStyles = [{ borderRadius: SIZE.radius }, imageProps.style];

  const RenderBullet = (
    <View style={styles.tb}>
      {data.map((_, i) => {
        let opacity = position.interpolate({
          inputRange: [i - 1, i, i + 1],
          outputRange: [0.3, 1, 0.3],
          extrapolate: 'clamp',
        });

        return (
          <Animated.View
            key={i}
            style={[
              styles.bullet,
              { opacity },
              {
                height: SIZE.BASE / 2,
                width: SIZE.BASE / 2,
                backgroundColor: COLOR.DARK,
              },
            ]}
          />
        );
      })}
    </View>
  );

  return (
    <React.Fragment>
      <FlatList
        ref={flatListRef}
        data={data}
        keyExtractor={(_, i) => 'key' + i}
        renderItem={({ item }) => {
          return (
            <View style={imageContainerStyles}>
              <TouchableWithoutFeedback>
                <Image
                  full
                  fit
                  url={item}
                  {...imageProps}
                  style={imageStyles}
                />
              </TouchableWithoutFeedback>
            </View>
          );
        }}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          // { useNativeDriver: true },
        )}
        horizontal
        pagingEnabled
        scrollEnabled
        snapToAlignment="center"
        scrollEventThrottle={16}
        showsHorizontalScrollIndicator={false}
        {...rest}
      />
      {RenderBullet}
    </React.Fragment>
  );
}

const styles = StyleSheet.create({
  bullet: {
    borderRadius: 50,
    margin: SIZE.margin,
  },

  imageContainer: {
    marginVertical: SIZE.margin,
    paddingHorizontal: SIZE.padding / 2,
  },
  tb: {
    alignSelf: 'center',
    flexDirection: 'row',
  },
});
