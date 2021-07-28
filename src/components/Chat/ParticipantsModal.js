import { Dialog, Transition, RadioGroup } from '@headlessui/react';
import { Fragment, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FaUsers } from 'react-icons/fa';
import {
  addUserToGroup,
  removeUserFromGroup,
} from '../../store/actions/chatActions';

export default function ParticipantsModal({ room }) {
  let [isOpen, setIsOpen] = useState(false);
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.user);
  const [phoneNumber, setPhoneNumber] = useState();

  function closeModal() {
    setIsOpen(false);
  }

  function openModal() {
    setIsOpen(true);
  }
  const handleAdd = () => {
    dispatch(addUserToGroup(room._id, phoneNumber));
    closeModal();
  };
  const handleRemove = (phoneNumber) => {
    dispatch(removeUserFromGroup(room._id, phoneNumber));
    closeModal();
  };

  let participantsList = room.users
    .filter((_user) => _user._id !== user._id)
    .map((_user) => (
      <div class=" bg-white rounded-lg flex items-center justify-between space-x-8">
        <div class="flex-1 flex justify-between items-center">
          <div class="h-7 pl-2 w-48 bg-gray-300 rounded">
            {_user.userName === '' ? _user.phoneNumber : _user.userName}
          </div>
          {room.admin === user.id && (
            <button
              onClick={() => handleRemove(_user.phoneNumber)}
              class="w-24 h-7 rounded bg-indigo-600 text-white"
            >
              Remove
            </button>
          )}
        </div>
      </div>
    ));
  return (
    <>
      <div class="ml-6">
        <FaUsers
          onClick={openModal}
          color="#1A237E"
          size="24px"
          className="cursor-pointer"
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
                  Participants:
                </Dialog.Title>
                <div class="m-8 relative space-y-4"> {participantsList}</div>
                <div className="mt-4">
                  <form onSubmit={handleAdd}>
                    <div class="mb-4 relative">
                      <input
                        class="input border border-gray-400 appearance-none rounded w-full px-3 py-3 pt-3 pb-2 focus focus:border-indigo-600 focus:outline-none active:outline-none active:border-indigo-600"
                        id="phoneNumber"
                        type="text"
                        autofocus
                        onChange={(event) => {
                          setPhoneNumber(event.target.value);
                        }}
                      />
                    </div>
                    <button
                      type="button"
                      className="inline-flex justify-center px-4 py-2 text-sm font-medium text-white bg-indigo-900 border border-transparent rounded-md hover:bg-indigo-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500"
                      onClick={handleAdd}
                    >
                      Add to Chat
                    </button>
                  </form>
                </div>
              </div>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition>
    </>
  );
}