import React from "react";
import IncomingMsg from "./IncomingMsg";
import OutcomingMsg from "./OutcomingMsg";

export default function MsgsList({ messages, type, user }) {
  let roomMessages = messages.map((message) => (
    <>
      <IncomingMsg message={message} type={type} user={user} />
    </>
  ));
  return (
    <div class="flex-1 overflow-auto" style={{ backgroundColor: "#DAD3CC" }}>
      <div class="py-2 px-3">{roomMessages}</div>
    </div>
  );
}
