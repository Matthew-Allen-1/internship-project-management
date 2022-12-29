import '../styling/Sidebar.css'

export default function Sidebar(props) {

    //Create an array of divs corresponding to inputted group names.
    const groupElements = props.groupData.map((group, index) => {
        return(
            <div key = {index} className = 'group' 
                onClick = {() => props.handleGroupSelection(event, index)} 
                style = {props.groupSidebarStyles[index]}
            >
                {index > 0 ? group.title : 'All Tasks'}
            </div>
        )
    })

    //Add one additional div for 'unscheduled tasks'.
    groupElements.push(
        <div key = {props.groupData.length} className = 'group' 
            onClick = {() => props.handleGroupSelection(event, props.groupData.length)} 
            style = {props.groupSidebarStyles[props.groupData.length]}
        >
            Unscheduled Tasks
        </div>
    )

    return(
        <div id = 'groups'>
            {groupElements}
        </div>
    )
}