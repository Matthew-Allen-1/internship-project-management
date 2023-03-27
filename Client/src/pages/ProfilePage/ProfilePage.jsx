import react, { useState, useContext } from 'react'
import { useMutation, useQueryClient, useQuery } from 'react-query'
import { UserContext } from '../../context/UserContext'
import Navbar from '../../Components/Navbar/Navbar'
import { Avatar, IconButton } from '@mui/material'
import { updateAvatarRequest } from '../../ApiServices/TasksService'

import eye from '../../Assets/eye.svg'
import eyeSlash from '../../Assets/eye-slash.svg'

import { fetchUser } from '../../ApiServices/TasksService'

import './ProfilePage.css'


export default function Profile() {
  const { currentUser, loginUser } = useContext(UserContext);
  const queryClient = useQueryClient()
  const [input, setInput] = useState({name: currentUser.name, email: currentUser.email, password:"", avatar: currentUser.avatar})
  const [previewImage, setPreviewImage] = useState(currentUser?.avatar);
  const [showPassword, setShowPassword] = useState(false);
  const [changes, setChanges] = useState(false);
  const [responseMessage, setResponseMessage] = useState({state: false, error: '', msg: ''});

  const { mutate: mutateUpdateAvatar } = useMutation(
    (newAvatar) => updateAvatarRequest(newAvatar),
    {
      onSuccess: (data) => {
        queryClient.invalidateQueries(['user'])
        setInput(prevInput => ({...prevInput, avatar: ''}))
        console.log(data);
        if(!data){
          setResponseMessage({state: true, error: 'error', msg: 'Incorrect Password Entered'})
        }
      },
      onError: (data) => {
        setResponseMessage({state: true, error: 'error', msg: 'An Error Occurred'})
      }
    });

    const { data: userData , isLoading: userLoading, isError: userError , refetch: userRefetch} = useQuery(
      'user', 
      fetchUser,
      {
        refetchOnWindowFocus: false,
        onSuccess: (data) => {
          loginUser(data)
          setChanges(false)
        },
      }
    );

    if( userLoading ) return <p>Loading...</p>
    if( userError ) return <p>An Error occurred</p>

  function avatarChange(event){
    setInput(prevInput => ({...prevInput, [event.target.name]: event.target.files[0]}))
    setPreviewImage(URL.createObjectURL(event.target.files[0]));
    setChanges(true)
    setResponseMessage({state: false})
  }

  function inputChange(event){
    setInput(prevInput => ({...prevInput, [event.target.name] : event.target.value}))
    setChanges(true)
    setResponseMessage({state: false})
  }

  async function handleClick(event){
    setInput(prevInput => ({...prevInput, password: ''}))
    if(event.target.name === 'save'){
      let formData = new FormData();
      formData.append('avatar', input.avatar);
      formData.append('name', input.name);
      formData.append('email', input.email);
      formData.append('password', input.password);
      mutateUpdateAvatar(formData);
    }
  }

  function password(event){setShowPassword(prevPass => !prevPass);}
  const styles = { backgroundImage: showPassword ? `url(${eye})` : `url(${eyeSlash})`}
  const types = showPassword ? 'text' : 'password';

  return(
    <main className="profile-page">
      <div className="App">
        <Navbar />
        <div className="avatar">
          <input accept="image/*" id="avatar-pic" name="avatar" onChange={(event) => avatarChange(event)}type='file' hidden></input>
          <label htmlFor="avatar-pic">
            <IconButton component="span">
              <Avatar src={previewImage} sx={{ fontSize: 100, width: 200, height: 200, m: 1, bgcolor: '#ff3d00' }}>{currentUser.name}</Avatar>
            </IconButton>
          </label>
        </div>
        <p>Member since: {new Date(Number(currentUser.date_created)).toLocaleString()}</p>
        <div className="input-container">
          {
            responseMessage.state && 
              <div className="profile-message">
                <p>{responseMessage.msg}</p>
              </div>
          }
          <div className="username">
            <p>Username: </p>
            <input type="text" name="name" value={input.name} onChange={(event) => inputChange(event)}></input>
          </div>
          <div className="email">
            <p>Email: </p>
          <input type="text" name="email" value={input.email} onChange={(event) => inputChange(event)}></input>
          </div>
          {changes && 
            <div className="password">
              <p>Password: </p>
              <input name="password" value={input.password} type={types} onChange={(event) => inputChange(event)}></input>
              <button style={styles} onClick={(event) => password(event)}></button>
            </div>
          }
          {changes && <button className="save-avatar-btn" name="save" onClick={(event) => handleClick(event)} disabled={input.password == ''}>Save Changes</button>}
        </div>
      </div>
    </main>
  )
}