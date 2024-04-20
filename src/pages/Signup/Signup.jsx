import React from "react";
import { Link } from "react-router-dom";
import SignUpForm from "../../components/SignUpForm/SignUpForm";

export default function SignUp() {
    return (
        <div className="login-body">
            <div className="login-form m-auto">
                <Link className="text-decor-none" to="/">
                    <h1 className="logo-font text-center" style={{ marginTop: "20px", marginBottom: "30px", fontSize: "50px" }}>
                        reservista
                    </h1>
                </Link>
                <h2 className="m-0 font-m">Create an Account</h2>
                <SignUpForm buttonText="Create My Account" />
                <div className="login-form-footer text-center">
                    <p>Already have an account?
                        <Link className="underline text-decor-none link-color ml-1" to="/login">Log in</Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
