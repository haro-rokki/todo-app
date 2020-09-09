import React from 'react'
import { Task } from './Types'
import { Button, Checkbox } from 'semantic-ui-react'

type Props = {
  task: Task
  handleDone: (task: Task) => void
  handleDelete: (task: Task) => void
}

const TaskItem: React.FC<Props> = ({ task, handleDone, handleDelete }) => {
  return (
    <>
      <Checkbox
        label={task.title}
        className="checkbox-input"
        onClick={() => handleDone(task)}
        defaultChecked={task.done}
      />
      <Button
        negative={true}
        onClick={() => handleDelete(task)}
        className="btn is-delete"
      >
        削除
      </Button>
    </>
  )
}

export default TaskItem
