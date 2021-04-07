import { useState } from 'react';
import { Auth } from 'aws-amplify';
import { useNavigation } from '@react-navigation/native';
import * as Sentry from '@sentry/react-native';
import SyncStorage from 'sync-storage';
import analytics from '@react-native-firebase/analytics';

import { useUpdateUser } from '../../apollo/mutation/user';

import { Modal, Snackbar } from '../../../library';

import SignOut from '../../../utils/signOut';

export function useSignOut() {
  const navigation = useNavigation();

  async function signOut() {
    try {
      await Auth.signOut();
      SignOut();
      Sentry.configureScope((scope) => scope.setUser(null));
      await analytics().setUserId(null); // ANALYTIC
      navigation.setParams();
    } catch (error) {
      Sentry.withScope(function (scope) {
        scope.setTag('func', 'useSignOut:hook');
        scope.setLevel(Sentry.Severity.Error);
        Sentry.captureException(error);
      });
    }
  }

  return [signOut];
}

export function useChangePassword() {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);

  async function changePassword(oldPassword, newPassword) {
    setLoading(true);
    try {
      const currentUser = await Auth.currentAuthenticatedUser();
      await Auth.changePassword(currentUser, oldPassword, newPassword);
      setLoading(false);

      Snackbar.show('Password changed successfully');
      navigation.navigate('User');
    } catch (error) {
      setLoading(false);
      if (error.code === 'NotAuthorizedException') {
        return Modal.show({
          title: 'Incorrect Password',
          description: 'Your current password is incorrect, Please try again.',
          closeTitle: 'try again',
        });
      } else {
        Sentry.withScope(function (scope) {
          scope.setTag('func', 'useChangePassword:hook');
          scope.setLevel(Sentry.Severity.Error);
          scope.setContext('data', { oldPassword, newPassword });
          Sentry.captureException(error);
        });

        const data = {
          oldLength: oldPassword?.length,
          newLength: newPassword?.length,
        };
        handleError(error, 'changing your password', data, navigation);
      }
    }
  }

  return [changePassword, { loading }];
}

export function useChangeEmail() {
  const navigation = useNavigation();

  const [loading, setLoading] = useState(false);

  async function changeEmail(email) {
    setLoading(true);
    try {
      const currentUser = await Auth.currentAuthenticatedUser();
      await Auth.updateUserAttributes(currentUser, { email });

      setLoading(false);
      navigation.navigate('EmailConfirmation', { email });
    } catch (error) {
      setLoading(false);
      if (error.code === 'AliasExistsException') {
        return Modal.show({
          title: 'Email already exist',
          description: `An account with email address ${email} already exists.`,
          closeTitle: 'ok',
        });
      } else {
        setLoading(false);

        Sentry.withScope(function (scope) {
          scope.setTag('func', 'useChangeEmail:hook');
          scope.setLevel(Sentry.Severity.Error);
          scope.setContext('data', { email });
          Sentry.captureException(error);
        });

        const data = { email };
        handleError(error, 'change your email address', data, navigation);
      }
    }
  }

  return [changeEmail, { loading }];
}

export function useResendEmailChangeConfirmationCode() {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);

  async function resendEmailChangeConfirmationCode() {
    try {
      setLoading(true);
      const currentUser = await Auth.currentAuthenticatedUser();
      await Auth.verifyUserAttribute(currentUser, 'email');
      Snackbar.show('Confirmation code send to email');
      setLoading(false);
    } catch (error) {
      setLoading(false);

      Sentry.withScope(function (scope) {
        scope.setTag('func', 'useResendEmailChangeConfirmationCode:hook');
        scope.setLevel(Sentry.Severity.Error);
        Sentry.captureException(error);
      });

      handleError(error, 'resending confirmation code', {}, navigation);
    }
  }

  return [resendEmailChangeConfirmationCode, { loading }];
}

export function useConfirmEmailChange() {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);

  async function confirmEmailChange(code) {
    setLoading(true);
    try {
      await Auth.verifyCurrentUserAttributeSubmit('email', code);
      setLoading(false);

      Snackbar.show('Email successfully verified');
      navigation.navigate('User', { code });
    } catch (error) {
      setLoading(false);

      if (error.code === 'CodeMismatchException') {
        return Modal.show({
          title: 'Invalid code',
          description:
            'Invalid confirmation code, Please double check your confirmation code and try again or resend the confirmation code.',
          closeTitle: 'try again',
        });
      } else if (error.code === 'ExpiredCodeException') {
        return Modal.show({
          title: 'Code expired',
          description:
            'Sorry! Your confirmation code has expired, Please resend code to get a new confirmation code.',
          closeTitle: 'ok',
        });
      } else {
        Sentry.withScope(function (scope) {
          scope.setTag('func', 'useConfirmEmailChange:hook');
          scope.setLevel(Sentry.Severity.Critical);
          scope.setContext('data', { code });
          Sentry.captureException(error);
        });

        const data = { code };
        handleError(error, 'verifying confirmation code', data, navigation);
      }
    }
  }

  return [confirmEmailChange, { loading }];
}

