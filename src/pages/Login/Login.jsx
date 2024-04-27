import React from "react";
import { Link } from "react-router-dom";
import LoginForm from "../../components/LoginForm/LoginForm";

export default function Login() {
    return (
        <div className="login-body">
            <div className="login-form m-auto">
                <Link className="text-decor-none" to="/">
                    <h1 className="logo-font logo-font-size-lg text-center" style={{ marginTop: "30px", marginBottom: "30px"}}>
                        reservista
                    </h1>
                </Link>
                <h2 className="m-0 font-m">Welcome</h2>
                <p>Welcome back! Please log in to continue</p>
                <LoginForm buttonText="Login" />
                <div className="login-form-footer text-center">
                    <p className="m-0 p-0">
                        Do not have an account?
                        <Link className="underline text-decor-none link-color ml-1" to="/signup">Create an Account</Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
