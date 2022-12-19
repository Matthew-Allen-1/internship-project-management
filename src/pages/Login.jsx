import React,{useState} from 'react';
import {Link} from 'react-router-dom'
import '../styling/Login.css'
import eyeSlash from '../assets/eye-slash.svg'
import eye from '../assets/eye.svg'

export default function Login(){
  const [showPassword, setShowPassword] = useState(false);

  function password(event){setShowPassword(prevPass => !prevPass);}
  const styles = { backgroundImage: showPassword ? `url(${eye})` : `url(${eyeSlash})`}
  const types = showPassword ? 'text' : 'password';

  return (
    <div className="login">
      <header>
        <Link to="/"><img className="logo" src = "https://upload.wikimedia.org/wikipedia/commons/8/84/Alternate_Task_Manager_icon.png" ></img></Link>
        <div className="sign-up-section">
          <p>Don't have an account?</p>
          <Link to="/SignUp"><button>Sign up</button></Link>
        </div>
      </header>
      <div className="input-field-container">
        <div className="input-field">
          <h1>Login</h1>
          <label htmlFor="email">Email</label>
          <input id="email" name="email" type="email" placeholder="Enter your email" />

          <label htmlFor="password">Password</label>
          <div className="password-input">
            <input id="password" name="password" type={types} placeholder="Enter Password" />
            <button style={styles} onClick={() => password(event)}></button>
          </div>

          <button>Log in</button>
        </div>
        <p className="link">Don't have an account? <Link to="/SignUp">Sign up</Link></p>
      </div>
    </div>
  )
}