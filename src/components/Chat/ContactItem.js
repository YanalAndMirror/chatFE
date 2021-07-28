import React from "react";
import nophoto from "../../assets/no-photo.png";

export default function ContactItem({
  photo,
  name,
  lastMessage,
  setRoomId,
  roomId,
}) {
  return (
    <div onClick={() => setRoomId(roomId)}>
      <div class="px-3 flex items-center hover:bg-grey-light cursor-pointer">
        <div>
          <img
            class="h-12 w-12 rounded-full"
            src={photo === "no-photo.jpg" ? nophoto : photo}
          />
        </div>
        <div class="ml-4 flex-1 border-b border-grey-lighter py-4">
          <div class="flex items-bottom justify-between">
            <p class="text-grey-darkest">{name}</p>
            <p class="text-xs text-grey-darkest">
              {lastMessage.createdAt
                ? new Date(lastMessage.createdAt).toString().substr(15, 6)
                : ""}
            </p>
          </div>
          <p class="text-grey-dark mt-1 text-sm">{lastMessage.content}</p>
        </div>
      </div>
    </div>
  );
}
