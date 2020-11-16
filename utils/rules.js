export default {
  email: {
    required: 'please enter your email address',
    pattern: {
      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
      message: 'invalid email address',
    },
  },
  name: {
    required: 'please enter your name',
    minLength: {
      value: 3,
      message: 'your name is too short',
    },
  },
  verificationCode: {
    required: 'verification code required',
    minLength: {
      value: 6,
      message: 'invalid verification code',
    },
  },
  confirmationCode: {
    required: 'confirmation code required',
    minLength: {
      value: 6,
      message: 'invalid confirmation code',
    },
  },
  newPassword: {
    required: 'please enter your new password',
    minLength: {
      value: 8,
      message: 'your password is too weak',
    },
  },
  oldPassword: {
    required: 'please enter your old password',
  },
};
