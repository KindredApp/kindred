export const actionSetUserProfile = (profileObj) => {

  console.log('set this user profile: ', profileObj);

  return {
    type: 'USER_PROFILE_SET',
    payload: profileObj
  };
};