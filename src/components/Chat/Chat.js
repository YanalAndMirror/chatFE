import React, { useEffect, useRef, useState } from "react";
import ContactList from "./ContactList";
import LeftHeader from "./LeftHeader/LeftHeader";
import { io } from "socket.io-client";
import Room from "./Room";
import { useDispatch, useSelector } from "react-redux";
import Peer from "simple-peer";
import {
  addMessage,
  readMessage,
  seeMessage,
  updateMessage,
} from "../../store/actions/chatActions";
export default function Chat() {
  const user = useSelector((state) => state.user.user);
  const dispatch = useDispatch();
  const [peer, setPeer] = useState(false);
  const [peerRecive, setPeerRecive] = useState(false);
  const [connected, setConnected] = useState(false);
  const [toUser, setToUser] = useState(false);
  const [socket, setSocket] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loading2, setLoading2] = useState(false);
  const [loading3, setLoading3] = useState(false);
  const userVideo = useRef({});
  const [stream, setStream] = useState();

  const initPeer = (userId) => {
    setToUser(userId);
    setPeer(new Peer({ initiator: true, trickle: false, stream: stream }));
  };
  function addMedia(stream) {
    peer.addStream(stream); // <- add streams to peer dynamically
  }
  useEffect(() => {
    if (connected) {
      navigator.mediaDevices
        .getUserMedia({
          audio: true,
        })
        .then(addMedia)
        .catch(() => {});
    }
  }, [connected]);
  useEffect(() => {
    if (peerRecive) {
      peerRecive.on("signal", (data) => {
        socket.emit("peerRecive", { userId: "610048429b996722dc5addc0", data });
      });
      peerRecive.on("stream", (stream) => {
        userVideo.current.srcObject = stream;
      });
      socket.on("startPeer", ({ data }) => {
        peerRecive.signal(data);
      });
    }
  }, [loading3]);

  useEffect(() => {
    if (peer) {
      peer.on("signal", (data) => {
        console.log("here");
        socket.emit("peer", { userId: toUser, data });
      });
      peer.on("stream", (stream) => {
        userVideo.current.srcObject = stream;
      });
      socket.on("reciverPeer", ({ data }) => {
        peer.signal(data);
        if (connected === false) setConnected(true);
      });
    }
  }, [loading2]);
  useEffect(() => {
    navigator.mediaDevices.getUserMedia({ audio: true }).then((stream) => {
      console.log(stream);
      setStream(stream);
      setPeerRecive(new Peer({ trickle: false, stream: stream }));
    });

    setSocket(io("localhost:8000"));
  }, []);
  console.log(peerRecive);
  if (socket && loading === false) {
    setLoading(true);
  }
  if (peer && loading2 === false) {
    setLoading2(true);
  }
  if (peerRecive && loading3 === false) {
    setLoading3(true);
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
        dispatch(addMessage(message.roomId, message.content));
      });
    }
  }, [loading]);
  const [roomId, setRoomId] = useState(false);

  useEffect(() => {
    if (socket && roomId) {
      socket.emit("roomSeen", { userId: user._id, roomId });
    }
  }, [roomId]);
  let chats = useSelector((state) => state.chats.chats);

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
                  <ContactList setRoomId={setRoomId} />
                </div>
                {/* <!-- Right --> */}
                <button onClick={() => initPeer("610048429b996722dc5addc0")}>
                  Call
                </button>
                <button onClick={() => initPeer("6100483d9b996722dc5addbe")}>
                  Call back
                </button>
                {userVideo !== {} && (
                  <video ref={userVideo} autoPlay style={{ width: "600px" }} />
                )}
                {<Room roomId={roomId} socket={socket} />}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
