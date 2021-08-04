import React from "react"; //Not needed

//Assets
import nophoto from "../../assets/no-photo.png";

export default function ContactItem({
  photo,
  name,
  lastMessage,
  setRoomId,
  room,
  notSeenCount,
}) {
  return (
    <div onClick={() => setRoomId(room._id)}>
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
              {lastMessage?.createdAt
                ? new Date().toISOString().substr(0, 10) ===
                  lastMessage.createdAt.toString().substr(0, 10)
                  ? lastMessage.createdAt.toString().substr(11, 5)
                  : lastMessage.createdAt.toString().substr(0, 10)
                : ""}
            </p>
          </div>
          <p class="text-grey-dark mt-1 text-sm">
            {lastMessage
              ? typeof lastMessage.content === "string" || !lastMessage.content
                ? lastMessage.content
                : lastMessage.content.text ?? `[${lastMessage.content.type}]`
              : ""}
            {notSeenCount > 0 && (
              <span class="float-right inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-indigo-100 bg-indigo-700 rounded">
                {notSeenCount}
              </span>
            )}
          </p>
        </div>
      </div>
    </div>
  );
}
