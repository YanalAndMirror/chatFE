// react imports
import React from "react"; //Not needed
import { useSelector } from "react-redux";

// assets imports
import nophoto from "../../../assets/no-photo.png";

// components imports
import NewRoomModal from "./NewRoomModal";
import UserSettingsModal from "./UserSettingsModal";

export default function LeftHeader({ socket }) {
  // store fetch
  const user = useSelector((state) => state.user.user);

  return (
    // - Start user profile image - //
    <div>
      <div class="py-2 px-3 bg-grey-lighter flex flex-row justify-between items-center">
        <div>
          <img
            class="w-10 h-10 rounded-full inline"
            src={user.photo === "no-photo.jpg" ? nophoto : user.photo}
          />
          {" " + (user.userName ?? user.phonenumber)}
        </div>
        {/* // - End user profile image - // */}

        {/* // - Start Header Icons - // */}
        <div class="flex">
          <div class="">
            <NewRoomModal />
          </div>
          <div class="ml-4">
            <UserSettingsModal socket={socket} />
          </div>
        </div>
        {/* // - End Header Icons - // */}
      </div>
    </div>
  );
}
