export const actionQotdList = (list) => {

  console.log('qotd list:', list);

  return {
    type: 'QOTDS_SET',
    payload: list
  };
};
