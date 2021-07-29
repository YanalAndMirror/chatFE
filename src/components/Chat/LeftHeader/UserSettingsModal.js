// react imports
import { Fragment, useState } from 'react';
import { useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

// assets imports
import { GoSignOut } from 'react-icons/go';
import { RiRefreshLine } from 'react-icons/ri';
import { MdSettings } from 'react-icons/md';

// actions imports
import { updateUserData } from '../../../store/actions/userActions';
import { signout } from '../../../store/actions/authActions';

// UI imports
import { Dialog, Transition } from '@headlessui/react';

// utils Imports
import { useDropzone } from 'react-dropzone';

export default function UserSettingsModal({ socket }) {
  // utils constants
  const history = useHistory();
  const dispatch = useDispatch();

  // start dropzone styling //
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
  // - end dropzone styling - //

  // fetching store
  const user = useSelector((state) => state.user.user);

  // Hooks
  const [userData, setUserData] = useState({
    phoneNumber: user.phoneNumber,
    id: user.id,
    userName: user.userName,
  });
  let [isOpen, setIsOpen] = useState(false);
  const [files, setFiles] = useState([]);

  const { getRootProps, getInputProps } = useDropzone({
    accept: 'image/*',
    onDrop: (acceptedFiles) => {
      setUserData({ ...userData, photo: acceptedFiles[0] });

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

  // functions
  const closeModal = () => {
    setIsOpen(false);
  };

  const openModal = () => {
    setIsOpen(true);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    dispatch(updateUserData(userData, history));
    closeModal();
  };

  const thumbs = files.map((file) => (
    <div style={thumb} key={file.name}>
      <div style={thumbInner}>
        <img src={file.preview} style={img} />
      </div>
    </div>
  ));

  return (
    <>
      {/* // Settings Icon // */}
      <div>
        <div class="ml-1">
          <MdSettings
            onClick={openModal}
            color="#1A237E"
            size="24px"
            className="cursor-pointer"
          />
        </div>
      </div>

      {/* // Modal Start // */}
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
                  Profile Settings
                </Dialog.Title>

                <div className="mt-4">
                  <form onSubmit={handleSubmit}>
                    <div class="mb-4 relative">
                      UserName:
                      <input
                        class="input border border-gray-400 appearance-none rounded w-full px-3 py-3 pt-3 pb-2 focus focus:border-indigo-600 focus:outline-none active:outline-none active:border-indigo-600"
                        id="name"
                        type="text"
                        autofocus
                        onChange={(event) => {
                          setUserData({
                            ...userData,
                            userName: event.target.value,
                          });
                        }}
                      />
                    </div>
                    <div class="mb-4 relative">
                      Profile Image
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
                    {/* Update Button */}
                    <button
                      type="button"
                      className="inline-flex justify-center px-4 py-2 text-sm font-medium text-white bg-indigo-900 border border-transparent rounded-md hover:bg-indigo-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500"
                      onClick={handleSubmit}
                    >
                      {/* Update Icon */}
                      <RiRefreshLine
                        color="#FFFFFF"
                        size="16px"
                        className="mr-1 cursor-pointer"
                      />
                      Update
                    </button>
                    {/* Signout Button */}
                    <button
                      type="button"
                      className="ml-2 inline-flex justify-center px-4 py-2 text-sm font-medium text-white bg-indigo-900 border border-transparent rounded-md hover:bg-indigo-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500"
                      onClick={() => dispatch(signout(history, socket))}
                    >
                      {/* Signout Icon */}
                      <GoSignOut
                        color="#FFFFFF"
                        size="16px"
                        className="mr-1 cursor-pointer"
                      />
                      Logout
                    </button>
                  </form>
                </div>
              </div>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition>
      {/* // Modal end // */}
    </>
  );
}
