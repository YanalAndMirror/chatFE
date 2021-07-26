import React from 'react';
import IncomingMsg from './IncomingMsg';
import OutcomingMsg from './OutcomingMsg';

export default function MsgsList() {
  return (
    <div class="flex-1 overflow-auto" style={{ backgroundColor: '#DAD3CC' }}>
      <div class="py-2 px-3">
        <IncomingMsg />
        <br />
        <OutcomingMsg />
      </div>
    </div>
  );
}
