'use client'

import { Task } from "@/components/task";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Task as TaskType } from "@/types/task";
import { useForm } from "react-hook-form";
import useLocalStorageState from 'use-local-storage-state';

type FormType = {
  title: string;
}

export default function Home() {
  const [tasks, setTasks] = useLocalStorageState<TaskType[]>('tasks', {
    defaultValue: [],
  })
  
  const {
    handleSubmit,
    register,
    formState: { isValid },
    reset,
  } = useForm<FormType>({
    defaultValues: {
      title: "",
    },
  });

  const onSubmit = async (data: FormType) => {
    setTasks((prev) => [...prev, {
      id: crypto.randomUUID(),
      title: data.title,
    }]);
    reset();
  }

  return (
    <main className="container">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="max-w-lg space-y-2 mx-auto bg-muted p-6 border rounded-lg"
      >
        <div>
          <label htmlFor="title">Task</label>
          <Input
            {...register("title", {
              required: true,
            })}
            id="title"
            autoComplete="off"
          />
        </div>
        <Button disabled={!isValid}>Create</Button>
      </form>

      <h2>Tasks</h2>
      <div className="space-y-2">
        {tasks.map((task) => (
          <Task key={task.id} task={task}/>
        ))}
      </div>
    </main>
  );
}
