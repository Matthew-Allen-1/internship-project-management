import react from 'react'
import { useMutation, useQueryClient } from 'react-query'
import { addTaskRequest } from '../ApiServices/TasksService';


export default function MutationAddTask(newTask){
  const queryClient = useQueryClient();

  const { mutate: mutateAddTask } = useMutation(
    (newTask) => addTaskRequest(newTask),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['tasks'])
        setNewTaskMessage(true)
        setTimeout(() => {
          setNewTaskMessage(false)
        }, 5000)
      }
    }
  );
}