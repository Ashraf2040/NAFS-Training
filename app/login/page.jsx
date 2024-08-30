"use client"

import { useCookies } from 'react-cookie'

import { useRouter } from 'next/navigation'
import React from 'react'
import axios from 'axios'

import { useState } from 'react'
import { toast } from 'react-toastify'
import { signIn } from 'next-auth/react'



export default function Login() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const [error, setError] = useState("");
  const [user, setUser] = useState({
    email: "",
    password: "",
  });

 

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (!user.email || !user.password) {
        setError("please fill all the fields");
        return;
      }
      const emailRegex = /^([a-zA-Z0-9._%-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})$/;
      if (!emailRegex.test(user.email)) {
        setError("invalid email id");
        return;
      }

      const res = await signIn("credentials", {
        email: user.email,
        password: user.password,
        redirect: false,
      });

      if (res?.error) {
        console.log(res);
        setError("error");
      }

      setError("");
      router.push("/");
    } catch (error) {
      console.log(error);
      setError("");
    } finally {
      setLoading(false);

      setUser({
        email: "",
        password: "",
      });
    }
  };
  return (
    <div className=" h-screen flex justify-center items-center   ">
      <form

      onSubmit={handleSubmit}
        action=""
        className="text-xl shadow-lg shadow-theme p-4     font-semibold  flex flex-col gap-4  "
      >
        <h3 className="text-center text-theme mb-4 ">Login to your account</h3>
        <div className="flex-col md:flex-row  w-full gap-20 justify-between items-center">
          <label htmlFor="email">E-Mail : </label>
          <input
            className="rounded-md px-8 py-4 bg-slate-100  outline-none ml-8"
            type="text"
            id="email"
            name="email"
            // value="ashrafflefl2030@gmail.com"
            placeholder="Type your email"
            onChange={(e) => setUser({...user, email: e.target.value})}
          />
        </div>
        <div className="flex-col md:flex-row  w-full gap-20 justify-between items-center">
          <label htmlFor="email">Password : </label>
          <input
            className="rounded-md px-8 py-4 bg-slate-100 "
            type="text"
            id="email"
            name="email"
            placeholder="Type your password"
            onChange={(e) => setUser({...user, password: e.target.value})}
          />
        </div>

        <button className=" brounded-md py-4 w-4/5 mx-auto bg-theme text-white">
          Login
        </button>
      </form>
    </div>
  );
}
