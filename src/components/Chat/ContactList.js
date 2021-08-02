import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import ContactItem from './ContactItem';
import SearchBar from './SearchBar';

export default function ContactList({ setRoomId, roomId }) {
  const [query, setQuery] = useState('');

  let chats = useSelector((state) => state.chats.chats);
  let channels = useSelector((state) => state.chats.channels);
  let user = useSelector((state) => state.user.user);
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
        (channel.name.toLowerCase().includes(query) && query.length > 2) ||
        channel.users.map((u) => u.id).includes(user.id)
    )
    .map((channel) => {
      return (
        <ContactItem
          room={channel}
          name={channel.name}
          photo={channel.photo}
          lastMessage={channel.messages[channel.messages.length - 1]}
          setRoomId={setRoomId}
        />
      );
    });
  let notSeenRoom = null;
  chats = chats
    .filter(
      (chat) =>
        chat.name.toLowerCase().includes(query) && chat.type !== 'Channel'
    )
    .map((chat) => {
      let notSeenCount = chat.messages
        .map((message) => {
          let thisCount = message.receivers.filter((receiver) => {
            if (receiver.seen === null && receiver._id == user._id) return true;
            return false;
          });
          return thisCount.length;
        })
        .filter((a) => a).length;
      if (!notSeenRoom && !roomId && notSeenCount === 0 && query === '') {
        notSeenRoom = true;
        setRoomId(chat._id);
      }
      if (notSeenRoom) return;
      return (
        <>
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
            notSeenCount={notSeenCount}
          />
          <hr class="border-0 bg-gray-200 text-gray-200 h-px"></hr>{' '}
        </>
      );
    });
  return (
    <>
      <SearchBar
        setQuery={setQuery}
        placeholder="Search for a conversation or explore channels"
      />

      <div>
        <div class="bg-grey-lighter flex-1 overflow-auto">{chats}</div>
      </div>
      {channels.length > 0 && (
        <>
          {' '}
          <center>- Channels -</center>
          <div>
            <div class="bg-grey-lighter flex-1 overflow-auto">{channels}</div>
          </div>
        </>
      )}
    </>
  );
}