export function useResetPassword() {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);

  async function resetPassword(email, code, newPassword) {
    try {
      setLoading(true);
      await Auth.forgotPasswordSubmit(email, code, newPassword);
      setLoading(false);
      navigation.navigate('Login', { email });
      Snackbar.show('Password reset successful');
    } catch (error) {
      setLoading(false);
      if (error.code === 'CodeMismatchException') {
        return Modal.show({
          title: 'Invalid code',
          description:
            'Invalid verification code, Please double check your reset password verification code and try again or resend the verification code.',
          closeTitle: 'try again',
        });
      } else {
        Sentry.withScope(function (scope) {
          scope.setTag('func', 'useResetPassword:hook');
          scope.setLevel(Sentry.Severity.Critical);
          scope.setUser({
            id: null,
            email,
          });
          scope.setContext('data', { email, code, newPassword });
          Sentry.captureException(error);
        });

        const data = { email, code, length: newPassword?.length };
        handleError(error, 'resetting your password', data, navigation);
      }
    }
  }

  return [resetPassword, { loading }];
}

export function useForgotPassword() {
  const navigation = useNavigation();
  const [sendConfirmationCode] = useSendConfirmationCode();
  const [loading, setLoading] = useState(false);

  async function forgotPassword(email) {
    try {
      setLoading(true);
      await Auth.forgotPassword(email);
      setLoading(false);
      navigation.navigate('ResetPassword', { email });
      Snackbar.show('Verification code send to email');
    } catch (error) {
      setLoading(false);

      if (error.code === 'UserNotFoundException') {
        return Modal.show({
          title: 'Account not exist',
          description:
            'There is no account matching that email address, Please double check your email address and try again.',
          closeTitle: 'try again',
        });
      } else if (error.message.includes('no registered/verified email')) {
        return Modal.show({
          title: 'Email Address not confirmed',
          description: `Please confirm your email address ${email} to reset your password.`,
          actions: [
            {
              title: 'confirm email',
              onPress: () => {
                sendConfirmationCode(email);
                navigation.navigate('EmailConfirmation', { email });
              },
            },
          ],
        });
      } else {
        Sentry.withScope(function (scope) {
          scope.setTag('func', 'useForgotPassword:hook');
          scope.setLevel(Sentry.Severity.Critical);
          scope.setUser({
            id: null,
            email,
          });
          scope.setContext('data', { email });
          Sentry.captureException(error);
        });

        const data = { email };
        handleError(
          error,
          'sending reset password verification code',
          data,
          navigation,
        );
      }
    }
  }

  return [forgotPassword, { loading }];
}

export function useSendConfirmationCode() {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);

  async function sendConfirmationCode(email) {
    try {
      setLoading(true);
      await Auth.resendSignUp(email);
      Snackbar.show('Confirmation code send to your email');
      setLoading(false);
    } catch (error) {
      setLoading(false);

      Sentry.withScope(function (scope) {
        scope.setTag('func', 'useSendConfirmationCode:hook');
        scope.setLevel(Sentry.Severity.Critical);
        scope.setUser({
          id: null,
          email,
        });
        scope.setContext('data', { email });
        Sentry.captureException(error);
      });

      const data = { email };
      handleError(error, 'sending confirmation code', data, navigation);
    }
  }

  return [sendConfirmationCode, { loading }];
}

export function useConfirmSign() {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);

  async function confirmSign(username, code) {
    try {
      setLoading(true);
      const isConfirm = await Auth.confirmSignUp(username, code);
      if (isConfirm === 'SUCCESS') {
        navigation.navigate('Login');
        Snackbar.show('Email successfully confirmed');
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);

      if (error.code === 'CodeMismatchException') {
        return Modal.show({
          title: 'Invalid code',
          description:
            'Invalid confirmation code, Please double check your confirmation code and try again or resend the confirmation code.',
          closeTitle: 'try again',
        });
      } else if (error.code === 'ExpiredCodeException') {
        return Modal.show({
          title: 'Code expired',
          description:
            'Sorry! Your confirmation code has expired, Please resend code to get a new confirmation code.',
          closeTitle: 'ok',
        });
      } else {
        Sentry.withScope(function (scope) {
          scope.setTag('func', 'useConfirmSign:hook');
          scope.setLevel(Sentry.Severity.Critical);
          scope.setUser({
            id: username,
          });
          scope.setContext('data', { username, code });
          Sentry.captureException(error);
        });

        const data = { username, code };
        handleError(error, 'verifying confirmation code', data, navigation);
      }
    }
  }

  return [confirmSign, { loading }];
}

