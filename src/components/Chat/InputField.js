import React, { useState } from "react";
import { useSelector } from "react-redux";

import { IoMdClose } from "react-icons/io";
import { AiOutlineGif } from "react-icons/ai";
import { GrAttachment } from "react-icons/gr";
import { BsFillImageFill } from "react-icons/bs";

import Picker from "emoji-picker-react";
import ReactGiphySearchbox from "react-giphy-searchbox";
import instance from "../../store/actions/instance";

export default function InputField({
  roomId,
  socket,
  input,
  setInput,
  setInputReply,
  inputReply,
}) {
  const [chosenEmoji, setChosenEmoji] = useState(null);
  const [chosenGiphy, setChosenGiphy] = useState(null);
  const onEmojiClick = (event, emojiObject) => {
    setInput({ ...input, [roomId]: (input[roomId] ?? "") + emojiObject.emoji });
    setChosenEmoji(false);
  };
  const user = useSelector((state) => state.user.user);
  const handleSubmit = (e) => {
    e.preventDefault();
    if (input[roomId] === "") return;
    let content = {};

    content.text = input[roomId];
    content.type = "string";
    if (inputReply[roomId]) {
      content.to = inputReply[roomId];
    }
    socket.emit("chatMessage", {
      roomId,
      content: content,
      userId: user.id,
    });
    setInput({ ...input, [roomId]: "" });
    setInputReply({ ...inputReply, [roomId]: null });
  };
  const handleSubmitGiphy = (e) => {
    let content = {};
    content.text = "[GIF]";
    content.type = "giphy";
    content.url = e.embed_url;
    console.log(e);
    if (inputReply[roomId]) {
      content.to = inputReply[roomId];
    }
    socket.emit("chatMessage", {
      roomId,
      content: content,
      userId: user.id,
    });
    setChosenGiphy(false);
    setInputReply({ ...inputReply, [roomId]: null });
  };
  const handleSubmitAttachment = async (e, type) => {
    const formData = new FormData();
    formData.append("file", e.target.files[0]);
    const res = await instance.post(`/api/v1/rooms/attachment`, formData);

    let content = {};
    content.text = "[" + type + "]";
    content.type = type;
    content.url = res.data;
    if (inputReply[roomId]) {
      content.to = inputReply[roomId];
    }
    socket.emit("chatMessage", {
      roomId,
      content: content,
      userId: user.id,
    });
    setChosenGiphy(false);
    setInputReply({ ...inputReply, [roomId]: null });
  };
  return (
    <div class="bg-grey-lighter px-4 py-4 flex items-center">
      <div
        onClick={() => {
          setChosenEmoji(!chosenEmoji);
          setChosenGiphy(false);
        }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          width="24"
          height="24"
        >
          <path
            opacity=".45"
            fill="#263238"
            d="M9.153 11.603c.795 0 1.439-.879 1.439-1.962s-.644-1.962-1.439-1.962-1.439.879-1.439 1.962.644 1.962 1.439 1.962zm-3.204 1.362c-.026-.307-.131 5.218 6.063 5.551 6.066-.25 6.066-5.551 6.066-5.551-6.078 1.416-12.129 0-12.129 0zm11.363 1.108s-.669 1.959-5.051 1.959c-3.505 0-5.388-1.164-5.607-1.959 0 0 5.912 1.055 10.658 0zM11.804 1.011C5.609 1.011.978 6.033.978 12.228s4.826 10.761 11.021 10.761S23.02 18.423 23.02 12.228c.001-6.195-5.021-11.217-11.216-11.217zM12 21.354c-5.273 0-9.381-3.886-9.381-9.159s3.942-9.548 9.215-9.548 9.548 4.275 9.548 9.548c-.001 5.272-4.109 9.159-9.382 9.159zm3.108-9.751c.795 0 1.439-.879 1.439-1.962s-.644-1.962-1.439-1.962-1.439.879-1.439 1.962.644 1.962 1.439 1.962z"
          ></path>
        </svg>
      </div>{" "}
      <div
        onClick={() => {
          setChosenEmoji(false);
          setChosenGiphy(!chosenGiphy);
        }}
      >
        <AiOutlineGif size={30} />
      </div>
      <label className="custom-file-upload">
        <input
          style={{ display: "none" }}
          type="file"
          onChange={(e) => {
            handleSubmitAttachment(e, "file");
          }}
        />
        <GrAttachment />
      </label>
      <label className="custom-file-upload">
        <input
          accept="image/*"
          style={{ display: "none" }}
          type="file"
          onChange={(e) => {
            handleSubmitAttachment(e, "image");
          }}
        />
        <BsFillImageFill />
      </label>
      <div class="flex-1 mx-4">
        <form onSubmit={handleSubmit}>
          {inputReply[roomId] && (
            <div
              class="block text-sm text-left  bg-gray-100 border flex-auto border-green-400 h-12  items-center p-1  rounded-sm my-2 "
              role="alert"
            >
              <div
                class="float-right text-2xl text-green-400 cursor-pointer"
                onClick={() => setInputReply({ ...inputReply, [roomId]: null })}
              >
                <IoMdClose />
              </div>
              <p class="text-sm text-teal">
                <b>
                  {inputReply[roomId].user.userName &&
                  inputReply[roomId].user.userName !== ""
                    ? inputReply[roomId].user.userName
                    : inputReply[roomId].user.phoneNumber}
                </b>
              </p>
              <p class="text-sm mt-1">
                {inputReply[roomId].content.text ?? inputReply[roomId].content}
              </p>
            </div>
          )}
          {chosenEmoji && (
            <div class="absolute bottom-20 left-15">
              <Picker onEmojiClick={onEmojiClick} />
            </div>
          )}

          <input
            placeholder="Type a message"
            class="w-full border rounded px-2 py-2"
            type="text"
            value={input[roomId] ?? ""}
            onChange={(e) => setInput({ ...input, [roomId]: e.target.value })}
          />
        </form>
      </div>
      {chosenGiphy && (
        <div class="absolute bottom-20 left-15 bg-grey-lighter">
          <ReactGiphySearchbox
            apiKey="comDBd9jh2uM1yBnCT3nXEloN1ox4CrQ" // Required: get your on https://developers.giphy.com
            onSelect={handleSubmitGiphy}
          />
        </div>
      )}
      <div>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          width="24"
          height="24"
        >
          <path
            fill="#263238"
            fill-opacity=".45"
            d="M11.999 14.942c2.001 0 3.531-1.53 3.531-3.531V4.35c0-2.001-1.53-3.531-3.531-3.531S8.469 2.35 8.469 4.35v7.061c0 2.001 1.53 3.531 3.53 3.531zm6.238-3.53c0 3.531-2.942 6.002-6.237 6.002s-6.237-2.471-6.237-6.002H3.761c0 4.001 3.178 7.297 7.061 7.885v3.884h2.354v-3.884c3.884-.588 7.061-3.884 7.061-7.885h-2z"
          ></path>
        </svg>
      </div>
    </div>
  );
}
