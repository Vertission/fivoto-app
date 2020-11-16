import _ from 'lodash';
import { Modal } from '../../../library';

export default async function handleError(error, data, action, navigation) {
  if (_.isEmpty(error.graphQLErrors)) {
    Modal.show({
      title: 'Request Failed',
      description: `Oops! Something went wrong while ${action}, Please try again later or report this issue.`,
      actions: [
        {
          title: 'Report issue',
          onPress: () =>
            navigation.navigate('Home', {
              screen: 'ReportIssue',
              params: {
                data: JSON.stringify(data),
                error: JSON.stringify(error),
                action,
              },
            }),
        },
      ],
      closeTitle: 'try again later',
    });
  } else {
    Modal.show({
      title: 'Internal Server Error',
      description:
        'The server encountered an internal error and unable to complete your request. Please report this issue.',
      actions: [
        {
          title: 'Report issue',
          onPress: () =>
            navigation.navigate('Home', {
              screen: 'ReportIssue',
              params: {
                data: JSON.stringify(data),
                error: JSON.stringify(error),
                action,
              },
            }),
        },
      ],
      close: false,
    });
  }
}
