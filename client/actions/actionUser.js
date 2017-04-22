export const actionUser = (user) => {

  return {
    type: 'USER_LOGGED_IN',
    payload: user
  };
};
