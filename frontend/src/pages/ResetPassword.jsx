import React,{useState} from "react";
import {useParams,useNavigate} from "react-router-dom";
import axios from "axios";

function ResetPassword(){

const {token}=useParams();

const navigate=useNavigate();

const [password,setPassword]=useState("");

const submit=async(e)=>{

e.preventDefault();

await axios.post(

`http://localhost:5000/api/auth/reset-password/${token}`,

{

password

}

);

alert("Password Updated");

navigate("/login");

}

return(

<div className="min-h-screen bg-slate-900 flex justify-center items-center">

<form

onSubmit={submit}

className="bg-white p-8 rounded-xl w-96"

>

<h2 className="text-2xl font-bold mb-5">

Reset Password

</h2>

<input

type="password"

placeholder="New Password"

className="border w-full p-3 mb-4"

onChange={(e)=>setPassword(e.target.value)}

/>

<button

className="bg-blue-600 text-white w-full p-3 rounded"

>

Update Password

</button>

</form>

</div>

)

}

export default ResetPassword;