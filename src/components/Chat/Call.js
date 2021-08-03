import Peer from "simple-peer";

import { MdCall } from "react-icons/md";
import { BsFillCameraVideoFill } from "react-icons/bs";
import { ImPhone } from "react-icons/im";
import { ImPhoneHangUp } from "react-icons/im";
import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useRef } from "react";

import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Call({
  socket,
  userVideo,
  roomType,
  membersList,
  roomId,
  play,
  stop,
}) {
  const user = useSelector((state) => state.user.user);
  let [isOpen, setIsOpen] = useState(false);
  const userVideo2 = useRef(null);
  function closeModal() {
    setIsOpen(false);
  }

  function openModal() {
    setIsOpen(true);
  }

  const callUser = (touser, video) => {
    socket.emit("call", { userId: touser._id, sender: user, video });
    socket.off("callAccept");
    socket.off("callDecline");

    socket.on("callAccept", (data) => {
      console.log(data);
      startCall(touser._id, video);
    });
    socket.on("callDecline", (data) => {
      console.log(data);
      closeModal();
    });
  };
  useEffect(() => {
    //
    socket.off("call");
    socket.on("call", ({ sender, video }) => {
      play();
      toast(
        <center>
          <ImPhone
            onClick={() => {
              acceptCall(sender._id, video);
              socket.emit("callAccept", { userId: sender._id });
              stop();
            }}
            color="#27EE20"
            size="24px"
            className="cursor-pointer mr-4 inline-block"
          />{" "}
          {sender.userName + " Is Calling" ??
            sender.phoneNumber + " Is Calling"}
          <ImPhoneHangUp
            onClick={() => {
              socket.emit("callDecline", { userId: sender._id });
              toast.dismiss();
              stop();
            }}
            color="#E90A0A"
            size="24px"
            className="cursor-pointer ml-4 inline-block"
          />
        </center>,
        {
          position: "bottom-center",
          autoClose: false,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        }
      );
    });
  }, []);
  const startCall = (userId, video) => {
    navigator.mediaDevices
      .getUserMedia({
        audio: true,
        video: video,
      })
      .then((stream) => {
        const peer = new Peer({
          initiator: true,
          trickle: false,
          stream: stream,
        });
        console.log(stream.getTracks());
        peer.on("signal", (data) => {
          socket.emit("peer", { userId, data });
        });
        peer.on("stream", (comingStream) => {
          userVideo2.current.srcObject = stream;
          userVideo.current.srcObject = comingStream;
        });
        socket.on("reciverPeer", ({ data }) => {
          if (peer.readable) peer.signal(data);
        });
        socket.on("peerEnd", ({ data }) => {
          socket.off("callAccept");
          socket.off("reciverPeer");
          socket.off("startPeer");
          socket.off("peerEnd");
          socket.off("callDecline");

          peer.destroy();
          stream.getTracks().forEach((x) => x.stop());
          closeModal();
        });
      });
  };

  const acceptCall = (userId, video) => {
    setIsOpen(true);
    navigator.mediaDevices
      .getUserMedia({
        video: video,
        audio: true,
      })
      .then((stream) => {
        const peer = new Peer({ trickle: false, stream: stream });
        peer.on("signal", (data) => {
          socket.emit("peerRecive", { userId, data });
        });
        peer.on("stream", (comingStream) => {
          userVideo2.current.srcObject = stream;
          userVideo.current.srcObject = comingStream;
        });
        socket.on("startPeer", ({ data }) => {
          console.log(peer);
          if (peer.readable) peer.signal(data);
        });
        socket.on("peerEnd", ({ data }) => {
          socket.off("callAccept");
          socket.off("reciverPeer");
          socket.off("startPeer");
          socket.off("peerEnd");
          socket.off("callDecline");
          peer.destroy();
          stream.getTracks().forEach((x) => x.stop());
          closeModal();
        });
      });
  };
  return (
    <>
      {roomType === "Private" && (
        <>
          <BsFillCameraVideoFill
            onClick={() => {
              callUser(
                membersList.find((member) => member._id !== user.id),
                true
              );
              setIsOpen(true);
            }}
            color="#1A237E"
            size="24px"
            className="cursor-pointer ml-4"
          />
          <MdCall
            onClick={() => {
              callUser(membersList.find((member) => member._id !== user.id));
              setIsOpen(true);
            }}
            color="#1A237E"
            size="24px"
            className="cursor-pointer ml-4"
          />
          <ToastContainer
            position="bottom-center"
            autoClose={false}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
          />
          <Transition appear show={isOpen} as={Fragment}>
            <Dialog
              as="div"
              className="fixed inset-0 z-10 overflow-y-auto"
              onClose={() => {}}
            >
              <div className="min-h-screen px-4 text-center">
                <Transition.Child
                  as={Fragment}
                  enter="ease-out duration-300"
                  enterFrom="opacity-0"
                  enterTo="opacity-100"
                  leave="ease-in duration-200"
                  leaveFrom="opacity-100"
                  leaveTo="opacity-0"
                >
                  <Dialog.Overlay className="fixed inset-0" />
                </Transition.Child>

                {/* This element is to trick the browser into centering the modal contents. */}
                <span
                  className="inline-block h-screen align-middle"
                  aria-hidden="true"
                >
                  &#8203;
                </span>
                <Transition.Child
                  as={Fragment}
                  enter="ease-out duration-300"
                  enterFrom="opacity-0 scale-95"
                  enterTo="opacity-100 scale-100"
                  leave="ease-in duration-200"
                  leaveFrom="opacity-100 scale-100"
                  leaveTo="opacity-0 scale-95"
                >
                  <div className="inline-block w-full max-w-md p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl">
                    <Dialog.Title
                      as="h3"
                      className="text-lg font-medium leading-6 text-gray-900"
                    >
                      Call
                    </Dialog.Title>
                    <video
                      ref={userVideo}
                      autoPlay
                      style={{ width: "600px" }}
                    />
                    <center>
                      <video
                        muted
                        ref={userVideo2}
                        autoPlay
                        style={{ width: "150px" }}
                      />
                    </center>

                    <div className="mt-4">
                      <button
                        type="button"
                        className="inline-flex justify-center px-4 py-2 text-sm font-medium text-blue-900 bg-blue-100 border border-transparent rounded-md hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500"
                        onClick={() => {
                          socket.emit("endCall", { roomId });
                          closeModal();
                        }}
                      >
                        End Call
                      </button>
                    </div>
                  </div>
                </Transition.Child>
              </div>
            </Dialog>
          </Transition>
        </>
      )}
    </>
  );
}
