import { Dialog, Transition, RadioGroup } from "@headlessui/react";
import { Fragment, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FaUsers } from "react-icons/fa";
import {
  addUserToGroup,
  removeUserFromGroup,
} from "../../store/actions/chatActions";

export default function MessageModel({ isOpen, setIsOpen, socket }) {
  const [input, setInput] = useState(false);

  function closeModal() {
    setIsOpen(false);
    setInput(false);
  }

  function openModal() {
    setIsOpen(true);
  }
  const handleAdd = () => {
    let content = {};
    if (isOpen.type === "Edit") {
      content.text = input === false ? isOpen.text : input;
      content.type = "edited";
      socket.emit("messageUpdate", { messageId: isOpen.message._id, content });
    } else if (isOpen.type === "DeleteAll") {
      content.text = "[deleted]";
      content.type = "deleted";
      socket.emit("messageUpdate", { messageId: isOpen.message._id, content });
    }
    closeModal();
  };

  return (
    <>
      <Transition appear show={isOpen ? true : false} as={Fragment}>
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
                  Message:
                </Dialog.Title>
                <div class="m-8 relative space-y-4"> </div>
                <div className="mt-4">
                  <form onSubmit={handleAdd}>
                    <div class="mb-4 relative">
                      <input
                        disabled
                        class="disabled:opacity-500 input border border-gray-400 appearance-none rounded w-full px-3 py-3 pt-3 pb-2 focus focus:border-indigo-600 focus:outline-none active:outline-none active:border-indigo-600"
                        id="phoneNumber"
                        type="text"
                        value={
                          input === false ? (isOpen ? isOpen.text : "") : input
                        }
                        autofocus
                        onChange={(event) => setInput(event.target.value)}
                      />
                    </div>
                    <center>
                      <button
                        type="button"
                        className="inline-flex justify-center px-4 py-2 text-sm font-medium text-white bg-indigo-900 border border-transparent rounded-md hover:bg-indigo-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500"
                        onClick={handleAdd}
                      >
                        {isOpen.type === "Edit" ? "Edit" : "Delete For All"}
                      </button>
                    </center>
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
