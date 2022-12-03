export default function Groups(props) {
    const groupElements = []

    for (let i = 0; i < props.number; i++)
        groupElements.push (
            <div key = {i} className = 'group'>
                Option {i + 1}
            </div>
        )

    return(
        <div id = 'groups'>
            {groupElements}
        </div>
    )
}