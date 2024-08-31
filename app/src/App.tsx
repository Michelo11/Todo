import { useQuery } from "@tanstack/react-query";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./components/ui/card";

function App() {
  const { data: todos } = useQuery({
    queryKey: ["todos"],
    queryFn: () => fetch("http://localhost:3000/").then((res) => res.json()),
  });

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
              <li key={todo.id}>
                <input type="checkbox" checked={todo.completed} />
                {todo.title}
              </li>
            ))}
          </ul>

          {todos.length === 0 && <p>No todos found.</p>}
        </CardContent>
      </Card>
    </main>
  );
}

export default App;
