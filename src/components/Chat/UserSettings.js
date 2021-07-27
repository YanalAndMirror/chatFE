import { Disclosure } from '@headlessui/react';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useDropzone } from 'react-dropzone';
import { useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { updateUserData } from '../../store/actions/userActions';

export default function UserSettings() {
  const user = useSelector((state) => state.user.user);
  const history = useHistory();
  const dispatch = useDispatch();
  const handleSubmit = (event) => {
    event.preventDefault();
    dispatch(updateUserData(userData, history));
  };
  const [userData, setUserData] = useState({
    phoneNumber: user.phoneNumber,
    id: user.id,
    userName: user.userName,
  });

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

  return (
    <div className="w-full px-4 pt-16">
      <div className="w-full max-w-md p-2 mx-auto bg-white rounded-2xl">
        <Disclosure>
          {({ open }) => (
            <>
              <Disclosure.Button className="flex justify-between w-full px-4 py-2 text-sm font-medium text-left text-white bg-indigo-600 rounded-lg hover:bg-indigo-400 focus:outline-none focus-visible:ring focus-visible:ring-purple-500 focus-visible:ring-opacity-75">
                <span>Profile Settings</span>
              </Disclosure.Button>
              <Disclosure.Panel className="px-4 pt-4 pb-2 text-sm text-gray-500">
                <div class="mb-4 relative">
                  Username
                  <input
                    class="input border border-gray-400 appearance-none rounded w-full px-3 py-3 pt-2 pb-2 focus focus:border-indigo-600 focus:outline-none active:outline-none active:border-indigo-600"
                    id="userName"
                    type="text"
                    autofocus
                    placeholder={user.userName}
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
                        Drag 'n' drop some files here, or click to select files
                      </p>
                    </div>
                    <aside style={thumbsContainer}>{thumbs}</aside>
                  </section>{' '}
                </div>
                <button
                  class="bg-indigo-600 hover:bg-indigo-400 text-white font-bold py-3 px-6 rounded"
                  onClick={handleSubmit}
                >
                  Update
                </button>
              </Disclosure.Panel>
            </>
          )}
        </Disclosure>
        <Disclosure as="div" className="mt-2">
          {({ open }) => (
            <>
              <Disclosure.Button className="flex justify-between w-full px-4 py-2 text-sm font-medium text-left text-white bg-indigo-600 rounded-lg hover:bg-indigo-400 focus:outline-none focus-visible:ring focus-visible:ring-purple-500 focus-visible:ring-opacity-75">
                <span>Chat Settings</span>
              </Disclosure.Button>
              <Disclosure.Panel className="px-4 pt-4 pb-2 text-sm text-gray-500">
                No.
              </Disclosure.Panel>
            </>
          )}
        </Disclosure>
      </div>
    </div>
  );
}
