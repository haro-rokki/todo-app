import React, { useState } from 'react'
import './App.css'
import 'semantic-ui-css/semantic.min.css'
import TaskInput from 'components/TaskInput'
import TaskList from 'components/TaskList'
import gql from 'graphql-tag'
import { useQuery } from 'react-apollo-hooks'

export const GET_TODOS = gql`
  query {
    allTodos {
      id
      title
      done
    }
  }
`

const App: React.FC = () => {
  const { data, error, loading } = useQuery(GET_TODOS)
  const [tasks, setTasks] = useState(data)
  if (loading) {
    return <div>Loading...</div>
  }
  if (error) {
    return <div>`Error! ${error.message}`</div>
  }

  return (
    <div className="AppContainer">
      <TaskInput setTasks={setTasks} tasks={tasks} />
      <TaskList setTasks={setTasks} tasks={tasks} />
    </div>
  )
}

export default App
