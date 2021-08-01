import React from 'react';

export default function SearchBar({ setQuery }) {
  return (
    <div>
      <div class="py-2 px-2 bg-grey-lightest">
        <input
          type="text"
          class="w-full px-2 py-2 text-sm"
          placeholder="Search"
          onChange={(event) => setQuery(event.target.value)}
        />
      </div>
    </div>
  );
}
