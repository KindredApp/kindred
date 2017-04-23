export const actionFirebase = (db) => {

  return {
    type: 'FIREBASE_CONNECTED',
    payload: db
  };
};
