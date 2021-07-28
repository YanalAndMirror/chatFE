import * as actionTypes from "../actions/types";
const initialState = {
  chats: null,
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.FETCH_ROOM: {
      return {
        ...state,
        chats: action.payload,
      };
    }
    case actionTypes.ADD_MESSAGE: {
      let newChatAfterMessage = state.chats.map((chat) => {
        if (action.payload.roomId === chat._id)
          return {
            ...chat,
            messages: chat.messages
              ? [...chat.messages, action.payload.content]
              : [action.payload.content],
          };
        return chat;
      });
      return {
        ...state,
        chats: newChatAfterMessage,
      };
    }
    default:
      return state;
  }
};

export default reducer;
