import React from 'react';
import ContactList from './ContactList';
import InputField from './InputField';
import LeftHeader from './LeftHeader';
import MsgsList from './MsgsList';
import RightHeader from './RightHeader';
import SearchBar from './SearchBar';
import { io } from 'socket.io-client';

export default function Chat() {
  const socket = io('localhost:8000');
  return (
    <>
      <div>
        <div class="w-full h-32" style={{ backgroundColor: '#449388' }}></div>

        <div class="container mx-auto" style={{ marginTop: '-128px' }}>
          <div class="py-6 h-screen">
            <div class="flex border border-grey rounded shadow-lg h-full">
              {/* <!-- Left --> */}
              <div class="w-1/3 border flex flex-col">
                {/* <!-- Header --> */}

                <LeftHeader />

                {/* <!-- Search --> */}

                <SearchBar />

                {/* <!-- Contacts --> */}
                <ContactList />
              </div>

              {/* <!-- Right --> */}
              <div class="w-2/3 border flex flex-col">
                {/* <!-- Header --> */}
                <RightHeader />
                {/* <!-- Messages --> */}
                <MsgsList />
                {/* <!-- Input --> */}
                <InputField />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
