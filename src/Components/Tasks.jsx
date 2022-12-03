export default function Tasks(props) {

    const taskElements = []
    
    for (let i = 0; i < props.number; i++) {
        taskElements.push(
            <div key = {i} className = 'task'>
                <span>Little box</span>
                <span>Task title</span>
                <span>Info about task</span>
                <span>options, duplicate, delete</span>
            </div>
        )
    }

    return(
        <div id = 'tasks'>
            <form id = "input-new-task">
                <input type = 'text' placeholder = 'Input task here.'>

                </input>
                <button type = 'submit'>
                Add
                </button>
            </form>
            <span id = 'tasks-header'>
                <h2>Tasks</h2>
                <p>Options to grouped tasks</p>
            </span>
            <div id = 'task-table'>
                {taskElements}
            </div>
        </div>
    )
}