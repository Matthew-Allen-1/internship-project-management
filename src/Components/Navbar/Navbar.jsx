// Libraries
import {Link} from 'react-router-dom'

// Api Services
import { clearJwt } from '../../ApiServices/JwtService'

// Styling
import './Navbar.css'


export default function NavBar (props) {
    return (
        <nav id = "nav">
            <img id = "task-manager-icon" src = "https://upload.wikimedia.org/wikipedia/commons/f/fb/Adobe_Illustrator_CC_icon.svg" />
            <div className = "nav-menu">
                <button className = "button nav-menu-button" data-bs-toggle = "collapse" data-bs-target = "#collapse-nav-menu" aria-expanded = "false" aria-controls = "menu">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 30 30" width="30" height="30" focusable="false">
                        <title>Menu</title>
                        <path stroke="currentColor" strokeWidth="2" strokeLinecap = "round" strokeMiterlimit = "10" d = "M4 7h22M4 15h22M4 23h22"></path>
                    </svg>
                </button>
                <div className = "collapse" id = "collapse-nav-menu">
                </div>
            </div>
            <div className = "nav-title">
                <h4 className = "nav-title-url">Bay Valley Tech AI Code Repository</h4>
            </div>
            <div className = "user-info">
                <p>Welcome, {props.user}</p>
                <Link className="user-info-link" to="/Login" onClick={clearJwt}>Sign Out</Link>
            </div>
        </nav>
    )
}