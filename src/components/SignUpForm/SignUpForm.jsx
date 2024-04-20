import { useState, useEffect } from "react"
import AuthFormInput from "../FormInputs/AuthFormInput";
import PhoneInputField from "../FormInputs/PhoneInputField";
import AlertMessageBox from "../AlertMessageBox/AlertMessageBox";
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';

// const USERNAME_REGEX = /^[a-zA-Z0-9_]{3,}$/;      
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,64}$/;
const SIGNUP_URL = 'http://localhost:8000/api/users/sign-up';

export default function SignUpForm({ onSubmit, buttonText }) {
    const [name, setName] = useState("");
    const [validName, setValidName] = useState(false);

    const [surname, setSurname] = useState("");
    const [validSurname, setValidSurname] = useState(false);

    const [email, setEmail] = useState('');
    const [validEmail, setValidEmail] = useState(false);

    const [password, setPassword] = useState('');
    const [validPassword, setValidPassword] = useState(false);

    const [phone, setPhone] = useState("");
    const [validPhone, setValidPhone] = useState(false);

    const [serverErrorMessage, setServerErrorMessage] = useState("");
    const [errors, setErrors] = useState({});
    const [showPassword, setShowPassword] = useState(false);

    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from?.pathname || "/";
    
    const handleCheckboxChange = () => {
        setShowPassword(prevState => !prevState);
    };

    useEffect(() => {
        if (name.length > 0) {
            let nameError = '';
            let isName = name.length >= 1
            setValidName(isName);
            if (!isName) {
                nameError = "1 or more characters";
            }
            setErrors(prevErrors => ({ ...prevErrors, name: nameError }));
        } else {
            setErrors(prevErrors => ({ ...prevErrors, name: '' }));
        }
    }, [name])

    useEffect(() => {
        if (surname.length > 0) {
            let surnameError = '';
            let isSurname = surname.length >= 1
            setValidSurname(isSurname);
            if (!isSurname) {
                surnameError = "1 or more characters";
            }
            setErrors(prevErrors => ({ ...prevErrors, surname: surnameError }));
        } else {
            setErrors(prevErrors => ({ ...prevErrors, surname: '' }));
        }
    }, [surname])

    useEffect(() => {
        if (email.length > 0) {
            let emailError = '';
            const isEmail = EMAIL_REGEX.test(email)
            setValidEmail(isEmail)
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
        if (password.length > 0) {
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

    useEffect(() => {
        let phoneError = ''
        if (phone.length > 2 && phone.length < 12) {
            phoneError = "Invalid phone number";
            setValidPhone(false);
            setErrors(prevErrors => ({ ...prevErrors, phone: phoneError }));
        } else {
            setValidPhone(true);
            setErrors(prevErrors => ({ ...prevErrors, phone: '' }));
        }
    }, [phone])


    useEffect(() => {
        setServerErrorMessage('');
    }, [email, password])


    // const validateForm = () => {
    //     const errors = {};
    //     if (!username) {
    //         errors.name = "Name is required";
    //     }

    //     if (!surname) {
    //         errors.surname = "Surname is required";
    //     }
    //     if (!email) {
    //         errors.email = "Email is required";
    //     } else if (!emailPattern.test(email)) {
    //         errors.email = "Invalid email format";
    //     }

    //     if (!password) {
    //         errors.password = "Password is required";
    //     } else if (password.length < 8 || password.length > 64) {
    //         errors.password = "Password must be between 8 and 64 characters long";
    //     } else if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    //         errors.password = "Password must contain at least one special character";
    //     } else if (!/[A-Z]/.test(password)) {
    //         errors.password = "Password must contain at least one uppercase letter";
    //     } else if (!/[a-z]/.test(password)) {
    //         errors.password = "Password must contain at least one lowercase letter";
    //     } else if (!/\d/.test(password)) {
    //         errors.password = "Password must contain at least one digit";
    //     }

    // if (phone && phone.length < 12) {
    //     errors.phone = "Invalid phone number";
    // }

    //     setErrors(errors);
    //     return Object.keys(errors).length === 0;
    // };

    const handleSignup = async (e) => {
        e.preventDefault();

        const v1 = EMAIL_REGEX.test(email);
        const v2 = PASSWORD_REGEX.test(password);

        if (!v1 || !v2) {
            setServerErrorMessage("Invalid Input Values");
            return;
        }

        try {
            // const response = await fetch(SIGNUP_URL, {
            //     method: 'POST',
            //     headers: {
            //         'Content-Type': 'application/json',
            //     },
            //     body: JSON.stringify({ name, surname, phone, email, password })
            // });

            const response = await axios.post(SIGNUP_URL,
                JSON.stringify({ name, surname, phone, email, password }),
                {
                    headers: { 
                        'Content-Type': 'application/json' 
                    },
                }
            );
            // const data = await response.json();
            // if (!response.ok) {
            //     throw new Error(data.message === "user doesn't exists" ? "Email or password is incorrect" : data.message);
            // }
            console.log(response)

            setName('');
            setSurname('');
            setEmail('');
            setPassword('');
            setPhone('');
            navigate(from, { replace: true });
        } catch (error) {
            if (!error?.response) {
                setServerErrorMessage('No Server Response');
            } else {
                setServerErrorMessage(error.response.data);
            }
        }

    };


    const inputFields = [
        { label: "Name", name: "name", type: "text", placeholder: "Your name", value: name, onChange: e => setName(e.target.value) },
        { label: "Surname", name: "surname", type: "text", placeholder: "Your surname", value: surname, onChange: e => setSurname(e.target.value) },
        { label: "Email Address", name: "email", type: "email", placeholder: "example@domain.com", autocomplete: "username", value: email, onChange: e => setEmail(e.target.value) },
        { label: "Password", name: "password", type: showPassword ? 'text' : 'password', placeholder: "Password", autocomplete: "current-password", value: password, onChange: e => setPassword(e.target.value) }
    ];


    return (
        <form onSubmit={handleSignup}>
            <div className="login-form-body">
                {serverErrorMessage && <AlertMessageBox type={"error"} title="Error" message={serverErrorMessage} />}

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
                </div>
                <PhoneInputField phone={phone} setPhone={setPhone} isError={errors.phone || ''} />

                {/* <AuthFormInput inputProps={inputFields[0]} />
                <AuthFormInput inputProps={inputFields[1]} />
                <PhoneInputField />
                <AuthFormInput inputProps={inputFields[2]} />
                <AuthFormInput inputProps={inputFields[3]} /> */}

                <button disabled={(!validEmail || !validPassword || !validPhone || !validName || !validSurname) ? true : false} className="btn w-100 mt-3" type="submit">{buttonText}</button>
            </div>
        </form>
    );
}
