import React, { useEffect, useRef, useState, Fragment } from "react";
import { MdCall } from "react-icons/md";
import { Dialog, Transition } from "@headlessui/react";
import Peer from "simple-peer";
import io from "socket.io-client";
import { useSelector } from "react-redux";
import "../../App.css";
const socket = io.connect("localhost:8000");
export default function VoiceCall() {
  const user = useSelector((state) => state.user.user);

  const [me, setMe] = useState("");
  const [stream, setStream] = useState();
  const [receivingCall, setReceivingCall] = useState(false);
  const [caller, setCaller] = useState("");
  const [callerSignal, setCallerSignal] = useState();
  const [callAccepted, setCallAccepted] = useState(false);
  const [idToCall, setIdToCall] = useState("");
  const [callEnded, setCallEnded] = useState(false);
  const [name, setName] = useState("");
  let [isOpen, setIsOpen] = useState(false);

  const myVideo = useRef(null);
  const userVideo = useRef(null);
  const connectionRef = useRef(null);

  function closeModal() {
    setIsOpen(false);
  }

  function openModal() {
    setIsOpen(true);
  }

  useEffect(() => {
    const getUserMedia = async () => {
      try {
        navigator.mediaDevices.getUserMedia({ audio: true }).then((stream) => {
          setStream(stream);
          myVideo.current = {};
          myVideo.current.srcObject = stream;
        });
      } catch (error) {
        console.log(error);
      }
    };
    getUserMedia();
    socket.on("me", (id) => {
      setMe(id);
    });
    console.log(socket);

    socket.on("callUser", (data) => {
      setReceivingCall(true);
      setCaller(data.from);
      setName(data.name);
      setCallerSignal(data.signal);
    });
  }, []);

  const callUser = (id) => {
    const peer = new Peer({
      initiator: true,
      trickle: false,
      stream: stream,
    });
    peer.on("signal", (data) => {
      socket.emit("callUser", {
        userToCall: id,
        signalData: data,
        from: me,
        name: name,
      });
    });
    peer.on("stream", (stream) => {
      userVideo.current.srcObject = stream;
    });
    socket.on("callAccepted", (signal) => {
      setCallAccepted(true);
      peer.signal(signal);
    });

    connectionRef.current = peer;
  };

  const answerCall = () => {
    setCallAccepted(true);
    const peer = new Peer({
      initiator: false,
      trickle: false,
      stream: stream,
    });
    peer.on("signal", (data) => {
      socket.emit("answerCall", { signal: data, to: caller });
    });
    peer.on("stream", (stream) => {
      userVideo.current.srcObject = stream;
    });

    peer.signal(callerSignal);
    connectionRef.current = peer;
  };

  const leaveCall = () => {
    setCallEnded(true);
    connectionRef.current.destroy();
  };
  console.log(me);
  return (
    <>
      <div>
        <MdCall
          onClick={() => {
            //   dispatch(removeUserFromGroup(thisRoom.id, user.phoneNumber));
          }}
          color="#1A237E"
          size="24px"
          onClick={openModal}
          className="cursor-pointer ml-4"
        />
      </div>

      <Transition appear show={isOpen} as={Fragment}>
        <Dialog
          as="div"
          className="fixed inset-0 z-10 overflow-y-auto"
          onClose={closeModal}
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
                <h1 style={{ textAlign: "center", color: "#fff" }}>Zoomish</h1>
                <div className="container">
                  <div className="video-container">
                    <div className="video">
                      {stream && (
                        <video
                          playsInline
                          muted
                          ref={myVideo}
                          autoPlay
                          style={{ width: "300px" }}
                        />
                      )}
                    </div>
                    <div className="video">
                      {callAccepted && !callEnded ? (
                        <video
                          playsInline
                          ref={userVideo}
                          autoPlay
                          style={{ width: "300px" }}
                        />
                      ) : null}
                    </div>
                  </div>
                  <div className="myId">
                    <input
                      id="filled-basic"
                      label="Name"
                      variant="filled"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      style={{ marginBottom: "20px" }}
                    />
                    {me}
                    <input
                      id="filled-basic"
                      label="ID to call"
                      variant="filled"
                      value={idToCall}
                      onChange={(e) => setIdToCall(e.target.value)}
                    />
                    <div className="call-button">
                      {callAccepted && !callEnded ? (
                        <button
                          variant="contained"
                          color="secondary"
                          onClick={leaveCall}
                        >
                          End Call
                        </button>
                      ) : (
                        <button
                          color="primary"
                          aria-label="call"
                          onClick={() => callUser(idToCall)}
                        >
                          phone
                        </button>
                      )}
                      {idToCall}
                    </div>
                  </div>
                  <div>
                    {receivingCall && !callAccepted ? (
                      <div className="caller">
                        <h1>{name} is calling...</h1>
                        <button
                          variant="contained"
                          color="primary"
                          onClick={answerCall}
                        >
                          Answer
                        </button>
                      </div>
                    ) : null}
                  </div>
                </div>

                <div className="mt-4">
                  <button
                    type="button"
                    className="inline-flex justify-center px-4 py-2 text-sm font-medium text-blue-900 bg-blue-100 border border-transparent rounded-md hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500"
                    onClick={closeModal}
                  >
                    Got it, thanks!
                  </button>
                </div>
              </div>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition>
    </>
  );
}
