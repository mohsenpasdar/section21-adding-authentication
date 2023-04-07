import { redirect } from "react-router-dom";

export const action = async () => {
    // remove token from local storage
    localStorage.removeItem('token');
    localStorage.removeItem('expirationDate');
    // redirect to home page
    return redirect('/');
}