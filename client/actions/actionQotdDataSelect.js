export const actionQotdDataSelect = (qotd) => {

  console.log('user wants to see data for: ', qotd);

  return {
    type: 'QOTD_SELECTED',
    payload: qotd
  };
};