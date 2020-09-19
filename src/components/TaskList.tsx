/** @jsx jsx */
import { jsx } from '@emotion/core'
import React, { useState, useCallback, useRef, FC } from 'react'
import { useDrag, useDrop } from 'react-dnd'
import TaskItem from './TaskItem'
import { Task } from './Types'
import gql from 'graphql-tag'
import { useMutation } from 'react-apollo'
import { List, Ref } from 'semantic-ui-react'

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

const SORT_TODO = gql`
  mutation sortTodo($sourceId: ID!, $targetId: ID!) {
    sortTodo(sourceId: $sourceId, targetId: $targetId) {
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
  const ref = useRef(null)
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
    <Ref innerRef={ref}>
      <List.Item>
        <TaskItem
          task={task}
          handleDelete={handleDelete}
          handleDone={handleDone}
        />
      </List.Item>
    </Ref>
  )
}

const TaskList: React.FC<Props> = ({ tasks, setTasks }) => {
  const [todoId, setTodoId] = useState<string>('')
  const [sourceId, setSourceId] = useState<string>('')
  const [targetId, setTargetId] = useState<string>('')
  const [deleteTodo] = useMutation<{ deleteTodo: Task }, { id: String }>(
    DELETE_TODO,
    {
      variables: { id: todoId },
    },
  )
  const [doneTodo] = useMutation<{ doneTodo: Task }, { id: String }>(
    DONE_TODO,
    {
      variables: { id: todoId },
    },
  )
  const [sortTodo] = useMutation<
    { sortTodo: Task[] },
    { sourceId: String; targetId: String }
  >(SORT_TODO, {
    variables: { sourceId: sourceId, targetId: targetId },
  })

  const swapList = useCallback(
    (sourceIndex: number, targetIndex: number) => {
      ;[tasks[targetIndex], tasks[sourceIndex]] = [
        tasks[sourceIndex],
        tasks[targetIndex],
      ]
      setSourceId(tasks[sourceIndex].id)
      setTargetId(tasks[targetIndex].id)
      setTasks(tasks.splice(0))
      sortTodo()
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
      {tasks.length <= 0 ? (
        '登録されたTODOはありません'
      ) : (
        <List divided verticalAlign="middle">
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
        </List>
      )}
    </div>
  )
}

export default TaskList
