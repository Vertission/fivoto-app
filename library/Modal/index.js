import React, { Component, useState } from 'react';
import {
  Modal as NativeModal,
  StyleSheet,
  View,
  TouchableOpacity,
} from 'react-native';
import RootSiblings from 'react-native-root-siblings';

import Typography from '../Typography';

import { SIZE, COLOR } from '../Theme';

class Modal extends Component {
  static displayName = 'Modal';

  static show = ({
    title,
    description,
    content,
    onRequestClose,
    actions,
    close,
    closeTitle,
  }) => {
    return new RootSiblings(
      (
        <ModalContainer
          title={title}
          description={description}
          content={content}
          onRequestClose={onRequestClose}
          actions={actions}
          closeTitle={closeTitle}
          close={close}
        />
      ),
    );
  };

  static hide = (modal) => {
    if (modal instanceof RootSiblings) {
      modal.destroy();
    } else {
      console.warn(
        `modal.hide expected a \`RootSiblings\` instance as argument.\nBut got \`${typeof modal}\` instead.`,
      );
    }
  };

  _modal = null;

  UNSAFE_componentWillMount = () => {
    this._modal = new RootSiblings(<ModalContainer {...this.props} />);
  };

  UNSAFE_componentWillReceiveProps = (nextProps) => {
    this._modal.update(<ModalContainer {...nextProps} />);
  };

  componentWillUnmount = () => {
    this._modal.destroy();
  };

  render() {
    return null;
  }
}

function ModalContainer({
  actions = [],
  onRequestClose,
  closeTitle,
  close = true,
  title,
  description,
  content,
  ...props
}) {
  const [visible, setVisible] = useState(true);

  const modalActions = close
    ? [
        ...actions,
        {
          title: closeTitle ? closeTitle : 'close',
          onPress: () => setVisible(false),
        },
      ]
    : actions;

  const _onPressActionModal = ({ onPress }) => {
    setVisible(false);
    onPress();
  };

  return (
    <NativeModal
      animationType="fade"
      visible={visible}
      transparent={true}
      onRequestClose={() => setVisible(!onRequestClose)}
      {...props}>
      <View style={styles.root}>
        <View style={styles.container}>
          <View style={styles.textContainer}>
            <Typography variant="h5" align="center" family="bold">
              {title}
            </Typography>
            <Typography
              variant="caption"
              align="center"
              color={COLOR.MUTED}
              style={styles.textDescription}>
              {description}
            </Typography>
            {content}
          </View>
          <View style={styles.buttonContainer}>
            {modalActions.map((modal) => (
              <TouchableOpacity
                key={modal.title}
                style={styles.button}
                onPress={() => _onPressActionModal(modal)}>
                <Typography style={styles.buttonText}>{modal.title}</Typography>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </View>
    </NativeModal>
  );
}

const styles = StyleSheet.create({
  button: {
    padding: SIZE.padding,
    width: '100%',
  },
  buttonContainer: {
    width: '100%',
  },
  buttonText: {
    color: COLOR.PRIMARY,
    fontWeight: 'bold',
    textAlign: 'center',
    textTransform: 'uppercase',
  },
  container: {
    alignItems: 'center',
    backgroundColor: COLOR.WHITE,
    borderRadius: SIZE.radius,
    marginHorizontal: SIZE.margin * 4.5,
    shadowColor: COLOR.BLACK,
  },
  root: {
    backgroundColor: COLOR.FILL,
    flex: 1,
    justifyContent: 'center',
  },
  textContainer: {
    paddingHorizontal: SIZE.padding / 2,
    paddingVertical: SIZE.padding,
  },
  textDescription: {
    marginTop: SIZE.margin / 2,
  },
});

export default Modal;
