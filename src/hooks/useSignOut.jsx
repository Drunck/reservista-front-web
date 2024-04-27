import useAuth from "./useAuth"
import API from "../api/axios"

const useSignOut = () => {
    const {setAuth} = useAuth();
    
    const signOut = async () => {
        setAuth({});
        try {
            const response = await API('/api/auth/sign-out ', {
                withCredentials: true
            });
        } catch (err) {
            console.error(err);
        }
    }

    return signOut;
}

export default useSignOut