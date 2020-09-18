/** @jsx jsx */
import { jsx } from '@emotion/core'
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
    <div>
      <Checkbox
        label={task.title}
        className="checkbox-input"
        onClick={() => handleDone(task)}
        checked={task.done}
      />
      <Button
        negative={true}
        onClick={() => handleDelete(task)}
        className="btn is-delete"
      >
        削除
      </Button>
    </div>
  )
}

export default TaskItem
