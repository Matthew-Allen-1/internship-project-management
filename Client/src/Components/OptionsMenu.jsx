import React, { useState } from "react"
import {SlOptionsVertical} from 'react-icons/sl'
import Menu from "@mui/material/Menu"
import MenuItem from "@mui/material/MenuItem"
import MoreVertIcon from "@mui/icons-material/MoreVert"

const options = [
    "Duplicate",
    "Delete",
]

const ITEM_HEIGHT = 48

export default function OptionsMenu(props) {
  const [anchorEl, setAnchorEl] = useState(null)
  const open = Boolean(anchorEl)
  const handleClick = event => {
    setAnchorEl(event.currentTarget)
  }
  const handleClose = (event) => {
    setAnchorEl(null)
    props.deleteTask(event)
  }

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
            width: "20ch"
          }
        }}
      >
        {options.map(option => (
          <MenuItem
            key={option}
            selected={option === "Pyxis"}
            onClick={(event) => handleClose(event)}
          >
            {option}
          </MenuItem>
        ))}
      </Menu>
    </div>
  )
}