import React, { useState } from "react";
import { GoCheck } from "react-icons/go";
import { BiCheckDouble } from "react-icons/bi";
import { IoIosArrowDown } from "react-icons/io";
import { MdNotInterested } from "react-icons/md";

import { useDispatch } from "react-redux";
import { deleteMessage } from "../../store/actions/chatActions";

import axios from "axios";
import fileDownload from "js-file-download";

export default function IncomingMsg({
  message,
  type,
  user,
  setIsOpen,
  roomId,
  setInputReply,
  inputReply,
}) {
  const dispatch = useDispatch();
  const [isShown, setIsShown] = useState(false);
  const [menu, setMenu] = useState(false);
  // Get message text
  let text;
  let messageType;
  const handleDownload = (url, filename) => {
    axios
      .get(url, {
        responseType: "blob",
      })
      .then((res) => {
        fileDownload(res.data, filename);
      });
  };
  if (message.content.type) {
    messageType = message.content.type;
  } else {
    messageType = "string";
  }
  if (messageType === "string") {
    text = message.content.text;
  } else if (messageType === "deleted") {
    text = (
      <il class="text-gray-500">
        <div className="inline-flex">
          <MdNotInterested />
        </div>{" "}
        This message was deleted
      </il>
    );
  } else if (messageType === "giphy") {
    text = (
      <iframe
        src={message.content.url}
        width="300"
        height="150"
        frameBorder="0"
      ></iframe>
    );
  } else if (messageType === "image") {
    text = (
      <img src={message.content.url} class="object-contain h-48 w-full ..." />
    );
  } else if (messageType === "file") {
    let name = message.content.url.split("/");
    name = name[name.length - 1];
    if (name.substr(-4) === ".mp4") {
      text = (
        <video width="400" controls>
          <source src={message.content.url} type="video/mp4" />
          Your browser does not support HTML video.
        </video>
      );
    } else
      text = (
        <center>
          <button
            class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full"
            onClick={() => {
              handleDownload(message.content.url, name);
            }}
          >
            Download {name}
          </button>
        </center>
      );
  } else if (messageType === "voice") {
    text = (
      <audio controls src={message.content.url}>
        Your browser does not support the
        <code>audio</code> element.
      </audio>
    );
  } else {
    text = message.content.text;
  }

  // Check if sender is the user
  let sameUser = user._id === message.user._id;

  // Check who saw the message from the receivers
  let seenBy = message.receivers.filter((receiver) => receiver.seen !== null);

  // Check who recived the message from receivers
  let receivedBy = message.receivers.filter(
    (receiver) => receiver.received !== null
  );

  // Set Seen check based on seenBy/recivedBy;
  let seenStatus = "";
  if (sameUser) {
    if (seenBy.length === message.receivers.length) {
      seenStatus = (
        <div className="text-blue-500 inline-flex">
          <BiCheckDouble />
        </div>
      );
    } else if (receivedBy.length !== 0) {
      seenStatus = (
        <div className="inline-flex">
          <BiCheckDouble />
        </div>
      );
    } else {
      seenStatus = (
        <div className="inline-flex">
          <GoCheck />
        </div>
      );
    }
  }

  // Dropdown menu
  const myMenu = true;
  const openMenu = () => {
    setMenu(true);
    window.removeEventListener("mousedown", closeMenu);
    window.addEventListener("mousedown", closeMenu);
  };
  const closeMenu = () => {
    if (myMenu === true) {
      setIsShown(false);
      setMenu(false);

      window.removeEventListener("mousedown", closeMenu);
    } else {
      myMenu = false;
    }
  };
  return (
    <div class={sameUser ? "flex justify-end mb-2" : ""}>
      <div
        onMouseEnter={() => setIsShown(true)}
        onMouseLeave={() => (menu ? "" : setIsShown(false))}
        class={
          " m-1.5 w-auto md:w-" +
          (1 +
            Math.min(
              Math.floor((isNaN(text.length) ? 16 : text.length) / 4),
              6
            )) +
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
        {messageType !== "deleted" && isShown && (
          <span className="float-right cursor-pointer" onClick={openMenu}>
            <IoIosArrowDown />
          </span>
        )}
        {menu && (
          <div
            class="float-right origin-top-right relative mt-1 w-15 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 divide-y divide-gray-100 focus:outline-none"
            aria-orientation="vertical"
            aria-labelledby="menu-button"
            tabindex="-1"
          >
            <div class="py-1" role="none">
              <span
                onMouseDown={() =>
                  setIsOpen({ roomId, message, text, type: "forward" })
                }
                class="text-gray-700 block px-4 py-2 text-sm cursor-pointer"
                tabindex="-1"
              >
                Forward
              </span>
              <span
                onMouseDown={() =>
                  setInputReply({ ...inputReply, [roomId]: message })
                }
                class="text-gray-700 block px-4 py-2 text-sm cursor-pointer"
                tabindex="-1"
              >
                Reply
              </span>
              {sameUser && messageType === "string" && (
                <span
                  onMouseDown={() =>
                    setIsOpen({ roomId, message, text, type: "Edit" })
                  }
                  class="text-gray-700 block px-4 py-2 text-sm cursor-pointer"
                  tabindex="-1"
                >
                  Edit
                </span>
              )}
              <span
                onMouseDown={() =>
                  dispatch(deleteMessage(user._id, message._id, roomId))
                }
                class="text-gray-700 block px-4 py-2 text-sm cursor-pointer"
                tabindex="-1"
              >
                Delete
              </span>
              {sameUser && (
                <span
                  onMouseDown={() => {
                    setIsOpen({ roomId, message, text, type: "DeleteAll" });
                  }}
                  class="text-gray-700 block px-4 py-2 text-sm cursor-pointer"
                  tabindex="-1"
                >
                  Delete for All
                </span>
              )}
            </div>
          </div>
        )}
        {message.content.to && (
          <p class="text-sm mt-1 text-gray-400 px-2 py-1">
            {message.content.to.content.text ?? message.content.to.content}
          </p>
        )}
        <p class="text-sm mt-1">{text}</p>

        <p class="text-right text-xs text-grey-dark mt-1">
          {messageType === "edited" ? "Edited" : ""}
          {new Date(message.createdAt).toString().substr(15, 6) + " "}
          {seenStatus}
        </p>
      </div>
    </div>
  );
}
