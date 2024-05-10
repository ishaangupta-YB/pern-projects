import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import TodoItem from "./TodoItem";

interface Todo {
  id: number;
  title: string;
  description: string;
  completed: boolean; 
  createdAt: string;
}

const TodoList = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filteredTodos, setFilteredTodos] = useState<Todo[]>([]);
  const [error, setError] = useState<string>("");
  const [newTodoTitle, setNewTodoTitle] = useState<string>("");
  const [newTodoDescription, setNewTodoDescription] = useState<string>("");
  const [filterValue, setFilterValue] = useState<string>("");
  const navigate = useNavigate();

  const handleToggleComplete = useCallback(
    async (id: number) => {
      const prevtodos = todos;
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("User not authenticated");
        }
        const updatedTodo = todos.find((todo) => todo.id === id);
        if (!updatedTodo) {
          throw new Error("Todo not found");
        }

        const updatedTodos = todos.map((todo) =>
          todo.id === id ? { ...todo, completed: !todo.completed } : todo
        );

        setTodos(updatedTodos);

        const response = await axios.put(
          `/todos/${id}`,
          { completed: !updatedTodo.completed },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (response.status !== 200) {
          throw new Error("An error occurred");
        }
      } catch (error) {
        setTodos(prevtodos);
        handleAxiosError(error);
      }
    },
    [todos]
  );

  const handleDelete = useCallback(async (id: number) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("User not authenticated");
      }

      setTodos((prevTodos) => prevTodos.filter((todo) => todo.id !== id));

      const response = await axios.delete(`/todos/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.status !== 200) {
        throw new Error("An error occurred");
      }
    } catch (error) {
      handleAxiosError(error);
    }
  }, []);

  useEffect(() => {
    setFilteredTodos(
      todos.filter(
        (todo) =>
          todo.title.toLowerCase().includes(filterValue.toLowerCase()) ||
          todo.description.toLowerCase().includes(filterValue.toLowerCase())
      )
    );
  }, [todos, filterValue]);

  const fetchTodos = useCallback(async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("User not authenticated");
      }

      const response = await axios.get("/todos", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data && response.data.todos && response.status === 200) {
        setTodos(response.data.todos);
      } else {
        throw new Error("An error occurred");
      }
    } catch (error) {
      handleAxiosError(error);
    }
  }, []);

  const handleSave = useCallback(
    async (id: number, updatedTodo: Todo) => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("User not authenticated");
        }
        const updatedTodos = todos.map((todo) =>
          todo.id === id ? updatedTodo : todo
        );
        setTodos(updatedTodos);

        const response = await axios.put(`/todos/${id}`, updatedTodo, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log(response);
        if (response.status !== 200) {
          throw new Error("An error occurred");
        }
      } catch (error) {
        handleAxiosError(error);
      }
    },
    [todos]
  );

  const handleCreateTodo = useCallback(async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("User not authenticated");
      }
      const newTodo: Todo = {
        id: Date.now(),
        title: newTodoTitle,
        description: newTodoDescription,
        completed: false,
        createdAt: "",
      };
      const response = await axios.post("/todos", newTodo, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.status !== 201) {
        throw new Error("An error occurred");
      }

      setTodos((prevTodos) => [...prevTodos, response.data.todo]);
      setNewTodoTitle("");
      setNewTodoDescription("");
    } catch (error) {
      handleAxiosError(error);
    }
  }, [newTodoTitle, newTodoDescription]);

  const handleAxiosError = useCallback((error: any) => {
    console.log(error);
    if (axios.isAxiosError(error)) {
      setError(
        error.response?.data.error ||
          error.response?.data.message ||
          "An error occurred"
      );
    } else {
      const genericError = error as Error;
      setError(genericError.message || "An error occurred");
    }
  }, []);

  useEffect(() => {
    const fetchTodosWrapper = async () => {
      try {
        await fetchTodos();
      } catch (error) {
        handleAxiosError(error);
        navigate("/login");
      }
    };

    fetchTodosWrapper();
  }, [fetchTodos, navigate]);

  return (
    <div className="container mx-auto py-8 px-4 md:px-0">
      <h2 className="text-4xl font-extrabold text-gray-800 mb-8 text-center">
        Manage Your Tasks
      </h2>
      {error && (
        <div
          className="bg-red-200 border-l-4 border-red-600 text-red-800 p-4 mb-6 rounded shadow"
          role="alert"
        >
          <p className="font-medium">Whoops! Something went wrong:</p>
          <p>{error}</p>
        </div>
      )}
      <div className="flex justify-between items-center mb-6">
        <input
          type="text"
          placeholder="Filter todos..."
          value={filterValue}
          onChange={(e) => setFilterValue(e.target.value)}
          className="appearance-none block w-1/3 bg-gray-100 text-gray-700 border border-gray-300 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
        />
      </div>
      {!filteredTodos || filteredTodos.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-gray-700 text-xl mb-3">Your todo list is empty</p>
          <p className="text-gray-500">Start by adding a new task above</p>
        </div>
      ) : (
        <ul className="space-y-4">
          {filteredTodos.map((todo) => (
            <li
              key={todo.id}
              className="bg-white rounded-lg shadow px-5 py-4 flex items-center justify-between"
            >
              <TodoItem
                todo={todo}
                onToggleComplete={handleToggleComplete}
                onDelete={handleDelete}
                onSave={handleSave}
              />
              <span className="text-gray-500">
                Created: {new Date(todo.createdAt).toLocaleString()}
              </span>
            </li>
          ))}
        </ul>
      )}
      <div className="mt-10"> 
      <h3 className="text-3xl font-bold text-gray-900 mb-6 text-center">
        Add a New task
      </h3>
        <div className="flex flex-wrap -mx-3 mb-6">
          <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
            <input
              type="text"
              placeholder="Add Title"
              value={newTodoTitle}
              onChange={(e) => setNewTodoTitle(e.target.value)}
              className="appearance-none block w-full bg-gray-100 text-gray-700 border border-gray-300 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
            />
          </div>
          <div className="w-full md:w-1/2 px-3">
            <input
              type="text"
              placeholder="Add a description"
              value={newTodoDescription}
              onChange={(e) => setNewTodoDescription(e.target.value)}
              className="appearance-none block w-full bg-gray-100 text-gray-700 border border-gray-300 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
            />
          </div>
        </div>
        <button
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded shadow-lg hover:shadow-xl transition ease-in-out duration-300 transform hover:-translate-y-1"
          onClick={handleCreateTodo}
        >
          Add Task
        </button>
      </div>
    </div>
  );
};

export default TodoList;
