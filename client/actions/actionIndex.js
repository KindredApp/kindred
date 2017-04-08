export const selectExample = (example) => {
  //action creator function
  console.log('example clicked: ', example.example);
  //returns the actual action
  return {
    type: 'EXAMPLE_CLICKED',
    payload: example
  };
};
