import React, { useState } from "react";
import { GoCheck } from "react-icons/go";
import { BiCheckDouble } from "react-icons/bi";
import { IoIosArrowDown } from "react-icons/io";

export default function IncomingMsg({ message, type, user }) {
  const [isShown, setIsShown] = useState(false);
  const [menu, setMenu] = useState(false);
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
        {isShown && (
          <span className="float-right" onClick={openMenu}>
            <IoIosArrowDown />
          </span>
        )}
        {menu && (
          <div
            class="float-right origin-top-right absolute  mt-1 w-15 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 divide-y divide-gray-100 focus:outline-none"
            aria-orientation="vertical"
            aria-labelledby="menu-button"
            tabindex="-1"
          >
            <div class="py-1" role="none">
              <a
                href="#"
                class="text-gray-700 block px-4 py-2 text-sm"
                tabindex="-1"
                id="menu-item-0"
              >
                Edit
              </a>
            </div>
          </div>
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
