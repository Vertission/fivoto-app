import React from 'react';
import { Keyboard } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import _ from 'lodash';

import { Container, Input, Header, Icon, Indicator } from '../../library';
import { SIZE } from '../../library/Theme';

import { useUpdateUser } from '../../setup/apollo/mutation/user';

import rules from '../../utils/rules';

export default function EditProfile({ route }) {
  const [updateUser, { loading: uploadPublicDataLoading }] = useUpdateUser();

  const { control, handleSubmit, errors } = useForm({
    mode: 'onBlur',
    defaultValues: route.params.profile,
  });

  const onSubmit = ({ name }) => {
    if (_.isEqual({ name: route.params.profile.name }, { name })) return null;
    updateUser({ name });
    Keyboard.dismiss();
  };

  const HeaderEndIconRender = (
    <Icon
      name="checkmark"
      size={SIZE.icon * 1.5}
      touch
      onPress={handleSubmit(onSubmit)}
    />
  );

  return (
    <>
      <Header endContent={HeaderEndIconRender} />
      <Container>
        {/* INDICATOR  */}
        <Indicator.Progress
          style={{ position: 'absolute' }}
          indeterminate={uploadPublicDataLoading}
          width={SIZE.width - SIZE.margin * 2}
        />
        {/* NAME  */}
        <Controller
          control={control}
          render={({ onChange, onBlur, value }) => (
            <Input
              label="Name"
              placeholder="name"
              icon="person"
              maxLength={18}
              error={errors?.name?.message}
              onBlur={onBlur}
              onChangeText={(name) => onChange(name)}
              value={value}
            />
          )}
          name="name"
          rules={rules.name}
          defaultValue=""
        />
      </Container>
    </>
  );
}
