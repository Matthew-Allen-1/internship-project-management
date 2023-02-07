import react, {useContext} from 'react'

// Libraries
import { useMutation, useQueryClient } from 'react-query'

// API Requests && Context
import { addTaskRequest } from '../ApiServices/TasksService';
import { UserContext } from '../context/UserContext';


export default function useMutationAddTask(){
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