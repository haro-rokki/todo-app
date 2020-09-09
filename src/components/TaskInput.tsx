import React, { useState } from 'react'
import { Task } from './Types'
import { Button, Input } from 'semantic-ui-react'

type Props = {
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>
  tasks: Task[]
}

const TaskInput: React.FC<Props> = ({ setTasks, tasks }) => {
  const [inputTitle, setInputTitle] = useState<string>('')
  const [count, setCount] = useState<number>(tasks.length + 1)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputTitle(e.target.value)
  }

  const handleSubmit = () => {
    setCount(count + 1)

    const newTask: Task = {
      id: count,
      title: inputTitle,
      done: false,
    }

    setTasks([newTask, ...tasks])
    setInputTitle('')
  }

  return (
    <div>
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
