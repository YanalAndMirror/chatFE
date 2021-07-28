import React from "react";
import { GoCheck } from "react-icons/go";
import { BiCheckDouble } from "react-icons/bi";

export default function IncomingMsg({ message, type, user }) {
  let text = message.content;
  let sameUser = user._id === message.user._id;
  let seenBy = message.receivers.filter((receiver) => receiver.seen !== null);
  let receivedBy = message.receivers.filter(
    (receiver) => receiver.received !== null
  );
  let seenStatus = "";
  if (sameUser) {
    if (seenBy.length === message.receivers.length) {
      seenStatus = (
        <div className="text-blue-500 display: inline-flex">
          <BiCheckDouble />
        </div>
      );
    } else if (receivedBy.length !== 0) {
      seenStatus = (
        <div className="display: inline-flex">
          <BiCheckDouble />
        </div>
      );
    } else {
      seenStatus = (
        <div className="display: inline-flex">
          <GoCheck />
        </div>
      );
    }
  }
  return (
    <div class={sameUser ? "flex justify-end mb-2" : ""}>
      <div
        class={
          " m-1.5 w-auto md:w-" +
          (1 + Math.min(Math.floor(text.length / 4), 6)) +
          "/12 right-0  rounded py-1 px-3"
        }
        style={{ backgroundColor: sameUser ? "#E2F7CB" : "#F2F2F2" }}
      >
        {type !== "Private" && !sameUser ? (
          <p class="text-sm text-teal">
            {message.user.userName === ""
              ? message.user.phoneNumber
              : message.user.userName}
            :{" "}
          </p>
        ) : (
          ""
        )}
        <p class="text-sm mt-1">{text}</p>
        <p class="text-right text-xs text-grey-dark mt-1">
          {new Date(message.createdAt).toString().substr(15, 6) + " "}
          {seenStatus}
        </p>
      </div>
    </div>
  );
}
