import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import InputField from './InputField';
import MsgsList from './MsgsList';
import RightHeader from './RightHeader';

export default function Room({ roomId, socket }) {
  let thisRoom = useSelector((state) =>
    state.chats.chats?.find((chat) => chat._id === roomId)
  );
  return roomId ? (
    <>
      <div class="w-2/3 border flex flex-col">
        {/* <!-- Header --> */}
        <RightHeader thisRoom={thisRoom} />
        {/* <!-- Messages --> */}
        <MsgsList messages={thisRoom.messages ?? []} />
        {/* <!-- Input --> */}
        <InputField roomId={roomId} socket={socket} />
      </div>
    </>
  ) : (
    <></>
  );
}
