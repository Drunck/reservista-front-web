import React from "react"

export default function AuthFormInput({ inputProps, isError }) {
    return (
        <div className="mt-3">
            <label htmlFor={inputProps.name}>{inputProps.label}</label>
            <input className={`form-input ${isError ? "input-error" : ""}`}
                type={inputProps.type}
                name={inputProps.name}
                value={inputProps.value}
                placeholder={inputProps.placeholder ? inputProps.placeholder : ""}
                {...(inputProps.phonePattern && { pattern: inputProps.phonePattern })}
                {...(inputProps.autocomplete && { autoComplete: inputProps.autocomplete })}
                onChange={inputProps.onChange}
            />
            {
                isError &&
                <div className="login-error-msg" style={{ marginTop: "5px" }}>
                    {isError}
                </div>
            }
        </div>
    )
}
