import React, { useEffect, useRef, useState } from "react";
import ContactList from "./ContactList";
import LeftHeader from "./LeftHeader/LeftHeader";
import { io } from "socket.io-client";
import Room from "./Room";
import { useDispatch, useSelector } from "react-redux";
import {
  addMessage,
  fetchRoom,
  readMessage,
  seeMessage,
  updateMessage,
} from "../../store/actions/chatActions";
import useSound from "use-sound";

import ringtone from "../../assets/ringtone.mp3";
export default function Chat() {
  const [play, { stop }] = useSound(ringtone);

  const user = useSelector((state) => state.user.user);
  const dispatch = useDispatch();
  const [socket, setSocket] = useState(false);
  const [loading, setLoading] = useState(false);
  const userVideo = useRef(null);
  let chats = useSelector((state) => state.chats.chats);

  useEffect(() => {
    setSocket(io("localhost:8000"));
  }, []);
  if (chats && socket && loading === false) {
    setLoading(true);
  }
  useEffect(() => {
    if (socket) {
      socket.emit("startSession", { userId: user._id });
      socket.on("messageUpdate", ({ roomId, newMessage }) => {
        dispatch(updateMessage(roomId, newMessage));
      });
      socket.on("roomSeen", ({ userId, roomId, time }) => {
        dispatch(seeMessage(roomId, userId, time));
      });
      socket.on("messageRead", ({ userId, roomIds, time }) => {
        dispatch(readMessage(roomIds, userId, time));
      });
      socket.on("message", (message) => {
        if (chats.find((chat) => chat._id === message.roomId))
          dispatch(addMessage(message.roomId, message.content));
        else dispatch(fetchRoom(user._id));
      });
    }
  }, [loading]);
  const [roomId, setRoomId] = useState(false);
  return (
    <>
      {chats && (
        <div>
          <div class="w-full h-32" style={{ backgroundColor: "#312E81" }}></div>

          <div class="container mx-auto" style={{ marginTop: "-128px" }}>
            <div class="py-6 h-screen">
              <div class="flex border border-grey rounded shadow-lg h-full">
                {/* <!-- Left --> */}
                <div class="w-1/3 border flex flex-col">
                  <LeftHeader socket={socket} />
                  <ContactList setRoomId={setRoomId} roomId={roomId} />
                </div>
                <Room
                  roomId={roomId}
                  socket={socket}
                  play={play}
                  stop={stop}
                  userVideo={userVideo}
                />
                )
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
