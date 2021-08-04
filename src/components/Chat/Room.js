import React, { useEffect, useRef, useState } from "react"; //Importing React is not needed, remove unused import
import { useDispatch, useSelector } from "react-redux";

//Components
import InputField from "./InputField";
import MessageModel from "./MessageModel";
import MsgsList from "./MsgsList";
import RightHeader from "./RightHeader";
import VideoCallModal from "./VideoCallModal";

//Actions
import { addUserToGroup } from "../../store/actions/chatActions";

export default function Room({ roomId, socket, play, stop }) {
  const dispatch = useDispatch();

  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState({});
  const [inputReply, setInputReply] = useState({});
  const [query, setQuery] = useState("");
  const userVideo = useRef({});

  let channels = useSelector((state) => state.chats.channels);
  const user = useSelector((state) => state.user.user);
  let thisRoom = useSelector((state) =>
    state.chats.chats?.find((chat) => chat._id === roomId)
  );

  if (!thisRoom || thisRoom.type === "Channel") {
    thisRoom = channels?.find((chat) => chat._id === roomId);
  }

  return roomId && thisRoom ? (
    <>
      <MessageModel socket={socket} isOpen={isOpen} setIsOpen={setIsOpen} />
      <div class="w-2/3 border flex flex-col">
        {/* <!-- Header --> */}
        <RightHeader
          thisRoom={thisRoom}
          socket={socket}
          userVideo={userVideo}
          roomId={roomId}
          play={play}
          stop={stop}
          setQuery={setQuery}
        />
        {/* <!-- Messages --> */}
        <MsgsList
          roomId={roomId}
          messages={thisRoom.messages.filter((msg) =>
            msg.content.text.includes(query)
          )}
          type={thisRoom.type}
          user={user}
          setIsOpen={setIsOpen}
          setInputReply={setInputReply}
          inputReply={inputReply}
          socket={socket}
        />
        {/* <!-- Input --> */}
        {thisRoom.type === "Channel" && thisRoom.admin === user.id && (
          <InputField
            input={input}
            setInput={setInput}
            roomId={roomId}
            socket={socket}
            setInputReply={setInputReply}
            inputReply={inputReply}
          />
        )}
        {thisRoom.type === "Channel" &&
          !thisRoom.users.find((u) => u.id === user.id) && (
            <center
              onClick={() => dispatch(addUserToGroup(roomId, user))}
              class="bg-indigo-600 hover:bg-blue-dark text-white font-bold py-3 px-6 rounded cursor-pointer"
            >
              Join
            </center>
          )}
        {userVideo !== {} && (
          <>
            <VideoCallModal
              userVideo={userVideo}
              _isOpen={false}
              socket={socket}
              roomId={roomId}
            />
          </>
        )}
        {thisRoom.type !== "Channel" && (
          <InputField
            input={input}
            setInput={setInput}
            roomId={roomId}
            socket={socket}
            setInputReply={setInputReply}
            inputReply={inputReply}
          />
        )}
      </div>
    </>
  ) : (
    <></>
  );
}
