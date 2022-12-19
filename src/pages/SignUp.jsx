import React, {useState} from 'react';
import {Link} from 'react-router-dom'
import '../styling/SignUp.css'
import eyeSlash from '../assets/eye-slash.svg'
import eye from '../assets/eye.svg'

export default function Login(){
  const [showPassword, setShowPassword] = useState(false);

  function password(event){setShowPassword(prevPass => !prevPass);}
  const styles = { backgroundImage: showPassword ? `url(${eye})` : `url(${eyeSlash})`}
  const types = showPassword ? 'text' : 'password';
  
  return (
    <div className="sign-up">
      <header>
        <Link to="/"><img className="logo" src = "https://upload.wikimedia.org/wikipedia/commons/8/84/Alternate_Task_Manager_icon.png" ></img></Link>
        <div className="log-in">
          <p>Already have an account?</p>
          <Link to="/Login"><button>Log in</button></Link>
        </div>
      </header>
      <div className="input-field-container">
        <div className="input-field">
          <h1>Sign Up</h1>
          <label htmlFor="name">Name</label>
          <input id="name" name="name" type="text" placeholder="Enter your name" />

          <label htmlFor="email">Email</label>
          <input id="email" name="email" type="email" placeholder="Enter your email" />

          <div className="password-input">
            <input id="password" name="password" type={types} placeholder="Enter Password" />
            <button style={styles} onClick={() => password(event)}></button>
          </div>

          <button>Register</button>
        </div>
        <p className="link">Already have an account? <Link to="/Login">Log in</Link></p>
      </div>
    </div>
  )
}