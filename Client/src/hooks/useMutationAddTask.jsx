import react, {useContext} from 'react'
import { useMutation, useQueryClient } from 'react-query'
import { addTaskRequest } from '../ApiServices/TasksService';
import { UserContext } from '../context/UserContext';


export default function useMutationAddTask(){
  const queryClient = useQueryClient();
  const { updateNewTaskMessage }= useContext(UserContext);

  return useMutation( (newTask) => addTaskRequest(newTask),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['tasks'])
        updateNewTaskMessage(true)
        setTimeout(() => {
          updateNewTaskMessage(false)
        }, 5000)
      }
    }
  );
}