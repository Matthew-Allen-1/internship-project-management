import '../styling/Navbar.css'

export default function NavBar (props) {
    return (
        <nav id = "nav">
            <img id = "task-manager-icon" src = "https://upload.wikimedia.org/wikipedia/commons/8/84/Alternate_Task_Manager_icon.png" />
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
                <h4 className = "nav-title-url">BVTCA Task Manager</h4>
            </div>
            <div className = "nav-buttons">
                <button className = "nav-button" id = "sign-up-button">Sign Up</button>
                <button className = "nav-button" id = "login-button">Login</button>
            </div>
        </nav>
    )
}