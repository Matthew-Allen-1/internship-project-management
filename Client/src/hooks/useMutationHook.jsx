import react, {useContext} from 'react'

// Libraries
import { useMutation, useQueryClient } from 'react-query'

// API Requests && Context
import { addTaskRequest, deleteTaskRequest, addGroupRequest, deleteGroupRequest, updateTaskRequest } from '../ApiServices/TasksService';
import { UserContext } from '../context/UserContext';


export function useMutationAddTask(){
  const queryClient = useQueryClient();
  const { updateNewTaskMessage }= useContext(UserContext);

  return useMutation( (newTask) => addTaskRequest(newTask),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['tasks'])
        queryClient.invalidateQueries(['archived-tasks'])
        updateNewTaskMessage(true, "Task Saved")
        setTimeout(() => {
          updateNewTaskMessage(false, '')
        }, 4000)
      }
    }
  );
}

export function useMutationDeleteTask(){
  const queryClient = useQueryClient();
  const { updateNewTaskMessage }= useContext(UserContext);

  return useMutation( (id) => deleteTaskRequest(id),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['tasks'])
        queryClient.invalidateQueries(['archived-tasks'])
        updateNewTaskMessage(true, "Task Deleted")
        setTimeout(() => {
          updateNewTaskMessage(false, '')
        }, 4000)
      }
    }
  );
}

export function useMutationAddGroup(setDropdownActive, setDropdownSearch, setInput, dropdownSearch, type){
  const queryClient = useQueryClient();
  const { updateNewTaskMessage }= useContext(UserContext);

  return useMutation( (newGroup) => addGroupRequest(newGroup),
    {
      onSuccess: (data) => {
        if(type === 'create'){
          setInput(prevInput => ({...prevInput, group_title: dropdownSearch}))
        } else if( type === 'update'){
          queryClient.invalidateQueries(['archived-tasks'])
        }
        queryClient.invalidateQueries(['tasks']);
        setDropdownActive(false);
        setDropdownSearch('');
        updateNewTaskMessage(true, "Group Added")
        setTimeout(() => {
          updateNewTaskMessage(false, '')
        }, 4000)
      }
    }
  );
}

export function useMutationDeleteGroup(){
  const queryClient = useQueryClient();
  const { updateNewTaskMessage }= useContext(UserContext);

  return useMutation(
    (id) => deleteGroupRequest(id),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['tasks']);
        updateNewTaskMessage(true, "Group Deleted")
        setTimeout(() => {
          updateNewTaskMessage(false, '')
        }, 4000)
      }
    }
  );
}

export function useMutationUpdateTask(){
  const queryClient = useQueryClient();
  const { updateNewTaskMessage }= useContext(UserContext);

  return useMutation(
    (groupId) => updateTaskRequest(groupId),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['tasks'])
        queryClient.invalidateQueries(['archived-tasks'])
        updateNewTaskMessage(true, 'Successfully Updated...')
        setTimeout(() => {
          updateNewTaskMessage(false, '')
        }, 2000)
      }
    }
  );
}