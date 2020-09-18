/** @jsx jsx */
import { css, jsx } from '@emotion/core'
import React from 'react'
import { Task } from './Types'
import { Button, Checkbox } from 'semantic-ui-react'

type Props = {
  task: Task
  handleDone: (task: Task) => void
  handleDelete: (task: Task) => void
}

const theme = css`
  .checkbox-input {
    padding: 1em;
  }
  .delete-btn {
    padding: 1em;
    float: right;
  }
`

const TaskItem: React.FC<Props> = ({ task, handleDone, handleDelete }) => {
  return (
    <div css={theme}>
      <Checkbox
        label={task.title}
        className="checkbox-input"
        onClick={() => handleDone(task)}
        checked={task.done}
      />
      <Button
        negative={true}
        onClick={() => handleDelete(task)}
        className="delete-btn"
      >
        削除
      </Button>
    </div>
  )
}

export default TaskItem
