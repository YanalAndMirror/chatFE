import Peer from "simple-peer";

import { MdCall } from "react-icons/md";
import { BsFillCameraVideoFill } from "react-icons/bs";
import { useSelector } from "react-redux";
import { useEffect } from "react";
import { confirmAlert } from "react-confirm-alert"; // Import

export default function Call({ socket, userVideo, membersList }) {
  const user = useSelector((state) => state.user.user);
  const callUser = (touser) => {
    socket.emit("call", { userId: touser._id, sender: user });
    socket.on("callAccept", (data) => {
      console.log(data);
      startCall(touser._id);
    });
  };
  useEffect(() => {
    socket.on("call", ({ sender }) => {
      console.log(sender);
      confirmAlert({
        title: "Call",
        message: sender.userName ?? sender.phoneNumber + " is Calling you",
        buttons: [
          {
            label: "Accept",
            onClick: () => {
              acceptCall(sender._id);
              socket.emit("callAccept", { userId: sender._id });
            },
          },
          {
            label: "Decline",
            onClick: () => alert("Click No"),
          },
        ],
      });
    });
  }, []);
  const startCall = (userId) => {
    navigator.mediaDevices
      .getUserMedia({
        video: true,
        audio: true,
      })
      .then((stream) => {
        const peer = new Peer({
          initiator: true,
          trickle: false,
          stream: stream,
        });
        peer.on("signal", (data) => {
          socket.emit("peer", { userId, data });
        });
        peer.on("stream", (stream) => {
          userVideo.current.srcObject = stream;
        });
        socket.on("reciverPeer", ({ data }) => {
          peer.signal(data);
          console.log("success");
        });
        socket.on("peerEnd", ({ data }) => {
          peer.destroy();
        });
      });
  };
  const acceptCall = (userId) => {
    navigator.mediaDevices
      .getUserMedia({
        video: true,
        audio: true,
      })
      .then((stream) => {
        const peer = new Peer({ trickle: false, stream: stream });
        peer.on("signal", (data) => {
          socket.emit("peerRecive", { userId, data });
        });
        peer.on("stream", (stream) => {
          userVideo.current.srcObject = stream;
        });
        socket.on("startPeer", ({ data }) => {
          peer.signal(data);
        });
        socket.on("peerEnd", ({ data }) => {
          peer.destroy();
        });
      });
  };
  return (
    <>
      {membersList.length === 2 && (
        //   <div>
        //     <MdCall
        //       //   onClick={() => {
        //       //     startCall("610048429b996722dc5addc0");
        //       //   }}
        //       onClick={() => {
        //         callUser();
        //       }}
        //       color="#1A237E"
        //       size="24px"
        //       className="cursor-pointer ml-4"
        //     />
        //   </div>
        <div>
          <BsFillCameraVideoFill
            //   onClick={() => {
            //     acceptCall("6100483d9b996722dc5addbe");
            //   }}
            onClick={() => {
              callUser(membersList.find((member) => member._id !== user.id));
            }}
            color="#1A237E"
            size="24px"
            className="cursor-pointer ml-4"
          />
        </div>
      )}
    </>
  );
}
