import React from 'react';
import { useSelector } from 'react-redux';
import nophoto from '../../assets/no-photo.png';
import NewRoomModal from './NewRoomModal';
import UserMenu from './UserMenu';
export default function LeftHeader() {
  const user = useSelector((state) => state.user.user);
  return (
    <div>
      <div class="py-2 px-3 bg-grey-lighter flex flex-row justify-between items-center">
        <div>
          <img
            class="w-10 h-10 rounded-full"
            src={user.photo === 'no-photo.jpg' ? nophoto : user.photo}
          />
        </div>

        <div class="flex">
          <div class="ml-4">
            <NewRoomModal />
          </div>
          <UserMenu />
        </div>
      </div>
    </div>
  );
}