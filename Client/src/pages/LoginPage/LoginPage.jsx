import React,{ useState, useContext } from 'react';

// Libraries
import { useQuery } from 'react-query'
import { Link, useNavigate } from 'react-router-dom'

// Hooks & Context
import { UserContext } from '../../context/UserContext'

// API Services
import { setJwt } from '../../ApiServices/JwtService'
import { authenticateUser } from '../../ApiServices/AuthService'

// Assets
import eye from '../../assets/eye.svg'
import eyeSlash from '../../assets/eye-slash.svg'

// Styling
import './LoginPage.css'


export default function Login(){
  const { loginUser } = useContext(UserContext);

// initialize and states
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [responseMessage, setResponseMessage] = useState({state: false, error: '', msg: ''});
  const [loginForm, setLoginForm] = useState({
    email: '',
    password: ''
  });


// stores backend call that checks user authentication in refetch
  const {refetch, isRefetching } = useQuery(
    ['authentication', loginForm], 
    ()=> authenticateUser(loginForm), 
    {
      enabled: false,
      refetchOnWindowFocus: false,
    }
  );
  

// handles Input changes
  const handleFormChange = (event) => {
    const { name, value } = event.target;
    setLoginForm(prevForm => ({ ...prevForm, [name] : value }));
  }


// calls authentication refetch on Login Click
  const handleLoginClick = async () => {
    // checks for missing inputs
    if(Object.values(loginForm).indexOf('') > -1){
      setResponseMessage({state: true, error:'missing', msg: 'Missing Input Fields'})
      return;
    }
    // refetch call
    const loginResponse  = await refetch();

    if (!loginResponse.isError && loginResponse.data.jwt) {
      const token = loginResponse.data.jwt
      setJwt(token);
      const payload = JSON.parse(window.atob(token.split(".")[1]))
      navigate('/task-manager');
    } else{
      setResponseMessage({state: true, error: 'error', msg: 'Sorry, We could not find a user with this login information'})
    }
  }


// show password button styling
  function password(event){setShowPassword(prevPass => !prevPass);}
  const styles = { backgroundImage: showPassword ? `url(${eye})` : `url(${eyeSlash})`}
  const types = showPassword ? 'text' : 'password';

  return (
    <div className="login">
      <header>
        <Link to="/"><img className="logo" src = "https://upload.wikimedia.org/wikipedia/commons/8/84/Alternate_Task_Manager_icon.png" ></img></Link>
        <div className="sign-up-section">
          <p>Don't have an account?</p>
          <Link to="/"><button>Sign up</button></Link>
        </div>
      </header>
      <div className="input-field-container">
        <div className="input-field">
          <h1>Login</h1>
          {
            responseMessage.state && 
              <div className="login-response-message">
                <p>{responseMessage.msg}</p>
              </div>
          }
          <label htmlFor="email">Email</label>
          <input 
            onChange={(event) => handleFormChange(event)} 
            id={(responseMessage.error === 'missing' && loginForm.email === '') ? 'error' : 'email'} 
            name="email" 
            type="email" 
            placeholder="Enter your email" 
          />

          <label htmlFor="password">Password</label>
          <div className="password-input">
            <input 
              onChange={(event) => handleFormChange(event)} 
              id={(responseMessage.error === 'missing' && loginForm.password === '') ? 'error' : 'password'}
              name="password" 
              type={types} 
              placeholder="Enter Password" 
            />
            <button style={styles} onClick={() => password(event)}></button>
          </div>

          <button onClick={() => handleLoginClick()}>{isRefetching ? 'Loading...' : 'Log in'}</button>
        </div>
        <p className="link">Don't have an account? <Link to="/">Sign up</Link></p>
      </div>
    </div>
  )
}