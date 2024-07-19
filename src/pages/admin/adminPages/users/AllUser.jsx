import { useState, useEffect } from "react";
import axios from "axios";
import moment from "moment";
import Modal from "../../../../component/Modal";
import summaryAPI from "../../../../utils/summaryAPI";
import defaultImg from "../../../../default.jpg";
import Preloader from "../../../../component/Preloader";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AllUser = () => {
  const [userData, setUserData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [formData, setFormData] = useState({
    userName: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(summaryAPI.admin.getAllUser.url, {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        });
        setUserData(response.data.data);
      } catch (error) {
        setError("Error fetching user data");
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const openModal = (user) => {
    setCurrentUser(user);
    setFormData({
      userName: user.userName,
      email: user.email,
      password: "",
      role: user.role,
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setCurrentUser(null);
    setFormData({
      userName: "",
      email: "",
      password: "",
      role: "",
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(
        `${summaryAPI.admin.updateUser.url}/${currentUser._id}`,
        formData,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      setUserData((prevData) =>
        prevData.map((user) =>
          user._id === currentUser._id ? response.data.data : user
        )
      );
      toast.success("User updated successfully");
      closeModal();
    } catch (error) {
      toast.error("Error updating user");
      setError("Error updating user");
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${summaryAPI.admin.deleteUser.url}/${id}`, {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
        },
      });
      setUserData((prevData) => prevData.filter((user) => user._id !== id));
      toast.success("User deleted successfully");
    } catch (error) {
      toast.error("Error deleting user");
    }
  };

  return (
    <div className="container mx-auto px-4 py-4">
      {loading ? (
        <Preloader />
      ) : (
        <div className="overflow-x-auto">
          <h1 className="text-3xl font-semibold mb-4">All Users</h1>
          {error && <p className="text-red-500">{error}</p>}
          <table className="min-w-full border border-gray-300 rounded-lg overflow-hidden shadow-lg">
            <thead className="bg-blue-500 text-white">
              <tr className="text-center">
                <th className="px-4 py-2">User ID</th>
                <th className="px-4 py-2">Username</th>
                <th className="px-4 py-2">Email</th>
                <th className="px-4 py-2">Role</th>
                <th className="px-4 py-2">Created At</th>
                <th className="px-4 py-2">Updated At</th>
                <th className="px-4 py-2">Profile Picture</th>
                <th className="px-4 py-2">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-300">
              {userData
                .filter((user) => user.role !== "admin")
                .map((user) => (
                  <tr
                    key={user._id}
                    className="hover:bg-blue-100 hover:shadow-md transition duration-300"
                  >
                    <td className="px-4 py-1">{user?._id}</td>
                    <td className="px-4 py-1">{user?.userName}</td>
                    <td className="px-4 py-1">{user?.email}</td>
                    <td className="px-4 py-1">{user?.role}</td>
                    <td className="px-4 py-1">
                      {moment(user?.createdAt).format("LLL")}
                    </td>
                    <td className="px-4 py-1">
                      {moment(user?.updatedAt).format("LLL")}
                    </td>
                    <td className="px-4 py-1">
                      <img
                        src={user.profilePic || defaultImg}
                        alt="Profile Pic"
                        className="w-14 h-14 border-2 border-gray-400 cursor-pointer rounded-full transform transition duration-300 hover:scale-110 hover:border-indigo-500"
                      />
                    </td>
                    <td className="px-4 py-1 text-center space-x-2">
                      <button
                        className="text-indigo-600 bg-gray-200 p-2 rounded-2xl hover:text-white hover:bg-indigo-600 focus:outline-none transition duration-300"
                        onClick={() => openModal(user)}
                      >
                        <i className="fa-solid fa-user-pen" title="Edit"></i>
                      </button>
                      <button
                        className="text-red-600 bg-gray-200 p-2 rounded-2xl hover:text-white hover:bg-red-600 focus:outline-none transition duration-300"
                        onClick={() => handleDelete(user._id)}
                      >
                        <i
                          className="fa-solid fa-user-minus"
                          title="Delete"
                        ></i>
                      </button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      )}
      <Modal isOpen={isModalOpen} onClose={closeModal}>
        <div className="p-8 bg-white rounded-lg shadow-xl max-w-md mx-auto">
          <h2 className="text-2xl font-semibold mb-6 text-gray-800">
            Edit User
          </h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-5 ">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Username
              </label>
              <input
                type="text"
                name="userName"
                value={formData.userName}
                onChange={handleChange}
                className="mt-1 p-3 border border-gray-300 rounded-2xl w-full focus:ring-indigo-500 focus:border-indigo-500 transition duration-400 shadow-md"
              />
            </div>
            <div className="mb-5">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="mt-1 p-3 border border-gray-300 rounded-2xl w-full focus:ring-indigo-500 focus:border-indigo-500 transition duration-400 shadow-md"
              />
            </div>
            <div className="mb-5">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="mt-1 p-3 border border-gray-300 rounded-2xl w-full focus:ring-indigo-500 focus:border-indigo-500 transition duration-400 shadow-md"
              />
            </div>

            <div className="text-right">
              <button
                type="submit"
                className="text-white bg-indigo-600 hover:bg-indigo-700 p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition duration-300"
              >
                Update User
              </button>
            </div>
          </form>
        </div>
      </Modal>
    </div>
  );
};

export default AllUser;
