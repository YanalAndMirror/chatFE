import * as actionTypes from '../actions/types';
const initialState = {
  chats: null,
  channels: null,
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.FETCH_ROOM: {
      return {
        ...state,
        chats: action.payload,
      };
    }
    case actionTypes.CREATE_ROOM: {
      let roomExist = state.chats.find(
        (chat) => chat._id === action.payload._id
      );
      if (roomExist) {
        return state;
      }
      return {
        ...state,
        chats: [...state.chats, { ...action.payload, messages: [] }],
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
    case actionTypes.FETCH_CHANNELS: {
      return {
        ...state,
        channels: action.payload,
      };
    }
    case actionTypes.SEEN_MESSAGE: {
      let seenRoom = state.chats.find(
        (chat) => action.payload.roomId === chat._id
      );

      seenRoom = seenRoom.messages.map((message) => {
        message.receivers = message.receivers.map((receiver) => {
          if (
            receiver._id === action.payload.userId &&
            receiver.seen === null
          ) {
            receiver.seen = action.payload.time;
          }
          return receiver;
        });
        return message;
      });
      return {
        ...state,
        chats: state.chats.map((chat) =>
          seenRoom._id === chat.id ? seenRoom : chat
        ),
      };
    }
    default:
      return state;
  }
};

export default reducer;
