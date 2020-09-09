import React from 'react'
import TaskItem from './TaskItem'
import { Task } from './Types'
import { List } from 'semantic-ui-react'

type Props = {
  tasks: Task[]
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>
}

const TaskList: React.FC<Props> = ({ tasks, setTasks }) => {
  const handleDone = (task: Task) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === task.id ? { ...task, done: !task.done } : t)),
    )
  }

  const handleDelete = (task: Task) => {
    setTasks((prev) => prev.filter((t) => t.id !== task.id))
  }

  return (
    <div className="inner">
      {tasks.length <= 0 ? (
        '登録されたTODOはありません'
      ) : (
        <List>
          {tasks.map((task) => (
            <List.Item>
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
