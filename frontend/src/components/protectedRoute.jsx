import { Navigate } from "react-router-dom";

const isTokenValid = (token) => {
  try {
    const payload = JSON.parse(atob(token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/")));
    return typeof payload.exp === "number" && payload.exp * 1000 > Date.now();
  } catch {
    return false;
  }
};

const ProtectedRoute=({children})=>{

const token=localStorage.getItem("token");

if (!isTokenValid(token)) {
  localStorage.removeItem("token");
  return <Navigate to="/login" replace />;
}

return children;

};

export default ProtectedRoute;
