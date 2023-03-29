// Styling
import './Sidebar.css'

export default function Sidebar(props) {

    //Create an array of divs corresponding to inputted group names.
    const fixedGroupElements = props.groupData.slice(0, 2).map((group, index) => {
        return(
            <div key = {group.id} className = 'fixed-group' 
                onClick = {() => props.handleGroupSelection(event, index)} 
                style = {props.groupSidebarStyles[index]}
            >
                {index > 0 ? group.title : 'All Prompts'}
            </div>
        )
    })

    const groupElements = []

    //Create an array of divs corresponding to inputted group names.
    if (props.groupData.length > 2) {
        groupElements.push(<h4 key = 'h4'>Coding Prompt Groups</h4>)
        props.groupData.slice(2, props.groupData.length).forEach((group, index) => {
            groupElements.push(
                <div key = {group.id} className = 'group' 
                    onClick = {() => props.handleGroupSelection(event, index + 2)} 
                    style = {props.groupSidebarStyles[index + 2]}
                >
                    {group.title}
                </div>
            )
        })
    }

    return(
        <div id = 'groups'>
            {fixedGroupElements}
            {groupElements}
        </div>
    )
}