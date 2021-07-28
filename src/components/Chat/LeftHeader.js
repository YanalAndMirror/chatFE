import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import nophoto from '../../assets/no-photo.png';
import NewRoomModal from './NewRoomModal';
import UserSettings from './UserSettings';
import { GoSignOut } from 'react-icons/go';
import { signout } from '../../store/actions/authActions';
import { useHistory } from 'react-router-dom';

export default function LeftHeader({ socket }) {
  const user = useSelector((state) => state.user.user);
  const history = useHistory();
  const dispatch = useDispatch();
  return (
    <div>
      <div class="py-2 px-3 bg-grey-lighter flex flex-row justify-between items-center">
        <div>
          <img
            class="w-10 h-10 rounded-full inline"
            src={user.photo === 'no-photo.jpg' ? nophoto : user.photo}
          />
          {' ' + (user.userName ?? user.phonenumber)}
        </div>

        <div class="flex">
          <div class="ml-4">
            <NewRoomModal />
          </div>
          <div class="ml-4">
            <UserSettings />
          </div>
          <div class="ml-4">
            <GoSignOut
              onClick={() => {
                dispatch(signout(history, socket));
              }}
              color="#1A237E"
              size="24px"
              className="cursor-pointer"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
