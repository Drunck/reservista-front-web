import { useState, useEffect } from "react"
import AuthFormInput from "../FormInputs/AuthFormInput";
import AlertMessageBox from "../AlertMessageBox/AlertMessageBox";
import { Link, useNavigate, useLocation } from "react-router-dom";
import API from "../../api/axios";
import useAuth from "../../hooks/useAuth";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,64}$/;
const LOGIN_URL = '/api/auth/sign-in';


export default function LoginForm({ buttonText }) {
    const { setAuth } = useAuth();
    const [email, setEmail] = useState('');
    const [validEmail, setValidEmail] = useState(false);
    const [password, setPassword] = useState('');
    const [validPassword, setValidPassword] = useState(false);
    const [serverErrorMessage, setServerErrorMessage] = useState('');
    const [errors, setErrors] = useState({});
    const [showPassword, setShowPassword] = useState(false);

    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from?.pathname || "/";

    const handleCheckboxChange = () => {
        setShowPassword(prevState => !prevState);
    };


    useEffect(() => {
        if (email.length !== 0) {
            let emailError = '';
            const isEmail = EMAIL_REGEX.test(email);
            setValidEmail(isEmail);
            if (!isEmail) {
                emailError = "Invalid email format";
            } else {
                emailError = "";
            }
            setErrors(prevErrors => ({ ...prevErrors, email: emailError }));
        } else {
            setErrors(prevErrors => ({ ...prevErrors, email: '' }));
        }
    }, [email])

    useEffect(() => {
        if (password.length !== 0) {
            const isPasswordValid = PASSWORD_REGEX.test(password);
            setValidPassword(isPasswordValid)
            if (!isPasswordValid) {
                let passwordError = '';
                if (password.length < 8 || password.length > 64) {
                    passwordError = 'Password must be between 8 and 64 characters';
                } else if (!/(?=.*[!@#$%])/.test(password)) {
                    passwordError = 'Password must contain at least one special character: ! @ # $ %';
                } else if (!/(?=.*[A-Z])/.test(password)) {
                    passwordError = 'Password must contain at least one uppercase letter';
                } else if (!/(?=.*[a-z])/.test(password)) {
                    passwordError = 'Password must contain at least one lowercase letter';
                } else if (!/(?=.*\d)/.test(password)) {
                    passwordError = 'Password must contain at least one digit';
                }
                setErrors(prevErrors => ({ ...prevErrors, password: passwordError }));
            } else {
                setErrors(prevErrors => ({ ...prevErrors, password: '' }));
            }
        } else {
            setErrors(prevErrors => ({ ...prevErrors, password: '' }));
        }
    }, [password])

    const handleLogin = async (e) => {
        e.preventDefault();

        const v1 = EMAIL_REGEX.test(email);
        const v2 = PASSWORD_REGEX.test(password);
        if (!v1 || !v2) {
            setServerErrorMessage("Invalid Input Values");
            return;
        }

        try {
            const response = await API.post(LOGIN_URL,
                JSON.stringify({ email, password }),
                {
                    headers: {
                        'Content-Type': 'application/json'
                    },
                }
            );
            const accessToken = response?.data?.accessToken
            setAuth({isAuth: true, email, accessToken});
            // console.log(response?.data);
            navigate(from, { replace: true });
        } catch (error) {
            console.log(error);
            if (!error?.response) {
                setServerErrorMessage("No Server Response");
            } else if (error.response?.data?.message === "wrong credentials") {
                setServerErrorMessage("Email or password is incorrect");
            } else if (error.response.data.message === "user not found") {
                setServerErrorMessage("User does not exist");
            } else {
                console.log("Login Failed");
                setServerErrorMessage("Login Failed");
            }
            setPassword("")
        }
    };


    const inputFields = [
        { label: "Email Address", name: "email", type: "email", placeholder: "example@domain.com", autocomplete: "username", value: email, onChange: (e) => setEmail(e.target.value) },
        { label: "Password", name: "password", type: showPassword ? 'text' : 'password', placeholder: "Password", autocomplete: "current-password", value: password, onChange: (e) => setPassword(e.target.value) }
    ]


    return (
        <form onSubmit={handleLogin}>
            <div className="login-form-body">
                {serverErrorMessage && <AlertMessageBox type="error" title="Error" message={serverErrorMessage} />}


                {inputFields.map(field => (
                    <AuthFormInput key={field.name} inputProps={field} isError={errors[field.name] || ''} />
                ))}
                <div className="mt-3 d-flex align-center content-between">
                    <div className="d-flex align-center">
                        <input
                            id="form-checkbox"
                            type="checkbox"
                            checked={showPassword}
                            onChange={handleCheckboxChange}
                            className="m-0"
                        />
                        <label htmlFor="form-checkbox" className="ml-1">Show Password</label>
                    </div>
                    <Link to="/recover-password" className="text-decor-none link-color ml-1">Forgot password?</Link>
                </div>
                <button disabled={!validEmail || !validPassword ? true : false} className="btn w-100 mt-3" type="submit">{buttonText}</button>
            </div>
        </form>
    );
}
