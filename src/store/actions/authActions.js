import * as actionTypes from './types';
import instance from './instance';

export const signin = (phoneNumber, history) => {
  return async (dispatch) => {
    try {
      const res = await instance.post(`/api/v1/users/login`, {
        phoneNumber: phoneNumber,
      });
      history.push('/');
      dispatch({
        type: actionTypes.LOGIN,
        payload: res.data,
      });
    } catch (error) {
      console.log(error);
    }
  };
};
