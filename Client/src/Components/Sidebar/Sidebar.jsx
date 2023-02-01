// Styling
import './Sidebar.css'

export default function Sidebar(props) {

    const groupElements = props.groupData.map(group => {
        return (
            <div key={group.group_id} id={group.group_id}
                className='group'
                onClick = {(event) => props.handleGroupSelection(event)}
                style = {{backgroundColor : props.groupSelection === group.group_id ? '#c4eaee':'white'}}
            >
                {group.title}
            </div>
        )
    })

    return(
        <div id = 'groups'>
            <div id='default' className='group'
                onClick = {(event) => props.handleGroupSelection(event)}
                style = {{backgroundColor : props.groupSelection === 'default' ? '#c4eaee':'white'}}
            >
                All Tasks
            </div>
            <div id='unscheduled' className='group'
                onClick = {(event) => props.handleGroupSelection(event)}
                style = {{backgroundColor : props.groupSelection === 'unscheduled' ? '#c4eaee':'white'}}
            >
                Unscheduled Tasks
            </div>
            <h4>Tasks</h4>
            {groupElements}
        </div>
    )
}