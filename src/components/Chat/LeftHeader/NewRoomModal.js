// React imports
import { useEffect, Fragment, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

// UI imports
import { Dialog, Transition, RadioGroup } from "@headlessui/react";

// Actions Imports
import { createRoom } from "../../../store/actions/chatActions";

// utils Imports
import { useDropzone } from "react-dropzone";

// Assets Imports
import { RiMessage2Fill } from "react-icons/ri";
import Select from "react-select";

// Selector options
const options = [
  {
    name: "Private",
    details: "1 on 1 private chat",
  },
  {
    name: "Group",
    details: "group chat with multiple users",
  },
  {
    name: "Channel",
    details: "a channel that only you can send to",
  },
];

export default function NewRoomModal() {
  // utils constants
  const dispatch = useDispatch();

  // store fetching
  const user = useSelector((state) => state.user.user);
  const chats = useSelector((state) => state.chats.chats);

  const selectOptions = chats
    .filter((chat) => chat.type === "Private")
    .map((chat) => ({
      value: chat.users.find((a) => a._id !== user._id)._id,
      label: chat.name,
    }));

  // hooks
  const [select, setSelect] = useState([]);
  let [isOpen, setIsOpen] = useState(false);
  const [files, setFiles] = useState([]);
  const [selected, setSelected] = useState(options[0]);
  const [room, setRoom] = useState({});

  const { getRootProps, getInputProps } = useDropzone({
    accept: "image/*",
    onDrop: (acceptedFiles) => {
      setRoom({ ...room, photo: acceptedFiles[0] });

      setFiles(
        acceptedFiles.map((file) =>
          Object.assign(file, {
            preview: URL.createObjectURL(file),
          })
        )
      );
    },
  });

  useEffect(
    () => () => {
      // Make sure to revoke the data uris to avoid memory leaks
      files.forEach((file) => URL.revokeObjectURL(file.preview));
    },
    [files]
  );

  //   react Dropzone styling
  const thumbsContainer = {
    display: "flex",
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 16,
  };

  const thumb = {
    display: "inline-flex",
    borderRadius: 2,
    border: "1px solid #eaeaea",
    marginBottom: 8,
    marginRight: 8,
    width: 100,
    height: 100,
    padding: 4,
    boxSizing: "border-box",
  };

  const thumbInner = {
    display: "flex",
    minWidth: 0,
    overflow: "hidden",
  };

  const img = {
    display: "block",
    width: "auto",
    height: "100%",
  };

  const thumbs = files.map((file) => (
    <div style={thumb} key={file.name}>
      <div style={thumbInner}>
        <img src={file.preview} style={img} />
      </div>
    </div>
  ));
  //   end react Dropzone

  // functions
  const closeModal = () => {
    setIsOpen(false);
  };

  const openModal = () => {
    setIsOpen(true);
  };

  const handleSubmit = () => {
    let to = room.to;
    if (selected.name !== "Private") {
      to = select.map((s) => s.value).join(",");
    }
    console.log({ ...room, type: selected.name, to });
    dispatch(createRoom({ ...room, type: selected.name, to }, user.id));
    setRoom({});
    closeModal();
  };

  return (
    <>
      {/* Create Room Icon */}
      <div>
        <div class="ml-6">
          <RiMessage2Fill
            onClick={openModal}
            color="#1A237E"
            size="24px"
            className="cursor-pointer"
          />
        </div>
      </div>
      {/* // - Modal Start - // */}
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
                  Create a conversation
                </Dialog.Title>
                <br />
                {/* // - Select menu start - // */}
                <RadioGroup value={selected} onChange={setSelected}>
                  <RadioGroup.Label className="sr-only">
                    Server size
                  </RadioGroup.Label>
                  <div className="space-y-2">
                    {options.map((option) => (
                      <RadioGroup.Option
                        key={option.name}
                        value={option}
                        className={({ active, checked }) =>
                          `${
                            active
                              ? "ring-2 ring-offset-2 ring-offset-sky-300 ring-indigo-900 ring-opacity-60"
                              : ""
                          }
                  ${
                    checked ? "bg-sky-900 bg-opacity-75 text-black" : "bg-white"
                  }
                    relative rounded-lg shadow-md px-5 py-4 cursor-pointer flex focus:outline-none`
                        }
                      >
                        {({ active, checked }) => (
                          <>
                            <div className="flex items-center justify-between w-full">
                              <div className="flex items-center">
                                <div className="text-sm">
                                  <RadioGroup.Label
                                    as="p"
                                    className={`font-medium  ${
                                      checked ? "text-black" : "text-gray-900"
                                    }`}
                                  >
                                    {option.name}
                                  </RadioGroup.Label>
                                  <RadioGroup.Description
                                    as="span"
                                    className={`inline ${
                                      checked ? "text-sky-100" : "text-gray-500"
                                    }`}
                                  >
                                    <span>{option.details}</span>{" "}
                                    <span aria-hidden="true">&middot;</span>{" "}
                                  </RadioGroup.Description>
                                </div>
                              </div>
                              {checked && (
                                <div className="flex-shrink-0 text-black">
                                  <CheckIcon className="w-6 h-6" />
                                </div>
                              )}
                            </div>
                          </>
                        )}
                      </RadioGroup.Option>
                    ))}
                  </div>
                </RadioGroup>
                {/* // - Select menu end - // */}
                {/* // checking room type // */}
                {selected.name === "Channel" ? (
                  <></>
                ) : (
                  <div className="mt-2">
                    {selected.name === "Private" ? (
                      <p className="text-sm text-gray-500">
                        Phone Number:
                        <input
                          class="input border border-gray-400 appearance-none rounded w-full px-3 py-3 pt-2 pb-2 focus focus:border-indigo-600 focus:outline-none active:outline-none active:border-indigo-600"
                          id="email"
                          type="text"
                          autofocus
                          onChange={(event) => {
                            setRoom({ ...room, to: event.target.value });
                          }}
                        />
                      </p>
                    ) : (
                      <Select
                        onChange={(e) => setSelect(e)}
                        isMulti
                        name="colors"
                        options={selectOptions}
                        className="basic-multi-select"
                        classNamePrefix="select"
                      />
                    )}
                  </div>
                )}
                {selected.name !== "Private" && (
                  <>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        {selected.name} name:
                        <input
                          class="input border border-gray-400 appearance-none rounded w-full px-3 py-3 pt-2 pb-2 focus focus:border-indigo-600 focus:outline-none active:outline-none active:border-indigo-600"
                          id="name"
                          type="text"
                          autofocus
                          onChange={(event) => {
                            setRoom({ ...room, name: event.target.value });
                          }}
                        />
                      </p>
                    </div>
                    <div class="mb-4 relative">
                      {selected.name} Image
                      <section
                        className="container"
                        style={{
                          width: "300px",
                          backgroundColor: "lightgrey",
                        }} //Remove inline styling
                      >
                        <div {...getRootProps({ className: "dropzone" })}>
                          <input {...getInputProps()} />
                          <p>
                            Drag 'n' drop some files here, or click to select
                            files
                          </p>
                        </div>
                        <aside style={thumbsContainer}>{thumbs}</aside>
                      </section>
                    </div>
                  </>
                )}
                {/* // create Button // */}
                <div className="mt-4">
                  <button
                    type="button"
                    className="inline-flex justify-center px-4 py-2 text-sm font-medium text-white bg-indigo-900 border border-transparent rounded-md hover:bg-indigo-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500"
                    onClick={handleSubmit}
                  >
                    Create
                  </button>
                </div>
              </div>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition>
      {/* // - Modal End - // */}
    </>
  );
}
function CheckIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" {...props}>
      <circle cx={12} cy={12} r={12} fill="#fff" opacity="0.2" />
      <path
        d="M7 13l3 3 7-7"
        stroke="#fff"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
