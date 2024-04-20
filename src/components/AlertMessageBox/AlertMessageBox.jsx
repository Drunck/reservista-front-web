import React from 'react'
import "./AlertMessageBox.css";

export default function AlertMessageBox({ type, title, message }) {
  return (
    <div className={`alert alert-${type}`}>
      <h3 className="m-0 alert-title">{title}</h3>
      <p className="alert-content m-0">{message}</p>
    </div>
  )
}
