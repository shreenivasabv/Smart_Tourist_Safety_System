import React, { useState } from "react";
import axios from "axios";

function ForgotPassword() {

  const [email,setEmail]=useState("");

  const submit=async(e)=>{

    e.preventDefault();

    try{

      await axios.post(
        "http://localhost:5000/api/auth/forgot-password",
        {email}
      );

      alert("Reset Link Sent Successfully");

    }catch(err){

      alert("Email Not Found");

    }

  }

  return(

<div className="min-h-screen bg-slate-900 flex justify-center items-center">

<form
onSubmit={submit}
className="bg-white p-8 rounded-xl w-96"
>

<h2 className="text-2xl font-bold mb-5">

Forgot Password

</h2>

<input

type="email"

placeholder="Enter Email"

value={email}

onChange={(e)=>setEmail(e.target.value)}

className="border w-full p-3 mb-4 rounded"

/>

<button

className="bg-green-600 text-white w-full p-3 rounded"

>

Send Reset Link

</button>

</form>

</div>

);

}

export default ForgotPassword;