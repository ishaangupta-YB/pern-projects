import { useState, memo } from "react";

interface Todo {
  id: number;
  title: string;
  description: string;
  completed: boolean;
  createdAt: string;
}

interface TodoItemProps {
  todo: Todo;
  onToggleComplete: (id: number) => void;
  onDelete: (id: number) => void;
  onSave: (id: number, updatedTodo: Todo) => void;
}

const TodoItem = memo(
  ({ todo, onToggleComplete, onDelete, onSave }: TodoItemProps) => {
    const [isEditing, setIsEditing] = useState(false);
    const [updatedTitle, setUpdatedTitle] = useState(todo.title);
    const [updatedDescription, setUpdatedDescription] = useState(
      todo.description
    );

    const handleToggleComplete = () => {
      onToggleComplete(todo.id);
    };

    const handleDelete = () => {
      onDelete(todo.id);
    };

    const handleSave = () => {
      const updatedTodo = {
        ...todo,
        title: updatedTitle,
        description: updatedDescription,
      };
      onSave(todo.id, updatedTodo);
      setIsEditing(false);
    };

    const handleEdit = () => {
      setIsEditing(true);
    };

    return (
      <div className="flex items-center justify-between w-full">
        <div className="flex items-center">
          <input
            type="checkbox"
            checked={todo.completed}
            onChange={handleToggleComplete}
            className="mr-4 w-5 h-5 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
          />
          {isEditing ? (
            <>
              <input
                type="text"
                value={updatedTitle}
                onChange={(e) => setUpdatedTitle(e.target.value)}
                className="mr-2 border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
              <input
                type="text"
                value={updatedDescription}
                onChange={(e) => setUpdatedDescription(e.target.value)}
                className="mr-2 border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
              <button
                onClick={handleSave}
                className="bg-green-500 hover:bg-green-600 text-white font-bold py-1 px-2 rounded"
              >
                Save
              </button>
            </>
          ) : (
            <>
              <span
                className={`mr-2 ${
                  todo.completed ? "text-gray-500 line-through" : ""
                }`}
              >
                {todo.title}
              </span>
              <span
                className={`${
                  todo.completed ? "text-gray-500 line-through" : ""
                }`}
              >
                {todo.description}
              </span>
              <button
                onClick={handleEdit}
                className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-1 px-2 rounded ml-5"
              >
                Edit
              </button>
              <button
                onClick={handleDelete}
                className="bg-red-500 hover:bg-red-600 text-white font-bold py-1 px-2 rounded ml-5"
              >
                Delete
              </button>
            </>
          )}
        </div>
      </div>
    );
  }
);

export default TodoItem;
