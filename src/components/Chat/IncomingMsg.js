import React from "react";

export default function IncomingMsg({ message }) {
  return (
    <div class="rounded py-2 px-3" style={{ backgroundColor: "#F2F2F2" }}>
      <p class="text-sm text-teal">Sylverter Stallone</p>
      <p class="text-sm mt-1">{message}</p>
      <p class="text-right text-xs text-grey-dark mt-1">12:45 pm</p>
    </div>
  );
}
