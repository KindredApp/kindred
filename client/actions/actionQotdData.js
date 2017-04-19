export const actionQotdData = (getDataResponse) => {

  return {
    type: 'RESPONSE_RECEIVED',
    payload: getDataResponse
  };
};