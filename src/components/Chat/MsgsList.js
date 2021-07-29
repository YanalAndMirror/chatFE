import React from "react";
import IncomingMsg from "./IncomingMsg";
import OutcomingMsg from "./OutcomingMsg";

export default function MsgsList({ messages, type, user, setIsOpen, roomId }) {
  let roomMessages = messages.map((message) => (
    <>
      <IncomingMsg
        roomId={roomId}
        setIsOpen={setIsOpen}
        message={message}
        type={type}
        user={user}
      />
    </>
  ));
  return (
    <div class="flex-1 overflow-auto" style={{ backgroundColor: "#DAD3CC" }}>
      <div class="py-2 px-3">{roomMessages}</div>
    </div>
  );
}
