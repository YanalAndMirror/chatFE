import React from "react";
import { useSelector } from "react-redux";
import ContactItem from "./ContactItem";

export default function ContactList({ setRoomId }) {
  let chats = useSelector((state) => state.chats.chats);
  console.log(chats);
  chats = chats.map((chat) => (
    <ContactItem
      roomId={chat.roomId}
      name={chat.name}
      lastMessage={chat.messages[chat.messages.length - 1]}
      setRoomId={setRoomId}
    />
  ));
  return (
    <div>
      <div class="bg-grey-lighter flex-1 overflow-auto">{chats}</div>
    </div>
  );
}
