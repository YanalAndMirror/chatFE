import * as actionTypes from './types';
import instance from './instance';

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

export const createRoom = (room, userId) => {
  return async (dispatch) => {
    try {
      const res = await instance.post(`/api/v1/rooms/user/${userId}`, room);
      dispatch({
        type: actionTypes.CREATE_ROOM,
        payload: res.data,
      });
    } catch (error) {
      console.log(error);
    }
  };
};
