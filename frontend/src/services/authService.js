import axios from "axios";

const API="http://localhost:5000/api/auth";

export const login=(data)=>{

return axios.post(`${API}/login`,data);

};

export const forgotPassword=(email)=>{

return axios.post(`${API}/forgot-password`,{

email

});

};

export const resetPassword=(token,password)=>{

return axios.post(`${API}/reset-password/${token}`,{

password

});

};