// Styling
import './Sidebar.css'

export default function Sidebar(props) {

    //Create an array of divs corresponding to inputted group names.
    // const fixedGroupElements = props.groupData.slice(0, 2).map((group, index) => {
    //     console.log(group);
    //     return(
    //         <div key = {group.id} className = 'fixed-group' 
    //             onClick = {() => props.handleGroupSelection(event, index)} 
    //             style = {props.groupSidebarStyles[index]}
    //         >
    //             {index > 0 ? group.title : 'All Tasks'}
    //         </div>
    //     )
    // })

    // const groupElements = []

    // //Create an array of divs corresponding to inputted group names.
    // if (props.groupData.length > 0) {
    //     groupElements.push(<h4 key = 'h4'>Task Groups</h4>)
    //     props.groupData.slice(0, props.groupData.length).forEach((group, index) => {
    //         groupElements.push(
    //             <div key = {group.group_id} className = 'group' 
    //                 onClick = {() => props.handleGroupSelection(event, index + 2)} 
    //                 style = {props.groupSidebarStyles[index + 2]}
    //             >
    //                 {group.title}
    //             </div>
    //         )
    //     })
    // }


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
            {/* {fixedGroupElements} */}
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