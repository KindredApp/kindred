export const actionQotdData = (getDataResponse) => {

  console.log('data response', getDataResponse);

  return {
    type: 'RESPONSE_RECEIVED',
    payload: getDataResponse
  };
};