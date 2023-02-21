import React, { useState, useContext } from 'react'

import { useMutation, useQueryClient } from 'react-query';
import { UserContext } from '../../context/UserContext' 

import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';

import { deleteGroupRequest } from '../../ApiServices/TasksService';

import { useMutationDeleteGroup } from '../../hooks/useMutationHook';

// Styling
import './Sidebar.css'

export default function Sidebar(props) {
    const queryClient = useQueryClient();
    const { theme } = useContext(UserContext);
    const [deleteGroupBtn, setDeleteGroupBtn] = useState(false);
    const { mutate: mutateDeleteGroup } = useMutationDeleteGroup();

    function handleOptionsClick(){
        setDeleteGroupBtn(prev => !prev);
    }
    function deleteGroupClick(id){
        if(props.taskData.filter(task => task.group_id === id).length !== 0){
            alert('There are still tasks associated with this group')
        } else{
            mutateDeleteGroup(id);
            props.updateGroupAfterDelete();
        }
        setDeleteGroupBtn(false);
    }

    const groupElements = props.groupData.map(group => {
        return (
            <div key={group.group_id} id={group.group_id} className="group-container">
                <div id={group.group_id}
                    className='group'
                    onClick = {(event) => props.handleGroupSelection(event)}
                    style = {{backgroundColor : theme === 'light' ? props.groupSelection === group.group_id ? '#c4eaee':'white' : props.groupSelection === group.group_id ? '#323232':'black'}}
                >
                    <p id={group.group_id} onClick = {(event) => props.handleGroupSelection(event)}>{group.title}</p>
                </div>
                {deleteGroupBtn && <RemoveCircleIcon fontSize="small" className='remove-circle-icon' onClick={() => deleteGroupClick(group.group_id)} />}
            </div>
        )
    })

    return(
        <div className="sidebar">
            <div id='default' className="group-container">
                <div id='default' className='group'
                    onClick = {(event) => props.handleGroupSelection(event)}
                    style = {{backgroundColor : theme === 'light' ? props.groupSelection === 'default' ? '#c4eaee':'white': props.groupSelection === 'default' ? '#323232':'black'}}
                >
                    <p id='default' onClick = {(event) => props.handleGroupSelection(event)}>All Tasks</p>
                </div>
            </div>
            <div id='unscheduled' className="group-container">
                <div id='unscheduled' className='group'
                    onClick = {(event) => props.handleGroupSelection(event)}
                    style = {{backgroundColor : theme==='light' ? props.groupSelection === 'unscheduled' ? '#c4eaee':'white' : props.groupSelection === 'unscheduled' ? '#323232':'black'}}
                >
                    <p id='unscheduled' onClick = {(event) => props.handleGroupSelection(event)}>Unscheduled Tasks</p>
                </div>
            </div>
            <h4 id='tasks-sidebar-heading'>Tasks <MoreHorizIcon className="group-options-btn" onClick={handleOptionsClick}/></h4>
            {groupElements}
        </div>
    )
}