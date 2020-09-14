import React, { useState, useEffect } from 'react'
import './App.css'
import 'semantic-ui-css/semantic.min.css'
import TaskInput from 'components/TaskInput'
import TaskList from 'components/TaskList'
import gql from 'graphql-tag'
import { BrowserRouter } from 'react-router-dom'
import { useQuery } from 'react-apollo'
import { Task } from './components/Types'

export const ROOT_QUERY = gql`
  query {
    allTodos {
      id
      title
      done
    }
  }
`

interface TaskData {
  allTodos: Task[]
}

const App: React.FC = () => {
  const { data, loading } = useQuery<TaskData>(ROOT_QUERY)
  const [tasks, setTasks] = useState<Task[]>(data ? data.allTodos : [])

  useEffect(() => {
    if (loading === false && data) {
      setTasks(data.allTodos)
    }
  }, [loading, data])

  return (
    <BrowserRouter>
      {loading ? (
        <p>Loading ...</p>
      ) : (
        <div className="AppContainer">
          <TaskInput setTasks={setTasks} tasks={tasks} />
          <TaskList setTasks={setTasks} tasks={tasks} />
        </div>
      )}
    </BrowserRouter>
  )
}

export default App
