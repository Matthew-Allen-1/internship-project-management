// Components
import Dropdown from '../Menu/Dropdown';

// Styling
import './Navbar.css'


export default function NavBar (props) {
    return (
        <nav id = "nav">
            <img id = "task-manager-icon" src = "https://upload.wikimedia.org/wikipedia/commons/8/84/Alternate_Task_Manager_icon.png" />
            <div className = "nav-title">
                <h4 className = "nav-title-url">BVTCA Task Manager</h4>
            </div>
            <Dropdown name={props.user} />
        </nav>
    )
}