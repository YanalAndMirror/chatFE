import Peer from "simple-peer";

import { MdCall } from "react-icons/md";
import { BsFillCameraVideoFill } from "react-icons/bs";
import { ImPhone } from "react-icons/im";
import { ImPhoneHangUp } from "react-icons/im";
import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";

import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import VideoCallModal from "./VideoCallModal";

export default function Call({ socket, userVideo, membersList, roomId, play }) {
  const user = useSelector((state) => state.user.user);
  let [isOpen, setIsOpen] = useState(false);

  function closeModal() {
    setIsOpen(false);
  }

  function openModal() {
    setIsOpen(true);
  }

  const callUser = (touser) => {
    socket.emit("call", { userId: touser._id, sender: user });
    socket.on("callAccept", (data) => {
      console.log(data);
      startCall(touser._id);
    });
  };
  useEffect(() => {
    //
    socket.on("call", ({ sender }) => {
      play();
      toast(
        <center>
          <ImPhone
            onClick={() => {
              acceptCall(sender._id);
              socket.emit("callAccept", { userId: sender._id });
            }}
            color="#27EE20"
            size="24px"
            className="cursor-pointer mr-4 inline-block"
          />{" "}
          {sender.userName + " Is Calling" ??
            sender.phoneNumber + " Is Calling"}
          <ImPhoneHangUp
            onClick={() => {}}
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
          closeModal();
        });
      });
  };
  const acceptCall = (userId) => {
    setIsOpen(true);
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
          closeModal();
        });
      });
  };
  return (
    <>
      {membersList.length === 2 && (
        <>
          <div>
            <BsFillCameraVideoFill
              onClick={() => {
                callUser(membersList.find((member) => member._id !== user.id));
                setIsOpen(true);
              }}
              color="#1A237E"
              size="24px"
              className="cursor-pointer ml-4"
            />
          </div>
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
                      Video Call
                    </Dialog.Title>
                    <video
                      ref={userVideo}
                      autoPlay
                      style={{ width: "600px" }}
                    />

                    <div className="mt-4">
                      <button
                        type="button"
                        className="inline-flex justify-center px-4 py-2 text-sm font-medium text-blue-900 bg-blue-100 border border-transparent rounded-md hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500"
                        onClick={() => socket.emit("endCall", { roomId })}
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
