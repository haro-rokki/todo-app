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
  mutation DeleteTodo($id: ID!) {
    deleteTodo(id: $id) {
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

  const handleDone = (task: Task) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === task.id ? { ...task, done: !task.done } : t)),
    )
  }

  const handleDelete = async (task: Task) => {
    await setTodoId(task.id)
    await deleteTodo()
    setTodoId('')
    setTasks((prev) => prev.filter((t) => t.id !== task.id))
  }

  return (
    <div className="inner">
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
