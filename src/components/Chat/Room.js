import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import InputField from "./InputField";
import MsgsList from "./MsgsList";
import RightHeader from "./RightHeader";

export default function Room({ roomId, socket }) {
  let thisRoom = useSelector((state) =>
    state.chats.chats.find((chat) => chat.roomId === roomId)
  );
  console.log(socket);
  return roomId ? (
    <>
      <div class="w-2/3 border flex flex-col">
        {/* <!-- Header --> */}
        <RightHeader name={thisRoom.name} />
        {/* <!-- Messages --> */}
        <MsgsList messages={thisRoom.messages} />
        {/* <!-- Input --> */}
        <InputField roomId={roomId} socket={socket} />
      </div>
    </>
  ) : (
    <></>
  );
}
