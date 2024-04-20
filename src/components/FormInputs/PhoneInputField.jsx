import React from "react"
import { PhoneInput } from "react-international-phone"
import 'react-international-phone/style.css';

export default function PhoneInputField({ phone, setPhone, isError }) {
  return (
    <div className="mt-3">
      <label htmlFor="phone">Phone Number</label>
      <PhoneInput
        className={`phone-input ${isError ? "phone-input-error" : ""}`}
        inputStyle={{
          "width": "100%"
        }}
        defaultCountry="kz"
        value={phone}
        onChange={setPhone}
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
