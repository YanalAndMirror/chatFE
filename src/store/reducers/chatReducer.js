import * as actionTypes from "../actions/types";
const initialState = {
  chats: [
    {
      roomId: "6100487d9b996722dc5addc8",
      messages: ["كم السعر"],
      name: "Ahmed",
    },
    { roomId: 2, messages: ["مرحبا"], name: "Mohammad" },
    { roomId: 3, messages: ["Get Andrés on this movie ASAP"], name: "Yanal" },
  ],
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
