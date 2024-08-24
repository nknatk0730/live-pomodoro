'use client';

import { Task as TaskType } from "@/types/task";
import { Button } from "./ui/button";
import { Pause, Play, Trash } from "lucide-react";
import useLocalStorageState from "use-local-storage-state";
import { useStopwatch } from "react-timer-hook";
import { useEffect } from "react";

export const Task = ({
  task
}: {
  task: TaskType
}) => {
  const [tasks, setTasks] = useLocalStorageState<TaskType[]>('tasks', {
    defaultValue: [],
  })

  const [mode, setMode] = useLocalStorageState<'working' | 'break'>('working')

  const {
    totalSeconds,
    seconds,
    minutes,
    hours,
    isRunning,
    start,
    pause,
    reset,
  } = useStopwatch();

  useEffect(() => {
    if (minutes >= 1 && mode === 'working') {
      alert('break time');
      setMode('break');
      setTasks((prev) => prev.map((item) => {
        if (item.id === task.id) {
          return {
            ...item,
            completed: true,
          }
        } else {
          return item;
        }
      }))
      reset();
    }

    if (minutes >= 1 && mode === 'break') {
      alert('start time');
      setMode('working');
      reset();
    }
  }, [minutes, mode, reset, setMode, setTasks, task.id])

  const getFormatedTime = (time: number) => {
    return time < 10 ? `0${time}` : time;
  }

  return (
    <div key={task.id} className="p-4 gap-2 border rounded-md flex items-center">
      {task.completed && (
        <span className="px-2 py-2 border rounded bg-muted text-muted-foreground text-sm">
          finish
        </span>
      )}
      {task.title}
      <span className="flex-1"></span>
      <p className="text-muted-foreground text-sm tabular-nums">
        {getFormatedTime(minutes)}:{getFormatedTime(seconds)}
      </p>
      {isRunning ? (
        <Button variant="ghost" size="icon" onClick={pause}>
          <Pause size={18} />
          <span className="sr-only">task stop</span>
        </Button>
      ) : (
        <Button variant="ghost" size="icon" onClick={start}>
          <Play size={18} />
          <span className="sr-only">task start</span>
        </Button>
      )}
      <Button
        variant="destructive"
        size="icon"
        onClick={() => {
          setTasks((prev) => prev.filter((item) => item.id !== task.id));
        }}
      >
        <Trash size={18} />
        <span className="sr-only">delete task</span>
      </Button>
    </div>
  );
}