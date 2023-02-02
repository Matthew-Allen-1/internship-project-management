import React from 'react'
import { useQuery } from 'react-query'

import { fetchArchivedTasks } from '../../ApiServices/TasksService';

import Navbar from '../../Components/Navbar/Navbar';
import GroupedTask from '../../Components/GroupedTask/GroupedTask';

import './ArchivedTasksPage.css'
export default function ArchivedTasks() {
  const { data: archiveData , isLoading: archiveLoading, isError: archiveError , refetch} = useQuery(
    'archived-tasks', 
    fetchArchivedTasks,
    {
      refetchOnWindowFocus: false,
    }
  );
  const groupSelection = 'default'

  if( archiveLoading ) return <p>Loading...</p>
  if(archiveError) return <p>An Error occurred</p>
  const archivedTasks = archiveData.tasks;
  const archivedGroups = archiveData.groups;

  return(
    <div>
      <Navbar user={archiveData?.name} />
      <div className="archived-tasks-container">
        Archived Tasks
        <GroupedTask 
          groupData = {archivedGroups}
          taskData = {archivedTasks}
          groupSelection = {groupSelection}
        />
      </div>
    </div>
  )
}