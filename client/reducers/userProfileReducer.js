const fieldMap = {
  Religion: ['Atheist', 'Agnostic', 'Buddhism', 'Christianity', 'Hinduism', 'Islam', 'Jewish', 'Other organized religion', 'Other'],
  
  Party: ['Democratic', 'Green', 'Independent', 'Libertarian', 'Republican', 'Other'],
  
  Religiousity: [ 'I do not believe in any higher power', 'I believe in a higher power but do not follow a specific religion', 'I follow a religion but do not actively practice it', 'I follow a religion and participate in its major events', 'I follow a religion and practice it at least once a month', 'I follow a religion and practice it at least once a week', 'I follow a religion and practice it at least once a day', 'I follow a religion and practice it many times a day', 'I consider myself spiritual, but it does not relate to religion', 'Other'],
  
  Education: ['Elementary School','Middle School','High School','College (4 year degree)','Associate degree (2 year degree)','Master\'s degree','Professional or doctorate degree','I was home schooled', 'None', 'Other'],
  
  Income: ['$0 - $30,000','$30,000 - $50,000','$50,000 - $75,000','$75,000 - $100,000','$100,000 - $150,000','$150,000 - $200,000','Above $200,000','I do not have an income'],

  Ethnicity: ['African American','Asian','Caucasian','Hispanic or Latino','Pacific Islander','Multi Racial','Other'],

  Gender: ['Male', 'Female', 'Other']
};

export default function (state = null, action) {
  switch (action.type) {
  case 'USER_PROFILE_SET':
    let parsedProfile = {
      Username: "",
      // Name: "",
      Age: "",
      State: "",
      Zip: ""
    };
    if (Array.isArray(action.payload)) {
      action.payload.forEach((fieldTuple) => {
        let category = fieldTuple[0];
        let inFieldmap = fieldMap[category];
        let val = fieldTuple[1];
        if (inFieldmap) {
          parsedProfile[category] = inFieldmap[val - 1];
        } else {
          parsedProfile[category] = val;
        }
      });
    } else {
      for (let category in action.payload) {
        let toTransform = fieldMap[category];
        if (toTransform) {
          parsedProfile[category] = toTransform[action.payload[category] - 1];
        } else if (category in parsedProfile) {
          parsedProfile[category] = action.payload[category];
        }
      }
    }
    return parsedProfile;
    break;
  }
  return state;
}