import React,{ useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'
import { useQuery } from 'react-query'

import { authenticateUser } from '../ApiServices/AuthService'
import { setJwt } from '../ApiServices/JwtService'

import '../styling/Login.css'
import eyeSlash from '../assets/eye-slash.svg'
import eye from '../assets/eye.svg'

export default function Login(){
  const [showPassword, setShowPassword] = useState(false);
  const [loginForm, setLoginForm] = useState({
    email: '',
    password: ''
  });
  const {refetch, isRefetching } = useQuery(['authentication', loginForm], ()=> authenticateUser(loginForm), {
    enabled: false,
    refetchOnWindowFocus: false
  });
  const navigate = useNavigate();

  const handleFormChange = (event) => {
    const { name, value } = event.target;

    setLoginForm(prevForm => {
      return { ...prevForm, [name] : value }
    });
  }

  const handleLoginClick = async () => {
    const loginResponse  = await refetch();

    if (!loginResponse.error && loginResponse.data.jwt) {
      setJwt(loginResponse.data.jwt);
      navigate('/');
    }
  }

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
          <input onChange={(event) => handleFormChange(event)} id="email" name="email" type="email" placeholder="Enter your email" />

          <label htmlFor="password">Password</label>
          <div className="password-input">
            <input onChange={(event) => handleFormChange(event)} id="password" name="password" type={types} placeholder="Enter Password" />
            <button style={styles} onClick={() => password(event)}></button>
          </div>

          <button onClick={() => handleLoginClick()}>{isRefetching ? 'Loading...' : 'Log in'}</button>
        </div>
        <p className="link">Don't have an account? <Link to="/SignUp">Sign up</Link></p>
      </div>
    </div>
  )
}