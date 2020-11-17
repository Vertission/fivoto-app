import React, { useContext } from 'react';
import { StyleSheet } from 'react-native';
import _ from 'lodash';

import { Container, Header, Typography, Input } from '../../library';

import { Context, dispatch } from './modules/context';

export default function Description() {
  const { description } = useContext(Context);

  const _onChangeText = (description) => {
    if (_.size(description) > 4499) return null;
    dispatch('SET_DESCRIPTION', description);
  };

  return (
    <React.Fragment>
      <Header />

      <Container>
        <Typography align="right" style={s.count}>
          {_.size(description)} / 4500
        </Typography>
        <Input
          multiline
          placeholder="DESCRIBE YOUR AD..."
          onChangeText={_onChangeText}
          value={description}
        />
      </Container>
    </React.Fragment>
  );
}

const s = StyleSheet.create({
  count: {
    fontFamily: 'monospace',
  },
});
