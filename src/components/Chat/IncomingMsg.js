import React from 'react';
import { GoCheck } from 'react-icons/go';
import { BiCheckDouble } from 'react-icons/bi';

export default function IncomingMsg({ message }) {
  return (
    <div class="rounded py-2 px-3" style={{ backgroundColor: '#F2F2F2' }}>
      <p class="text-sm text-teal">
        {message.user.userName === ''
          ? message.user.phoneNumber
          : message.user.userName}
        :{' '}
        {message.receivers.length === 1 ? (
          message.receivers[0].seen ? (
            <div className="display: inline-flex">
              <BiCheckDouble />
              At {message.receivers[0].seen}{' '}
            </div>
          ) : (
            <div className="display: inline-flex">
              <GoCheck />
            </div>
          )
        ) : (
          ''
        )}
      </p>
      <p class="text-sm mt-1">{message.content}</p>
      <p class="text-right text-xs text-grey-dark mt-1">
        {new Date(message.createdAt).toString().substr(15, 6)}
      </p>
    </div>
  );
}
