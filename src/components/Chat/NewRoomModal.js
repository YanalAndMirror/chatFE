import { Dialog, Transition, RadioGroup } from '@headlessui/react';
import { Fragment, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createRoom } from '../../store/actions/chatActions';
import { useDropzone } from 'react-dropzone';
import { useEffect } from 'react';
import Dropzone from 'dropzone';

const options = [
  {
    name: 'Private',
    details: '1 on 1 private chat',
  },
  {
    name: 'Group',
    details: 'group chat with multiple users',
  },
  {
    name: 'Channel',
    details: 'a channel that only you can send to',
  },
];
export default function NewRoomModal() {
  let [isOpen, setIsOpen] = useState(false);

  //   react Dropzone
  const thumbsContainer = {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 16,
  };

  const thumb = {
    display: 'inline-flex',
    borderRadius: 2,
    border: '1px solid #eaeaea',
    marginBottom: 8,
    marginRight: 8,
    width: 100,
    height: 100,
    padding: 4,
    boxSizing: 'border-box',
  };

  const thumbInner = {
    display: 'flex',
    minWidth: 0,
    overflow: 'hidden',
  };

  const img = {
    display: 'block',
    width: 'auto',
    height: '100%',
  };

  const [files, setFiles] = useState([]);
  const { getRootProps, getInputProps } = useDropzone({
    accept: 'image/*',
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

  const thumbs = files.map((file) => (
    <div style={thumb} key={file.name}>
      <div style={thumbInner}>
        <img src={file.preview} style={img} />
      </div>
    </div>
  ));

  useEffect(
    () => () => {
      // Make sure to revoke the data uris to avoid memory leaks
      files.forEach((file) => URL.revokeObjectURL(file.preview));
    },
    [files]
  );

  //   end react Dropzone
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.user);
  const [selected, setSelected] = useState(options[0]);

  const [room, setRoom] = useState({});
  function closeModal() {
    setIsOpen(false);
  }

  function openModal() {
    setIsOpen(true);
  }
  const handleSubmit = (event) => {
    dispatch(createRoom({ ...room, type: selected.name }, user.id));
    closeModal();
  };

  return (
    <>
      <div>
        <button type="button" onClick={openModal}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            width="24"
            height="24"
          >
            <path
              opacity=".55"
              fill="#263238"
              d="M19.005 3.175H4.674C3.642 3.175 3 3.789 3 4.821V21.02l3.544-3.514h12.461c1.033 0 2.064-1.06 2.064-2.093V4.821c-.001-1.032-1.032-1.646-2.064-1.646zm-4.989 9.869H7.041V11.1h6.975v1.944zm3-4H7.041V7.1h9.975v1.944z"
            ></path>
          </svg>
        </button>
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
                  Create a conversation
                </Dialog.Title>
                {/* // */}
                <br />

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
                              ? 'ring-2 ring-offset-2 ring-offset-sky-300 ring-indigo-900 ring-opacity-60'
                              : ''
                          }
                  ${
                    checked ? 'bg-sky-900 bg-opacity-75 text-black' : 'bg-white'
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
                                      checked ? 'text-black' : 'text-gray-900'
                                    }`}
                                  >
                                    {option.name}
                                  </RadioGroup.Label>
                                  <RadioGroup.Description
                                    as="span"
                                    className={`inline ${
                                      checked ? 'text-sky-100' : 'text-gray-500'
                                    }`}
                                  >
                                    <span>{option.details}</span>{' '}
                                    <span aria-hidden="true">&middot;</span>{' '}
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

                {/* // */}
                {selected.name === 'Channel' ? (
                  <></>
                ) : (
                  <div className="mt-2">
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
                  </div>
                )}
                {selected.name !== 'Private' && (
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
                          width: '300px',
                          backgroundColor: 'lightgrey',
                        }}
                      >
                        <div {...getRootProps({ className: 'dropzone' })}>
                          <input {...getInputProps()} />
                          <p>
                            Drag 'n' drop some files here, or click to select
                            files
                          </p>
                        </div>
                        <aside style={thumbsContainer}>{thumbs}</aside>
                      </section>{' '}
                    </div>
                  </>
                )}

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
