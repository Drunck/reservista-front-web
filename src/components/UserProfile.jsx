import { useEffect } from "react";
import { useNavigate} from "react-router-dom";
import API from "../api/axios";
import useAuth from "../hooks/useAuth";
import useSignOut from "../hooks/useSignOut";

const GET_USER_BY_EMAIL_URL = "/api/users/get-by-email"

export default function UserProfile({ email }) {
  const navigate = useNavigate();
  const { auth } = useAuth();
  const signOut = useSignOut();

  const logout = async () => {
    await signOut();
    navigate("/");
  }

  useEffect(() => {
    const verifyUser = async () => {
      try {
        console.log(auth.accessToken)
        const response = await API.get(GET_USER_BY_EMAIL_URL,
          JSON.stringify({ email }),
          {
            headers: {
              'Content-Type': 'application/json',
            },
            withCredentials: true,
          });
        console.log(response?.data);
      } catch (error) {
        console.log('Error fetching user data', error.response);
      }
    };

    email && verifyUser();
  }, [email, auth.accessToken]);

  return (
    <>
      <div className="d-flex conten-center align-center">{email}</div>
      <button onClick={logout} className="btn-primary-grey text-decor-none d-flex align-center ml-1" type="submit">Sign out</button>
    </>

  )
}
