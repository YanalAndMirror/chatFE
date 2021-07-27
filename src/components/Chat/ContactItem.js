import React from "react";

export default function ContactItem({ name, lastMessage, setRoomId, roomId }) {
  return (
    <div onClick={() => setRoomId(roomId)}>
      <div class="px-3 flex items-center hover:bg-grey-light cursor-pointer">
        <div>
          <img
            class="h-12 w-12 rounded-full"
            src="https://darrenjameseeley.files.wordpress.com/2014/09/expendables3.jpeg"
          />
        </div>
        <div class="ml-4 flex-1 border-b border-grey-lighter py-4">
          <div class="flex items-bottom justify-between">
            <p class="text-grey-darkest">{name}</p>
            <p class="text-xs text-grey-darkest">12:45 pm</p>
          </div>
          <p class="text-grey-dark mt-1 text-sm">{lastMessage}</p>
        </div>
      </div>
    </div>
  );
}