import '../styling/Sidebar.css'

export default function Sidebar(props) {

    //create an array of divs corresponding to inputted group names
    const groupElements = props.groupData.map((group, index) => {
        if (index > 0) {
            return(
                <div key = {index} className = 'group'>
                    {group.title}
                </div>
            )
        }
        else return;
    })

    return(
        <div id = 'groups'>
            {groupElements}
        </div>
    )
}