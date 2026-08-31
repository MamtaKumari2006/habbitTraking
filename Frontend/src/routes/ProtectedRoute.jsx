import { Navigate, replace } from "react-router-dom";


function ProtectedRoutes({children}){
    const token = localStorage.getItem('token')

    if(!token){
        return <Navigate to ="/login" replace />
    }
    return children;
}

export default ProtectedRoutes