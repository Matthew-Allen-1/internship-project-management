import React from 'react';
import '../styling/SignUp.css'

export default function Login(){
  return (
    <div className="sign-up">
      <header>
        <img className="logo" src = "https://upload.wikimedia.org/wikipedia/commons/8/84/Alternate_Task_Manager_icon.png" ></img>
        <div className="log-in">
          <p>Already have an account?</p>
          <button>Log in</button>
        </div>
      </header>
      <div className="input-field-container">
        <div className="input-field">
          <h1>Sign Up</h1>
          <label htmlFor="name">Name</label>
          <input id="name" name="name" type="text" placeholder="Enter your name" />

          <label htmlFor="email">Email</label>
          <input id="email" name="email" type="email" placeholder="Enter your email" />

          <label htmlFor="password">Password</label>
          <input id="password" name="password" type="password" placeholder="Enter Password" />

          <button>Register</button>
        </div>
        <p className="link">Already have an account? <a href="">Log in</a></p>
      </div>
    </div>
  )
}