import React from "react";
import { useSelector } from "react-redux";
import nophoto from "../../assets/no-photo.png";
import UserMenu from "./UserMenu";
export default function LeftHeader() {
  const user = useSelector((state) => state.user.user);
  return (
    <div>
      <div class="py-2 px-3 bg-grey-lighter flex flex-row justify-between items-center">
        <div>
          <img
            class="w-10 h-10 rounded-full inline"
            src={user.photo === "no-photo.jpg" ? nophoto : user.photo}
          />
          {"    "}
          {user.userName === "" ? user.phoneNumber : user.userName}
        </div>

        <div class="flex">
          <div class="ml-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              width="24"
              height="24"
            >
              <path
                opacity=".55"
                fill="#263238"
                d="M19.005 3.175H4.674C3.642 3.175 3 3.789 3 4.821V21.02l3.544-3.514h12.461c1.033 0 2.064-1.06 2.064-2.093V4.821c-.001-1.032-1.032-1.646-2.064-1.646zm-4.989 9.869H7.041V11.1h6.975v1.944zm3-4H7.041V7.1h9.975v1.944z"
              ></path>
            </svg>
          </div>
          <UserMenu />
        </div>
      </div>
    </div>
  );
}
