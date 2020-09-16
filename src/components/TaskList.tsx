import React, { useState, useCallback, useRef, FC } from 'react'
import { useDrag, useDrop } from 'react-dnd'
import TaskItem from './TaskItem'
import { Task } from './Types'
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

interface SortableListProps {
  index: number
  task: Task
  swapList: (sourceIndex: number, targetIndex: number) => void
  handleDone: (task: Task) => void
  handleDelete: (task: Task) => void
}

interface DragItem {
  type: string
  index: number
}

const DND_GROUP = 'list'

const SortableList: FC<SortableListProps> = ({
  index,
  task,
  swapList,
  handleDone,
  handleDelete,
}) => {
  const ref = useRef<HTMLLIElement>(null)
  const [, drop] = useDrop({
    accept: DND_GROUP,
    drop(item: DragItem) {
      if (!ref.current || item.index === index) {
        return
      }
      swapList(item.index, index)
    },
  })
  const [, drag] = useDrag({
    item: { type: DND_GROUP, index },
  })
  drag(drop(ref))

  return (
    <li ref={ref}>
      <TaskItem
        task={task}
        handleDelete={handleDelete}
        handleDone={handleDone}
      />
    </li>
  )
}

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
  const swapList = useCallback(
    (sourceIndex: number, targetIndex: number) => {
      ;[tasks[targetIndex], tasks[sourceIndex]] = [
        tasks[sourceIndex],
        tasks[targetIndex],
      ]
      setTasks(tasks.splice(0))
    },
    [tasks],
  )

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
        <ul>
          {tasks.map((task, index) => (
            <SortableList
              key={index}
              index={index}
              task={task}
              swapList={swapList}
              handleDone={handleDone}
              handleDelete={handleDelete}
            />
          ))}
        </ul>
      )}
    </div>
  )
}

export default TaskList
