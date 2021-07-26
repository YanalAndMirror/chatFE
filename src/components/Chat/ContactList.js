import React from 'react';
import ContactItem from './ContactItem';

export default function ContactList() {
  return (
    <div>
      <div class="bg-grey-lighter flex-1 overflow-auto">
        <ContactItem />
        <ContactItem />
        <ContactItem />
      </div>
    </div>
  );
}
