import React, { useState } from 'react'

import { useMutation, useQueryClient } from 'react-query';

import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';

import { deleteGroupRequest } from '../../ApiServices/TasksService';

// Styling
import './Sidebar.css'

export default function Sidebar(props) {
    const queryClient = useQueryClient();
    const [deleteGroupBtn, setDeleteGroupBtn] = useState(false);

    const { mutate: mutateDeleteGroup } = useMutation(
        (id) => deleteGroupRequest(id),
        {
          onSuccess: () => queryClient.invalidateQueries(['tasks'])
        }
      );

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
                    style = {{backgroundColor : props.groupSelection === group.group_id ? '#c4eaee':'white'}}
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
                    style = {{backgroundColor : props.groupSelection === 'default' ? '#c4eaee':'white'}}
                >
                    <p id='default' onClick = {(event) => props.handleGroupSelection(event)}>All Tasks</p>
                </div>
            </div>
            <div id='unscheduled' className="group-container">
                <div id='unscheduled' className='group'
                    onClick = {(event) => props.handleGroupSelection(event)}
                    style = {{backgroundColor : props.groupSelection === 'unscheduled' ? '#c4eaee':'white'}}
                >
                    <p id='unscheduled' onClick = {(event) => props.handleGroupSelection(event)}>Unscheduled Tasks</p>
                </div>
            </div>
            <h4>Tasks <MoreHorizIcon className="group-options-btn" onClick={handleOptionsClick}/></h4>
            {groupElements}
        </div>
    )
}