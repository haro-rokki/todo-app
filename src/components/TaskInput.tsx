import React, { useState } from 'react'
import { Task } from './Types'
import { Button, Input } from 'semantic-ui-react'
import gql from 'graphql-tag'
import { useMutation } from 'react-apollo'

type Props = {
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>
  tasks: Task[]
}

const ADD_TODO = gql`
  mutation AddTodo($title: String!) {
    addTodo(title: $title) {
      id
      title
      done
    }
  }
`

const TaskInput: React.FC<Props> = ({ setTasks, tasks }) => {
  const [inputTitle, setInputTitle] = useState<string>('')
  const [addTodo, { data }] = useMutation<{ addTodo: Task }, { title: String }>(
    ADD_TODO,
    {
      variables: { title: inputTitle },
    },
  )

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputTitle(e.target.value)
  }

  const handleSubmit = async () => {
    const res = await addTodo()

    // TODO: エラーハンドリングちゃんとやる
    const todoId = res.data ? res.data.addTodo.id : process.exit(1)
    const newTask: Task = {
      id: todoId,
      title: inputTitle,
      done: false,
    }
    setTasks([newTask, ...tasks])
    setInputTitle('')
  }

  return (
    <div>
      {data && data.addTodo ? <p>Saved!</p> : null}
      <div className="inputForm">
        <div className="inner">
          <Input
            type="text"
            className="input"
            value={inputTitle}
            onChange={handleInputChange}
          />
          <Button
            primary={true}
            onClick={handleSubmit}
            className="btn is-primary"
          >
            追加
          </Button>
        </div>
      </div>
    </div>
  )
}

export default TaskInput
