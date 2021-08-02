import React, { useState } from "react";
import { useSelector } from "react-redux";

import { IoMdClose } from "react-icons/io";
import { AiOutlineGif } from "react-icons/ai";
import { ImAttachment } from "react-icons/im";
import { GrEmoji } from "react-icons/gr";
import { MdKeyboardVoice } from "react-icons/md";
import { BsFillImageFill } from "react-icons/bs";
import { FaLocationArrow } from "react-icons/fa";

import Picker from "emoji-picker-react";
import ReactGiphySearchbox from "react-giphy-searchbox";
import instance from "../../store/actions/instance";
import AudioReactRecorder, { RecordState } from "audio-react-recorder";
const CryptoJS = require("crypto-js");

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
  const [voiceRecored, setVoiceRecored] = useState(RecordState.NONE);
  const [voice, setVoice] = useState(false);

  const onEmojiClick = (event, emojiObject) => {
    setInput({ ...input, [roomId]: (input[roomId] ?? "") + emojiObject.emoji });
    setChosenEmoji(false);
  };
  const user = useSelector((state) => state.user.user);
  const encryptMessage = (content) => {
    return CryptoJS.AES.encrypt(
      JSON.stringify(content),
      user.secretKey
    ).toString();
  };
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
      content: encryptMessage(content),
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
      content: encryptMessage(content),
      userId: user.id,
    });
    setChosenGiphy(false);
    setInputReply({ ...inputReply, [roomId]: null });
  };
  const handleSubmitAttachment = async (e, type) => {
    const formData = new FormData();
    formData.append(
      "file",
      e.target?.files[0] ?? new File([e.blob], "voice.wav")
    );
    console.log(e);

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
      content: encryptMessage(content),
      userId: user.id,
    });
    setChosenGiphy(false);
    setInputReply({ ...inputReply, [roomId]: null });
  };
  const handleSubmitLocation = async () => {
    let content = {};
    content.type = "location";
    content.text = "[location]";

    navigator.geolocation.getCurrentPosition(function (position) {
      content.latitude = position.coords.latitude;
      content.longitude = position.coords.longitude;
      socket.emit("chatMessage", {
        roomId,
        content: encryptMessage(content),
        userId: user.id,
      });
    });
  };
  return (
    <div class="bg-grey-lighter px-4 py-4 flex items-center">
      <div
        onClick={() => {
          setChosenEmoji(!chosenEmoji);
          setChosenGiphy(false);
        }}
      >
        <GrEmoji color="#1A237E" size="24px" className="cursor-pointer" />
      </div>{" "}
      <div
        onClick={() => {
          setChosenEmoji(false);
          setChosenGiphy(!chosenGiphy);
        }}
      >
        <AiOutlineGif
          color="#1A237E"
          size="24px"
          className="cursor-pointer ml-1"
        />
      </div>
      <div
        onClick={() => {
          handleSubmitLocation();
        }}
      >
        <FaLocationArrow
          color="#1A237E"
          size="24px"
          className="cursor-pointer ml-1"
        />
      </div>
      <label className="custom-file-upload">
        <input
          style={{ display: "none" }}
          type="file"
          onChange={(e) => {
            handleSubmitAttachment(e, "file");
          }}
        />
        <ImAttachment
          color="#1A237E"
          size="24px"
          className="cursor-pointer ml-1"
        />
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
        <BsFillImageFill
          color="#1A237E"
          size="24px"
          className="cursor-pointer ml-1"
        />
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

          {!voice ? (
            <input
              placeholder="Type a message"
              class="w-full border rounded px-2 py-2"
              type="text"
              value={input[roomId] ?? ""}
              onChange={(e) => setInput({ ...input, [roomId]: e.target.value })}
            />
          ) : (
            <></>
          )}
        </form>
        <AudioReactRecorder
          state={voiceRecored}
          onStop={(e) => handleSubmitAttachment(e, "voice")}
          canvasHeight={voice ? 50 : 0}
          canvasWidth={voice ? 500 : 0}
          backgroundColor="#F3F7F9"
          foregroundColor="#1A237E"
        />
        <div></div>
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
        <MdKeyboardVoice
          color="#1A237E"
          size="24px"
          className="cursor-pointer"
          onClick={() => {
            if (voice) {
              setVoiceRecored(RecordState.STOP);
              setVoice(false);
            } else {
              setVoiceRecored(RecordState.START);
              setVoice(true);
            }
          }}
        />
      </div>
    </div>
  );
}
