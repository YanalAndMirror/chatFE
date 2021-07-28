import * as actionTypes from "../actions/types";
const initialState = {
  user: null,
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    // SUGGESTION: Why do we need three cases if all three are returning the same thing?
    case actionTypes.LOGIN: {
      return {
        ...state,
        user: action.payload,
      };
    }
    case actionTypes.SIGNOUT: {
      return {
        ...state,
        user: null,
      };
    }
    case actionTypes.UPDATE_USER: {
      console.log(action.payload); // REVIEW: Remove if done testing
      return {
        ...state,
        user: action.payload,
      };
    }

    default:
      return state;
  }
};

export default reducer;
