import React from 'react';
import { StyleSheet, View, Animated, TouchableOpacity } from 'react-native';

import { SIZE, COLOR } from '../Theme';
import Typography from '../Typography';

export default class Radio extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      activeIndex: -1,
      fadeAnim: new Animated.Value(0),
    };

    this._changeRadio = this._changeRadio.bind(this);
    this._checkAnimations = this._checkAnimations.bind(this);
  }

  componentDidMount() {
    this._checkAnimations();
    this.props.selectedItem(this.props.data[this.props.initial]);
  }

  componentDidUpdate(prevProps) {
    if (this.state.activeIndex === -1 && this.props.initial > 0) {
      const initialActive = this.props.initial - 1;
      this._changeRadio(this.props.data[initialActive], initialActive);
    }
    if (this.props.initial !== prevProps.initial) {
      const initialActive = this.props.initial - 1;
      this._changeRadio(this.props.data[initialActive], initialActive);
    }
    if (this.props.animationTypes !== prevProps.animationTypes) {
      this._checkAnimations();
    }
  }

  _checkAnimations() {
    const { animationTypes } = this.props;

    this.setState({ animations: [] });
    const newAnim = [];
    animationTypes &&
      animationTypes.map((item) => {
        const itm = this.animations.find((e) => e.name === item);
        if (itm) {
          newAnim.push(itm.animation);
        }
      });
    this.setState({ animations: newAnim });
  }

  _changeRadio(item, activeIndex) {
    this.setState({ activeIndex });
    if (activeIndex !== this.state.activeIndex) {
      this.fadeInAnimation();
    }
    this.props.selectedItem(item);
  }

  fadeInAnimation = () => {
    Animated.timing(this.state.fadeAnim, {
      toValue: 0,
      duration: 0,
      useNativeDriver: true,
    }).start(() => {
      Animated.timing(this.state.fadeAnim, {
        toValue: 1,
        duration: this.props.duration,
        delay: 10,
        useNativeDriver: true,
      }).start();
    });
  };

  render() {
    let { activeIndex, fadeAnim } = this.state;
    let { style, data, icon, label } = this.props;

    const circleSize = 13;

    return (
      <View style={[s.root, style]}>
        <Typography variant="h5">{label}</Typography>
        {data.map((item, index) => {
          return (
            <TouchableOpacity
              key={index}
              style={s.productBoxLess}
              activeOpacity={0.9}
              onPress={() => this._changeRadio(item, index)}>
              <View>
                <View
                  style={[
                    icon ? s.icon : s.circle,
                    {
                      borderColor:
                        activeIndex === index ? COLOR.PRIMARY : COLOR.MUTED,
                      width: circleSize + 8,
                      height: circleSize + 8,
                    },
                    icon && {
                      borderColor:
                        activeIndex === index ? COLOR.TRANSPARENT : COLOR.MUTED,
                    },
                  ]}>
                  <Animated.View
                    style={{
                      opacity: activeIndex === index ? fadeAnim : 0,
                    }}>
                    <View>
                      <View
                        style={[
                          s.circleFill,
                          {
                            backgroundColor:
                              activeIndex === index
                                ? COLOR.PRIMARY
                                : COLOR.MUTED,
                            borderColor:
                              activeIndex === index
                                ? COLOR.PRIMARY
                                : COLOR.MUTED,
                            width: circleSize,
                            height: circleSize,
                          },
                        ]}
                      />
                    </View>
                  </Animated.View>
                </View>
              </View>

              <View style={s.centerProductBox}>
                <Typography>{item.label}</Typography>
              </View>
            </TouchableOpacity>
          );
        })}
      </View>
    );
  }
}

const s = StyleSheet.create({
  centerProductBox: {
    alignItems: 'flex-start',
    flex: 6,
    justifyContent: 'center',
    marginLeft: SIZE.margin,
    paddingHorizontal: SIZE.padding,
  },
  circle: {
    alignItems: 'center',
    borderRadius: 10000,
    borderWidth: SIZE.radius / 1.5,
    justifyContent: 'center',
  },
  circleFill: {
    borderRadius: 10000,
    borderWidth: 1,
  },
  icon: {
    alignItems: 'center',
    borderRadius: 10000,
    borderWidth: SIZE.radius / 1.5,
    justifyContent: 'center',
  },
  productBoxLess: {
    alignItems: 'center',
    flexDirection: 'row',
    marginTop: 10,
  },
  root: {
    marginVertical: SIZE.margin,
  },
});
