import React from "react"; //Importing React is not needed
import { useDispatch, useSelector } from "react-redux";

import { GoSignOut } from "react-icons/go";

//Assets
import nophoto from "../../assets/no-photo.png";

//Components
import Call from "./Call";
import ParticipantsModal from "./ParticipantsModal";
import RoomSettingsModal from "./RoomSettingsModal";

//Actions
import { removeUserFromGroup } from "../../store/actions/chatActions";

export default function RightHeader({
  thisRoom,
  socket,
  userVideo,
  play,
  stop,
  setQuery,
}) {
  const user = useSelector((state) => state.user.user);

  const dispatch = useDispatch();

  const membersList = thisRoom.users.map((_user) =>
    _user.userName === "" ? _user.phoneNumber : _user.userName
  );

  return (
    <div>
      <div class="py-2 px-3 bg-grey-lighter flex flex-row justify-between items-center">
        <div class="flex items-center">
          <div>
            <img
              class="w-10 h-10 rounded-full"
              src={thisRoom.photo === "no-photo.jpg" ? nophoto : thisRoom.photo}
            />
          </div>
          <div class="ml-4">
            <p class="text-grey-darkest">{thisRoom.name}</p>
            <p class="text-grey-darker text-xs mt-1">
              {thisRoom.type === "Group" && <>{membersList.join(", ")}</>}
              {thisRoom.type === "Private" && <>Online</>}
              {thisRoom.type === "Channel" && <>{membersList.length} Member</>}
            </p>
          </div>
        </div>

        <div class="flex">
          <div class="ml-6">
            {/* <FaSearch color="#1A237E" size="24px" className="cursor-pointer" /> */}
            <input
              onChange={(event) => setQuery(event.target.value)}
              className="inline"
              placeholder="search"
            />
          </div>
          <Call
            socket={socket}
            userVideo={userVideo}
            membersList={thisRoom.users}
            play={play}
            roomId={thisRoom._id}
            roomType={thisRoom.type}
            stop={stop}
          />
          <ParticipantsModal room={thisRoom} />
          {thisRoom.admin === user.id && <RoomSettingsModal room={thisRoom} />}
          {thisRoom.admin !== user.id && thisRoom.type === "Channel" && (
            <>
              <GoSignOut
                onClick={() => {
                  dispatch(removeUserFromGroup(thisRoom.id, user));
                }}
                color="#1A237E"
                size="24px"
                className="cursor-pointer ml-4"
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
}
