export const actionFirebase = (db) => {

  console.log('db connection received: ', db);

  return {
    type: 'FIREBASE_CONNECTED',
    payload: db
  };
};
