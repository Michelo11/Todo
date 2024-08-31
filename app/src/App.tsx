import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "./components/ui/card";
import { Input } from "./components/ui/input";
import React from "react";
import { Checkbox } from "./components/ui/checkbox";
import { Button } from "./components/ui/button";

function App() {
  const queryClient = useQueryClient();

  const { data: todos } = useQuery({
    queryKey: ["todos"],
    queryFn: () => fetch("http://localhost:3000/").then((res) => res.json()),
  });

  const addTodo = useMutation({
    mutationFn: (title: string) => {
      return fetch("http://localhost:3000/new", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title }),
      }).then((res) => res.json());
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["todos"] });
    },
  });

  const completeTodo = useMutation({
    mutationFn: ({ id, completed }: { id: string; completed: boolean }) => {
      return fetch(`http://localhost:3000/update/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ completed }),
      }).then((res) => res.json());
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["todos"] });
    },
  });

  const deleteTodo = useMutation({
    mutationFn: (id: string) => {
      return fetch(`http://localhost:3000/delete/${id}`, {
        method: "DELETE",
      }).then((res) => res.json());
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["todos"] });
    },
  });

  const [title, setTitle] = React.useState("");

  if (!todos) {
    return <p className="p-6">Loading...</p>;
  }

  return (
    <main className="p-6 space-y-3 flex flex-col items-center justify-center m-auto">
      <Card className="w-[500px]">
        <CardHeader>
          <CardTitle>Todo</CardTitle>
          <CardDescription>Simple and easy todo fullstack app.</CardDescription>
        </CardHeader>
        <CardContent>
          <ul>
            {todos.map((todo: any) => (
              <li key={todo.id} className="flex justify-between items-center">
                <div className="flex items-center gap-3 ">
                  <Checkbox
                    id="todo"
                    checked={todo.completed}
                    onCheckedChange={(checked) => {
                      completeTodo.mutate({
                        id: todo.id,
                        completed: !!checked,
                      });
                    }}
                  />
                  {todo.title}
                </div>

                <Button
                  variant="destructive"
                  onClick={() => {
                    deleteTodo.mutate(todo.id);
                  }}
                >
                  Delete
                </Button>
              </li>
            ))}
          </ul>

          {todos.length === 0 && <p>No todos found.</p>}
        </CardContent>
        <CardFooter>
          <form
            className="w-full"
            onSubmit={(e) => {
              e.preventDefault();
              addTodo.mutate(title);
            }}
          >
            <Input
              placeholder="Add a new todo..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </form>
        </CardFooter>
      </Card>
    </main>
  );
}

export default App;
