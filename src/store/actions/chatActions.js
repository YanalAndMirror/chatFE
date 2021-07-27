import * as actionTypes from "./types";
//import instance from "./instance";

export const addMessage = (roomId, content) => {
  return async (dispatch) => {
    try {
      dispatch({
        type: actionTypes.ADD_MESSAGE,
        payload: { roomId, content },
      });
    } catch (error) {
      console.log(error);
    }
  };
};
