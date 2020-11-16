import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import * as MailComposer from 'expo-mail-composer';
import _ from 'lodash';
import * as Sentry from '@sentry/react-native';

import {
  Button,
  Container,
  Input,
  Header,
  Modal,
  Icon,
  Typography,
} from '../../../library';
import { SIZE } from '../../../library/Theme';

export default function FeatureRequest({ navigation }) {
  const [question, setQuestion] = useState(null);

  const faqs = [
    {
      question: 'What is Adex?',
      answer:
        "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and",
    },
    {
      question: 'How long Adex ad stay?',
      answer:
        "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s.",
    },
    {
      question: 'Is posting my ad on Adex free?',
      answer:
        "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries",
    },
    {
      question: 'Why should I use Adex?',
      answer:
        "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries",
    },
  ];

  const RenderQuestion = ({ question, answer }) => {
    return (
      <View style={s.question}>
        <Typography family="bold">{question}</Typography>
        <Typography family="thin" variant="caption">
          {answer}
        </Typography>
      </View>
    );
  };

  const _onAskQuestion = () => {
    try {
      MailComposer.composeAsync({
        subject: question,
        body: question,
        recipients: ['support@fivoto.com'],
      });
    } catch (error) {
      Modal.show({
        title: 'Message Not Send',
        description:
          'Oops! Something went wrong while sending your message, Please contact us through support@fivoto.com.',
        closeTitle: 'close',
      });

      Sentry.withScope(function (scope) {
        scope.setTag('screen', 'faq');
        scope.setLevel(Sentry.Severity.Error);
        scope.setContext('data', { question });
        Sentry.captureException(error);
      });
    }
  };

  return (
    <React.Fragment>
      <Header
        backSpace={false}
        startContent={
          <Icon
            name="menu"
            size={SIZE.icon * 1.5}
            touch
            onPress={navigation.toggleDrawer}
          />
        }
      />
      <Container
        scrollProps={{
          keyboardShouldPersistTaps: 'always',
          showsVerticalScrollIndicator: false,
        }}>
        <Typography variant="h1" family="bold">
          Frequently Asked Questions
        </Typography>
        {faqs.map(({ answer, question }) => (
          <RenderQuestion key={question} question={question} answer={answer} />
        ))}

        {/* ASK INPUT BUTTON  */}
        <View style={s.ask}>
          <Input
            placeholder="ASK QUESTION"
            inputContainerStyle={s.inputContainerStyle}
            style={s.askInput}
            returnKeyLabel="ask"
            returnKeyType="done"
            value={question}
            onChangeText={setQuestion}
          />
          <Button
            style={s.askButton}
            variant="contained"
            onPress={_onAskQuestion}
            disabled={_.isEmpty(question)}>
            ask
          </Button>
        </View>
      </Container>
    </React.Fragment>
  );
}

const s = StyleSheet.create({
  ask: {
    alignItems: 'center',
    flexDirection: 'row',
  },
  askButton: {
    borderBottomLeftRadius: 0,
    borderTopLeftRadius: 0,
    flex: 1,
  },
  askInput: {
    borderBottomRightRadius: 0,
    borderTopRightRadius: 0,
  },
  inputContainerStyle: {
    flex: 4,
  },
  question: {
    marginVertical: SIZE.margin,
  },
});
