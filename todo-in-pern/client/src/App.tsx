import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./components/auth/Login";
import Register from "./components/auth/Register";
import Profile from "./components/auth/Profile";
import TodoList from "./pages/TodoList";
import Navbar from "./components/Navbar";
import axios from "axios";
import { useState, useEffect } from "react";
import LoadingSpinner from "./components/LoadingSpinner";

axios.defaults.baseURL = "http://localhost:8080/api";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const verifyToken = async () => {
      try {
        const token = localStorage.getItem("token");
        if (token) {
          const response = await axios.get("/auth/me", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }); 
          if (response.status === 200) {
            setIsAuthenticated(true);
          } else {
            throw new Error("A error occurred");
          }
        } else {
          throw new Error("A error occurred");
        }
      } catch (error) {
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };

    verifyToken();
  }, []);

  if (loading) {
    return <LoadingSpinner />;
  }
  return (
    <BrowserRouter>
    {isAuthenticated && <Navbar />}
      <Routes>
        <Route
          path="/login"
          element={isAuthenticated ? <Navigate to="/todos" /> : <Login />}
        />
        <Route
          path="/register"
          element={isAuthenticated ? <Navigate to="/todos" /> : <Register />}
        />
        <Route
          path="/profile"
          element={isAuthenticated ? <Profile /> : <Navigate to="/login" />}
        />
        <Route
          path="/todos"
          element={isAuthenticated ? <TodoList /> : <Navigate to="/login" />}
        />
        <Route
          path="/"
          element={
            isAuthenticated ? (
              <Navigate to="/todos" />
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
