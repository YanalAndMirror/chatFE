import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import ContactItem from './ContactItem';
import SearchBar from './SearchBar';

export default function ContactList({ setRoomId }) {
  const [query, setQuery] = useState('');

  let chats = useSelector((state) => state.chats.chats);
  let channels = useSelector((state) => state.chats.channels);

  chats.sort((a, b) => {
    // if no messages in both rooms then order by room creation
    if (
      !a.messages[a.messages.length - 1] &&
      !b.messages[b.messages.length - 1]
    )
      return a.createdAt > b.createdAt ? -1 : 1;
    // if room a have no messages compare room a creation with last message from b
    if (!a.messages[a.messages.length - 1])
      return a.createdAt > b.messages[b.messages.length - 1].createdAt ? -1 : 1;
    // if room b have no messages compare room b creation with last message from a
    if (!b.messages[b.messages.length - 1])
      return a.messages[a.messages.length - 1].createdAt > b.createdAt ? -1 : 1;
    // compare last messages from both rooms
    return a.messages[a.messages.length - 1].createdAt >
      b.messages[b.messages.length - 1].createdAt
      ? -1
      : 1;
  });
  channels = channels
    .filter(
      (channel) =>
        channel.name.toLowerCase().includes(query) && query.length > 2
    )
    .map((channel) => (
      <ContactItem
        room={channel}
        name={channel.name}
        photo={channel.photo}
        lastMessage={
          channel.messages.length > 0
            ? channel.messages[channel.messages.length - 1]
            : ''
        }
        setRoomId={setRoomId}
      />
    ));

  chats = chats
    .filter((chat) => chat.name.toLowerCase().includes(query))
    .map((chat) => (
      <ContactItem
        room={chat}
        name={chat.name}
        photo={chat.photo}
        lastMessage={
          chat.messages.length > 0
            ? chat.messages[chat.messages.length - 1]
            : ''
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
