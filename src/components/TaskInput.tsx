/** @jsx jsx */
import { css, jsx } from '@emotion/core'
import React, { useState } from 'react'
import { Task } from './Types'
import { Button, Input } from 'semantic-ui-react'
import gql from 'graphql-tag'
import { useMutation } from 'react-apollo'

type Props = {
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>
  tasks: Task[]
}

const inputDesign = css`
  .inner {
    padding: 1em;
  }
  .primary-btn {
    padding: 1em;
    margin-left: 1em;
  }
`

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
    <div css={inputDesign}>
      {data && data.addTodo ? <p>Saved!</p> : null}
      <div className="input-form">
        <div className="inner">
          <Input
            type="text"
            className="input"
            value={inputTitle}
            onChange={handleInputChange}
          />
          <Button primary={true} onClick={handleSubmit} className="primary-btn">
            追加
          </Button>
        </div>
      </div>
    </div>
  )
}

export default TaskInput
