import { useState, useEffect } from "react";
import axios from "axios";

interface User {
  email: string,  
  id: number
}

const Profile = () => {
  const [user, setUser] = useState<User>();
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("User not authenticated");
        }

        const response = await axios.get("/auth/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }); 
        if (response.status === 200) {
          setUser(response.data.user);
        } else {
          throw new Error("User Not Logged In!");
        }
      } catch (error) {
        if (axios.isAxiosError(error)) {
          setError(error.response?.data.message || error.response?.data.error || "An error occurred");
        } else {
          const genericError = error as Error;
          setError(genericError.message || "An error occurred");
        }
        window.location.reload()
      }
    };

    fetchProfile();
  }, []);

  return (
    <div className="container mx-auto py-8 px-4 md:px-0">
      <h2 className="text-4xl font-extrabold text-gray-800 mb-8 text-center">
        Your Profile
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
      {user && (
        <div className="bg-white rounded-lg shadow px-5 py-4">
          <p className="text-gray-700">
            <span className="font-bold">Email:</span> {user.email}
          </p>
        </div>
      )}
    </div>
  );
};

export default Profile;
