import React, { useContext }  from 'react';
import { UserContext } from '../../context/UserContext';

//Libraries && MUI
import { useNavigate } from 'react-router-dom'
import { styled, alpha } from '@mui/material/styles';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import HomeIcon from '@mui/icons-material/Home';
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import Divider from '@mui/material/Divider';
import InventoryIcon from '@mui/icons-material/Inventory';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';
import LogoutIcon from '@mui/icons-material/Logout';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';

// API Services
import { clearJwt } from '../../ApiServices/JwtService'

// Styling
import './Dropdown.css'

export default function Dropdown() {
  const navigate = useNavigate();
  const {toggleTheme, theme: userTheme, currentUser} = useContext(UserContext)
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = (event) => {
    setAnchorEl(null);
    const target = event.target.getAttribute("name");

    if(target === 'logout'){
      navigate('/login')
      clearJwt()
    }else if(target === 'profile'){
      navigate('/task-manager/profile')
    } else if(target === 'archive'){
      navigate('/task-manager/archived-tasks')
    } else if(target === 'home'){
      navigate('/task-manager')
    } else if(target === 'theme'){
      toggleTheme()
    }
  };

  const StyledMenu = styled((props) => (
    <Menu
      elevation={0}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'right',
      }}
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      {...props}
    />
  ))(({ theme }) => ({
    '& .MuiPaper-root': {
      borderRadius: 6,
      marginTop: theme.spacing(1),
      minWidth: 180,
      border: userTheme === 'dark' ? '1px solid rgb(50, 50, 50)' : 'none',
      backgroundColor: userTheme === 'light' ? 'rgb(255, 255, 255)' : 'rgb(0, 0, 0)',
      color:
        userTheme === 'light' ? 'rgb(55, 65, 81)' : 'rgb(255, 255, 255)',
      boxShadow:
        'rgb(255, 255, 255) 0px 0px 0px 0px, rgba(0, 0, 0, 0.05) 0px 0px 0px 1px, rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px',
      '& .MuiMenu-list': {
        padding: '4px 0',
      },
      '& .MuiMenuItem-root': {
        '& .MuiSvgIcon-root': {
          fontSize: 18,
          color: theme.palette.text.secondary,
          marginRight: theme.spacing(1.5),
        },
        '&:active': {
          backgroundColor: alpha(
            theme.palette.primary.main,
            theme.palette.action.selectedOpacity,
          ),
        },
      },
    },
  }));

  const styles = {color: userTheme==='dark' ? 'white' : 'black' }


  return (
    <div>
      <Button
        id="demo-customized-button"
        aria-controls={open ? 'demo-customized-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        variant="contained"
        disableElevation
        onClick={handleClick}
      >
        <Avatar src={currentUser?.userInfo[0].avatar} sx={{ m: 1, bgcolor: '#ff3d00' }}>{currentUser?.userInfo[0].name[0]}</Avatar>
        <p className="user">{currentUser.userInfo[0]?.name}</p>
        {open ? <KeyboardArrowUpIcon style={styles} className="user-icon"/> : <KeyboardArrowDownIcon style={styles} className="user-icon"/>}
      </Button>
      <StyledMenu
        id="demo-customized-menu"
        MenuListProps={{
          'aria-labelledby': 'demo-customized-button',
        }}
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
      >
        <MenuItem className="menuItem" name="home" onClick={(event) => handleClose(event)} disableRipple>
          <HomeIcon style={styles}/>
          Home
        </MenuItem>
        <MenuItem className="menuItem" name="profile" onClick={(event) => handleClose(event)} disableRipple>
          <AccountBoxIcon style={styles} />
          Profile
        </MenuItem>
        <MenuItem className="menuItem" name="archive" onClick={(event) => handleClose(event)} disableRipple>
          <InventoryIcon style={styles} />
          Archived Tasks
        </MenuItem>
        <Divider sx={{ my: 0.5}} style={{backgroundColor: userTheme==='dark' ? 'rgb(250, 250, 250)' : 'rgb(200, 200, 200)'}} />
        <MenuItem className="menuItem" name="theme" onClick={(event) => handleClose(event)} disableRipple>
          {userTheme === 'light' ? <DarkModeIcon style={styles} /> : <LightModeIcon style={styles} />}
          {userTheme === 'light' ? 'Dark Mode' : 'Light Mode'}
        </MenuItem>
        <MenuItem className="menuItem" name="logout" onClick={(event) => handleClose(event)} disableRipple>
          <LogoutIcon style={styles} />
          Log Out
        </MenuItem>
      </StyledMenu>
    </div>
  );
}