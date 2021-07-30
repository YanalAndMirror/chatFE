import React from "react";
import IncomingMsg from "./IncomingMsg";
import OutcomingMsg from "./OutcomingMsg";

export default function MsgsList({
  messages,
  type,
  user,
  setIsOpen,
  roomId,
  setInputReply,
  inputReply,
}) {
  let messageDate = "";
  let roomMessages = messages.map((message) => {
    let thisDate = "";
    if (messageDate !== message.createdAt.toString().substr(0, 10)) {
      messageDate = message.createdAt.toString().substr(0, 10);
      thisDate = (
        <div
          class={"text-xs m-1.5 w-24 right-0  rounded py-1 px-3"}
          style={{ backgroundColor: "#E1F3FB" }}
        >
          {messageDate}
        </div>
      );
    }
    return (
      <>
        <center>{thisDate}</center>
        <IncomingMsg
          roomId={roomId}
          setIsOpen={setIsOpen}
          message={message}
          type={type}
          user={user}
          setInputReply={setInputReply}
          inputReply={inputReply}
        />
      </>
    );
  });
  return (
    <div class="flex-1 overflow-auto" style={{ backgroundColor: "#DAD3CC" }}>
      <div class="py-2 px-3">{roomMessages}</div>
    </div>
  );
}
