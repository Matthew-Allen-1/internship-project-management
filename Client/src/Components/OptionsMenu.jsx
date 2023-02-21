import React, { useState, useContext } from "react"
import { UserContext } from "../context/UserContext"
import {SlOptionsVertical} from 'react-icons/sl'
import Menu from "@mui/material/Menu"
import MenuItem from "@mui/material/MenuItem"
import MoreVertIcon from "@mui/icons-material/MoreVert"

const ITEM_HEIGHT = 48

export default function OptionsMenu(props) {
  const [anchorEl, setAnchorEl] = useState(null)
  const { theme } = useContext(UserContext)
  const open = Boolean(anchorEl)
  const handleClick = event => {
    setAnchorEl(event.currentTarget)
  }
  const handleClose = (event) => {
    const target = event.target.getAttribute('name');
    setAnchorEl(null)
    if(target === 'Delete'){
      props.deleteTask(event)
    } else if(target === 'Duplicate'){
      props.duplicateTask(props.id)
    } else if(target === 'Archive'){
      props.archiveTask(target)
    } else if (target === 'unArchive'){
      props.archiveTask(target);
    }
  }

  const options = [
    "Duplicate",
    "Delete",
    props.archived ? "unArchive" : "Archive",
]

  return (
    <div>
      <SlOptionsVertical
        aria-label="more"
        id="long-button"
        aria-controls={open ? "long-menu" : undefined}
        aria-expanded={open ? "true" : undefined}
        aria-haspopup="true"
        onClick={handleClick}
      >
        <MoreVertIcon />
      </SlOptionsVertical>
      <Menu
        id="long-menu"
        MenuListProps={{
          "aria-labelledby": "long-button"
        }}
        anchorEl={anchorEl}
        open={open}
        onClose={(event) => handleClose(event)}
        PaperProps={{
          style: {
            maxHeight: ITEM_HEIGHT * 4.5,
            width: "12ch",
            backgroundColor: theme === 'light' ? 'rgb(255, 255, 255)' : 'rgb(0, 0, 0)'
          }
        }}
      >
        {options.map(option => (
          <MenuItem
            key={option}
            name={option}
            selected={option === "Pyxis"}
            style={{color: theme === 'light' ? 'rgb(0, 0, 0)' :'rgb(255, 255, 255'}}
            onClick={(event) => handleClose(event)}
          >
            {option}
          </MenuItem>
        ))}
      </Menu>
    </div>
  )
}