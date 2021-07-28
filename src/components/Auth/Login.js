import React, { useState } from "react"; // REVIEW: you dont need to import React
import { useHistory } from "react-router-dom";
import { useDispatch } from "react-redux";
import loginImage from "../../assets/loginImage.svg";
import { signin } from "../../store/actions/authActions";
// REVIEW: Add comments to all your imports
export default function Login() {
  const [phoneNumber, setPhoneNumber] = useState();
  const history = useHistory();
  const dispatch = useDispatch();
  const handleSubmit = (event) => {
    event.preventDefault();
    dispatch(signin(phoneNumber, history));
  };
  return (
    <div
      class="flex h-screen items-center justify-center"
      style={{ background: "#edf2f7" }}
    >
      <div class="shadow-xl p-10 bg-white max-w-xl rounded">
        <img src={loginImage} alt="login" />
        <h1 class="text-4xl font-black mb-4">Login</h1>
        <div class="mb-4 relative">
          <input
            class="input border border-gray-400 appearance-none rounded w-full px-3 py-3 pt-5 pb-2 focus focus:border-indigo-600 focus:outline-none active:outline-none active:border-indigo-600"
            id="email"
            type="text"
            autofocus
            // REVIEW: Remove {}
            onChange={(event) => {
              setPhoneNumber(event.target.value);
            }}
          />
          <label
            for="phone"
            class="label absolute mb-0 -mt-2 pt-4 pl-3 leading-tighter text-gray-400 text-base mt-2 cursor-text"
          >
            Phone Number
          </label>
        </div>
        <button
          class="bg-indigo-600 hover:bg-blue-dark text-white font-bold py-3 px-6 rounded"
          onClick={handleSubmit}
        >
          Signin
        </button>
      </div>
    </div>
  );
}
