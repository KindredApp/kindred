export const actionUser = (user) => {

  console.log('user logged in: ', user);

  return {
    type: 'USER_LOGGED_IN',
    payload: user
  };
};
