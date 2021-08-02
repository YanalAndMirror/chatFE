import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import loginImage from '../../assets/loginImage.svg';
import { signin } from '../../store/actions/authActions';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/material.css';

import ReactCodeInput from 'react-verification-code-input';
import instance from '../../store/actions/instance';

export default function Login() {
  const [phoneNumber, setPhoneNumber] = useState();
  const [page, setPage] = useState('login');
  const [error, setError] = useState(false);
  const dispatch = useDispatch();
  const handleSubmit = async (code) => {
    if (page === 'login') {
      const res = await instance.post(`/api/v1/users/`, { phoneNumber });
      setPage(res.data);
    } else {
      dispatch(signin(phoneNumber, code, setError));
    }
  };

  return (
    <div
      class="flex h-screen items-center justify-center"
      style={{ background: '#edf2f7' }}
    >
      <div class="shadow-xl p-10 bg-white max-w-xl rounded">
        {page === 'login' ? (
          <div>
            <img src={loginImage} alt="login" />
            <>
              <h1 class="text-3xl font-black mb-4">Login/Signup</h1>
              <div class="mb-4 relative">
                <PhoneInput
                  isValid={(value, country) => {
                    if (
                      value.substr(country.countryCode.length)[0] == 0 ||
                      (value.length !== 12 && value.length !== 3)
                    ) {
                      return 'Invalid number';
                    } else {
                      return true;
                    }
                  }}
                  country="jo"
                  class="block text-gray-700 text-sm font-bold mb-2"
                  value={phoneNumber}
                  onChange={(phone) => {
                    setPhoneNumber(phone);
                  }}
                  countryCodeEditable={false}
                  enableSearch={true}
                />
              </div>
              <button
                class="bg-indigo-600 hover:bg-blue-dark text-white font-bold py-3 px-6 rounded"
                onClick={handleSubmit}
              >
                Login/Signup
              </button>
            </>
          </div>
        ) : (
          <center>
            Please enter the 6-digit confirmation code that has been sent to
            <br />
            <b>{phoneNumber}</b>
            {error && (
              <div
                class="w-72 bg-red-100 border-t border-b border-red-500 text-red-700 px-4 py-3 m-12"
                role="alert"
              >
                <p class="font-bold">Incorrect Code</p>
              </div>
            )}
            <ReactCodeInput
              onComplete={(e) => {
                handleSubmit(e);
              }}
            />
            <a
              class="text-blue-400 hover:text-blue-600 cursor-pointer"
              onClick={() => setPage('login')}
            >
              Resend Code ?
            </a>
            <p className="text-xs">psst your code is {page}</p>
          </center>
        )}
      </div>
    </div>
  );
}
