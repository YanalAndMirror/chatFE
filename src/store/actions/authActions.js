import * as actionTypes from "./types";
import instance from "./instance";
import { fetchRoom } from "./chatActions";

export const signin = (phoneNumber, history) => {
  return async (dispatch) => {
    try {
      // REVIEW: Why not move `/api/v1` to instance.js?
      const res = await instance.post(`/api/v1/users/login`, {
        phoneNumber: phoneNumber, // change to phoneNumber
      });
      dispatch(fetchRoom(res.data._id));
      history.push("/");
      dispatch({
        type: actionTypes.LOGIN,
        payload: res.data,
      });
    } catch (error) {
      console.log(error);
    }
  };
};
export const signout = (history, socket) => {
  return async (dispatch) => {
    try {
      socket.disconnect();
      history.push("/");
      dispatch({
        type: actionTypes.SIGNOUT,
        payload: null,
      });
    } catch (error) {
      console.log(error);
    }
  };
};
