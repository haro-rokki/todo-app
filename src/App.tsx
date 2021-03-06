/** @jsx jsx */
import { jsx } from '@emotion/core'
import React, { useState, useEffect } from 'react'
import './App.css'
import 'semantic-ui-css/semantic.min.css'
import TaskInput from 'components/TaskInput'
import TaskList from 'components/TaskList'
import gql from 'graphql-tag'
import { BrowserRouter } from 'react-router-dom'
import { useQuery } from 'react-apollo'
import { Task } from './components/Types'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import { Dimmer, Loader } from 'semantic-ui-react'

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
      <div className="AppContainer">
        <Dimmer active={loading}>
          <Loader />
        </Dimmer>
        <TaskInput setTasks={setTasks} tasks={tasks} />
        <DndProvider backend={HTML5Backend}>
          <TaskList setTasks={setTasks} tasks={tasks} />
        </DndProvider>
      </div>
    </BrowserRouter>
  )
}

export default App
