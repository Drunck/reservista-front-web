import { useEffect } from "react"
import API from "../api/axios";

const GET_USER_BY_EMAIL_URL = "/api/users/get-by-email"

export default function UserProfile({ email }) {
  useEffect(() => {
    const verifyUser = async () => {
      try {
        const response = await API.get(GET_USER_BY_EMAIL_URL,
          JSON.stringify({ email }),
          {
            headers: {'Content-Type': 'application/json'},
            withCredentials: true
          });
        console.log(response?.data);
      } catch (error) {
        console.log('Error fetching user data', error.response);
      }
    };

    email && verifyUser();
  }, [email]);

  return (
    <div className="d-flex conten-center align-center">{email}</div>
  )
}