export function useSignIn() {
  const navigation = useNavigation();
  const [sendConfirmationCode] = useSendConfirmationCode();
  const [loading, setLoading] = useState(false);

  // NEXT: show contact us if email address not found

  async function signIn(email, password) {
    try {
      setLoading(true);
      const { username, attributes } = await Auth.signIn(email, password);
      SyncStorage.set('@sign', true);
      SyncStorage.set('@user', username);

      Sentry.setUser({ id: username, email: attributes.email });
      await analytics().logLogin({ method: 'email' }); // ANALYTIC
      await analytics().setUserId(username); // ANALYTIC

      setLoading(false);
      navigation.navigate('Register');
    } catch (error) {
      setLoading(false);

      if (error.code === 'UserNotFoundException') {
        return Modal.show({
          title: 'Account not exist',
          description:
            'There is no account matching that email address, Please double check your email address and try again.',
          closeTitle: 'try again',
        });
      } else if (error.code === 'NotAuthorizedException') {
        return Modal.show({
          title: 'Incorrect password',
          description:
            'The password you entered is incorrect, Please Try again or reset your password.',
          closeTitle: 'try again',
          actions: [
            {
              title: 'reset my password',
              onPress: () => navigation.navigate('ForgotPassword', { email }),
            },
          ],
        });
      } else if (error.code === 'UserNotConfirmedException') {
        await sendConfirmationCode(email);
        navigation.navigate('EmailConfirmation', { email });
      } else {
        Sentry.withScope(function (scope) {
          scope.setTag('func', 'useSignIn:hook');
          scope.setLevel(Sentry.Severity.Critical);
          scope.setUser({
            id: null,
            email,
          });
          scope.setContext('data', { email, password });
          Sentry.captureException(error);
        });

        const data = { email, length: password?.length };
        handleError(error, 'logging you in', data, navigation);
      }
    }
  }
  return [signIn, { loading }];
}

export function useSignUp() {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);

  async function signUp(email, password, name) {
    try {
      setLoading(true);
      await Auth.signUp({
        username: email,
        password,
        attributes: { name },
      });

      await analytics().logSignUp({ method: 'email' }); // ANALYTIC
      setLoading(false);

      navigation.navigate('EmailConfirmation', { email });
    } catch (error) {
      setLoading(false);
      if (error.code === 'UsernameExistsException') {
        return Modal.show({
          title: 'Email already exist',
          description: `An account with email address ${email} already exists.`,
          closeTitle: 'ok',
        });
      } else {
        Sentry.withScope(function (scope) {
          scope.setTag('func', 'useSignUp:hook');
          scope.setLevel(Sentry.Severity.Critical);
          scope.setUser({
            id: null,
            email,
          });
          scope.setContext('data', { email, password });
          Sentry.captureException(error);
        });

        const data = { email, length: password?.length };
        handleError(error, 'registering an account', data, navigation);
      }
    }
  }
  return [signUp, { loading }];
}

/**
 *
 * @param {any} error error object
 * @param {string} action error about
 * @param {object} data user data
 * @param {function} navigation navigation function
 */
function handleError(error, action, data, navigation) {
  switch (error.code) {
    case 'TooManyRequestsException':
      return Modal.show({
        title: 'Too many attempts',
        description:
          "Oops! You've exceeded the number of attempts, Please try again after sometimes.",
        closeTitle: 'ok',
      });
    case 'LimitExceededException':
    case 'TooManyFailedAttemptsException':
      return Modal.show({
        title: 'Limit exceeded',
        description:
          'Sorry! You have exceeded the limit for this operation, Please wait for few minutes before trying agin.',
        closeTitle: 'ok',
      });
    case 'NetworkError':
      return Modal.show({
        title: 'Connection Problem',
        description:
          'Oops! Please check your internet connection and try again, If your internet connection is available then report this issue.',
        actions: [
          {
            title: 'Report issue',
            onPress: () =>
              navigation.navigate('Home', {
                screen: 'ReportIssue',
                params: {
                  error: JSON.stringify(error),
                  data: JSON.stringify(data),
                },
              }),
          },
        ],
      });
    case 'NotAuthorizedException':
    case 'UserNotConfirmedException':
    case 'UserNotFoundException':
    case 'PasswordResetRequiredException':
      return Auth.signOut();
    default: {
      return Modal.show({
        title: 'Server Error',
        description: `Oops! Something went wrong while ${action}, Please try again later or report this issue.`,
        actions: [
          {
            title: 'Report issue',
            onPress: () =>
              navigation.navigate('Home', {
                screen: 'ReportIssue',
                params: {
                  error: JSON.stringify(error),
                  data: JSON.stringify(data),
                },
              }),
          },
        ],
      });
    }
  }
}
