import React, {useState} from 'react';
import {Link, useNavigate} from 'react-router-dom'
import { useQuery } from 'react-query';
import '../styling/SignUp.css'
import eyeSlash from '../assets/eye-slash.svg'
import eye from '../assets/eye.svg'
import { registerUser } from '../ApiServices/AuthService';
import { setJwt } from '../ApiServices/JwtService';

export default function Login(){
  const [showPassword, setShowPassword] = useState(false);
  const [registerForm, setRegisterForm] = useState({
    name: '',
    email: '',
    password: '',
  });

  const { name, email, password} = registerForm;
  const { refetch, isRefetching } = useQuery(
    ['authentication', registerForm], 
    () => registerUser({ name, email, password }), {
    enabled: false,
    refetchOnWindowFocus: false
  });

  const navigate = useNavigate();

  // const passwordMatchMsg = password !== confirmPassword ? 'Passwords must match' : '';

  const handleRegisterClick = async () => {
    const registerResponse = await refetch();

    if (registerResponse?.data && !registerResponse?.error) {
      setJwt(registerResponse.data.jwt);
      navigate('/');
    }
  }

  const handleFormChange = (event) => {
    const { name, value } = event.target;

    setRegisterForm((prevForm) => { 
     return { ...prevForm, [name]: value }
    });
  }

  function showPasswordBtn(event){setShowPassword(prevPass => !prevPass);}
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
          <input onChange={(event) => handleFormChange(event)} id="name" name="name" type="text" placeholder="Enter your name" />

          <label htmlFor="email">Email</label>
          <input onChange={(event) => handleFormChange(event)} id="email" name="email" type="email" placeholder="Enter your email" />

          <label htmlFor="password">password</label>
          <div className="password-input">
            <input onChange={(event) => handleFormChange(event)} id="password" name="password" type={types} placeholder="Enter Password" />
            <button style={styles} onClick={(event) => showPasswordBtn(event)}></button>
          </div>

          <button onClick={() => handleRegisterClick()}>{isRefetching ? 'Loading...' : 'Register'}</button>
          {/* <p className='password-error-text'>{passwordMatchMsg}</p> */}
        </div>
        <p className="link">Already have an account? <Link to="/Login">Log in</Link></p>
      </div>
    </div>
  )
}