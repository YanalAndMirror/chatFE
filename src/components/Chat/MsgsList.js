import React, { useEffect, useRef } from "react";
import IncomingMsg from "./IncomingMsg";

export default function MsgsList({
  messages,
  type,
  user,
  setIsOpen,
  roomId,
  setInputReply,
  inputReply,
  socket,
}) {
  const el = useRef(null);

  useEffect(() => {
    el.current.scrollIntoView({ block: "end" });
    if (socket) {
      let notSeenCount = messages
        .map((message) => {
          let thisCount = message.receivers.filter((receiver) => {
            if (receiver.seen === null && receiver._id == user._id) return true;
            return false;
          });
          return thisCount.length;
        })
        .filter((a) => a).length;
      if (notSeenCount > 0)
        socket.emit("roomSeen", { userId: user._id, roomId });
    }
  }, [messages]);

  let messageDate = "";
  let roomMessages = messages.map((message) => {
    let e2e = <></>;
    if (messageDate === "")
      e2e = (
        <div class="flex justify-center mb-4">
          <div
            class="rounded py-2 px-4"
            style={{ "background-color": "#FCF4CB" }}
          >
            <p
              class="text-xs"
              onClick={() =>
                alert("your messages is encrypted with key :" + user.secretKey)
              }
            >
              Messages to this chat and calls are now secured with end-to-end
              encryption. Tap for more info.
            </p>
          </div>
        </div>
      );
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
        {e2e}
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
      <div id={"el"} ref={el} class="py-2 px-3">
        {roomMessages}
      </div>
    </div>
  );
}
