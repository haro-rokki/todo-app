import React, { useState } from 'react'
import TaskItem from './TaskItem'
import { Task } from './Types'
import { List } from 'semantic-ui-react'
import gql from 'graphql-tag'
import { useMutation } from 'react-apollo'

type Props = {
  tasks: Task[]
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>
}

const DELETE_TODO = gql`
  mutation deleteTodo($id: ID!) {
    deleteTodo(id: $id) {
      id
      title
      done
    }
  }
`

const DONE_TODO = gql`
  mutation doneTodo($id: ID!) {
    doneTodo(id: $id) {
      id
      title
      done
    }
  }
`

const TaskList: React.FC<Props> = ({ tasks, setTasks }) => {
  const [todoId, setTodoId] = useState<string>('')
  const [deleteTodo, { data }] = useMutation<
    { deleteTodo: Task },
    { id: String }
  >(DELETE_TODO, {
    variables: { id: todoId },
  })

  const [doneTodo, { data: dataDone }] = useMutation<
    { doneTodo: Task },
    { id: String }
  >(DONE_TODO, {
    variables: { id: todoId },
  })

  const handleDone = async (task: Task) => {
    await setTodoId(task.id)
    await doneTodo()
    await setTodoId('')
    setTasks(() =>
      tasks.map((t) => (t.id === task.id ? { ...task, done: !task.done } : t)),
    )
  }

  const handleDelete = async (task: Task) => {
    await setTodoId(task.id)
    await deleteTodo()
    await setTodoId('')
    setTasks(() => tasks.filter((t) => t.id !== task.id))
  }

  return (
    <div className="inner">
      {dataDone && dataDone.doneTodo ? <p>Done!</p> : null}
      {data && data.deleteTodo ? <p>Deleted!</p> : null}
      {tasks.length <= 0 ? (
        '登録されたTODOはありません'
      ) : (
        <List>
          {tasks.map((task) => (
            <List.Item key={task.id}>
              <TaskItem
                key={task.id}
                task={task}
                handleDelete={handleDelete}
                handleDone={handleDone}
              />
            </List.Item>
          ))}
        </List>
      )}
    </div>
  )
}

export default TaskList
