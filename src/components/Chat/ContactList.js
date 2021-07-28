import React, { useState } from "react";
import { useSelector } from "react-redux";
import ContactItem from "./ContactItem";
import SearchBar from "./SearchBar";

export default function ContactList({ setRoomId }) {
  const [query, setQuery] = useState("");

  let chats = useSelector((state) => state.chats.chats);
  let channels = useSelector((state) => state.chats.channels);

  chats.sort((a, b) =>
    a.messages[a.messages.length - 1].createdAt >
    b.messages[b.messages.length - 1].createdAt
      ? -1
      : 1
  );
  channels = channels
    .filter(
      (channel) =>
        channel.name.toLowerCase().includes(query) && query.length > 2
    )
    .map((channel) => (
      <ContactItem
        roomId={channel.id}
        name={channel.name}
        photo={channel.photo}
        lastMessage={
          channel.messages.length > 0
            ? channel.messages[channel.messages.length - 1]
            : ""
        }
        setRoomId={setRoomId}
      />
    ));

  chats = chats
    .filter((chat) => chat.name.toLowerCase().includes(query))
    .map((chat) => (
      <ContactItem
        roomId={chat._id}
        name={chat.name}
        photo={chat.photo}
        lastMessage={
          chat.messages.length > 0
            ? chat.messages[chat.messages.length - 1]
            : ""
        }
        setRoomId={setRoomId}
      />
    ));
  return (
    <>
      <SearchBar setQuery={setQuery} />

      <div>
        <div class="bg-grey-lighter flex-1 overflow-auto">{chats}</div>
      </div>
      <center>- Channels -</center>
      <div>
        <div class="bg-grey-lighter flex-1 overflow-auto">{channels}</div>
      </div>
    </>
  );
}
