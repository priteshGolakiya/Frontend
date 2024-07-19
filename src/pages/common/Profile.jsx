import { useEffect, useState } from "react";
import axios from "axios";
import summaryAPI from "../../utils/summaryAPI";
import Modal from "../../component/Modal";
import { toast } from "react-toastify";
import Preloader from "../../component/Preloader";

const Profile = () => {
  const [userData, setUserData] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [orders, setOrders] = useState([]);
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const handleTogglePassword = () => {
    setShowPassword((prevShow) => !prevShow);
  };

  const fetchData = async () => {
    try {
      const response = await axios.get(summaryAPI.common.userDetails.url, {
        withCredentials: true,
      });

      setUserData(response.data.data);
      setEditedUser(response.data.data);
    } catch (error) {
      console.error("Error fetching user data:", error);
      toast.error("Failed to load user data.");
    } finally {
      setLoading(false);
    }
  };

  const fetchOrders = async () => {
    try {
      const response = await axios.get(summaryAPI.common.getAllOrders.url, {
        withCredentials: true,
      });
      setOrders(response.data || []);
    } catch (error) {
      toast.error("Failed to fetch orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    fetchOrders();
  }, []);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = async () => {
    try {
      const response = await axios.put(
        summaryAPI.common.updateUser.url,
        editedUser,
        { withCredentials: true }
      );
      setUserData(response.data.data);
      setEditedUser(response.data.data);
      setIsEditing(false);
      toast.success("Profile updated successfully!");
    } catch (error) {
      console.error("Error saving user data:", error);
      toast.error("Failed to save user data.");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    if (editedUser) {
      setEditedUser({ ...editedUser, [e.target.name]: e.target.value });
    }
  };

  const handleCloseModal = () => {
    setIsEditing(false);
    setEditedUser(userData);
  };

  const handleCancelOrder = async (orderId) => {
    try {
      const response = await axios.post(
        `${summaryAPI.common.cancelOrder.url}/${orderId}/cancel`,
        {},
        { withCredentials: true }
      );
      console.log("response", response);
      toast.success("Order cancelled successfully");
      fetchOrders();
    } catch (error) {
      toast.error("Failed to cancel order");
    }
  };

  const renderStatusBadge = (status) => {
    const statusColors = {
      pending: "bg-yellow-200 text-yellow-800",
      shipped: "bg-blue-200 text-blue-800",
      delivered: "bg-green-200 text-green-800",
      cancelled: "bg-red-200 text-red-800",
    };

    return (
      <span
        className={`px-2 py-1 rounded-full text-xs font-semibold ${
          statusColors[status] || "bg-gray-200 text-gray-800"
        }`}
      >
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const deleteAddress = async (addressId) => {
    try {
      await axios.delete(
        `${summaryAPI.common.getAllAddresses.url}/${addressId}`,
        {
          withCredentials: true,
        }
      );
      fetchData();
      toast.success("Address deleted successfully");
      setAddresses(addresses.filter((address) => address._id !== addressId));
    } catch (error) {
      setError(error.response.data.message || "Server Error");
    }
  };

  if (!userData) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (loading && addresses.length === 0) {
    return (
      <div className="container mx-auto p-4">
        <Preloader />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-4">
        <div className="text-red-500">{error}</div>
      </div>
    );
  }
  return (
    <div className="bg-gray-100 min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto bg-white shadow-xl rounded-lg overflow-hidden">
          <div className="p-6 sm:p-10">
            <div className="flex flex-col sm:flex-row items-center justify-between mb-10">
              <h1 className="text-4xl font-bold text-gray-900 mb-4 sm:mb-0">
                My Profile
              </h1>
              <button
                onClick={handleEdit}
                className="px-6 py-3 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition duration-300 shadow-md text-lg font-semibold"
              >
                Edit Profile
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
              <div className="col-span-1">
                <div className="mb-8 text-center">
                  <img
                    src={
                      userData.profilePic || "https://via.placeholder.com/150"
                    }
                    alt="Profile"
                    className="w-48 h-48 rounded-full mx-auto shadow-lg border-4 border-white"
                  />
                </div>
                <div className="space-y-6 bg-gray-50 p-6 rounded-lg shadow-md">
                  <div>
                    <label className="block text-sm font-medium text-gray-600">
                      Username
                    </label>
                    <p className="mt-1 text-xl font-semibold text-gray-900">
                      {userData.username}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600">
                      Email
                    </label>
                    <p className="mt-1 text-xl font-semibold text-gray-900">
                      {userData.email}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600">
                      Role
                    </label>
                    <p className="mt-1 text-xl font-semibold text-gray-900 capitalize">
                      {userData.role}
                    </p>
                  </div>
                </div>
              </div>

              <div className="col-span-2 h-100vh">
                <h2 className="text-2xl font-semibold text-gray-900 mb-6">
                  Addresses
                </h2>
                {userData.addresses && userData.addresses.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {userData.addresses.map((address, index) => (
                      <div
                        key={index}
                        className="bg-white p-6 rounded-lg shadow-md border border-gray-200"
                      >
                        <p className="font-semibold text-lg text-gray-800 mb-2">
                          Address {index + 1}
                        </p>
                        <p className="text-gray-600">{address.street}</p>
                        <p className="text-gray-600">
                          {address.city}, {address.state}
                        </p>
                        <p className="text-gray-600">
                          {address.country} - {address.zipCode}
                        </p>
                        <button
                          onClick={() => deleteAddress(address._id)}
                          className="mt-2 text-white bg-red-500 hover:bg-red-700 py-1 px-3 rounded"
                        >
                          Delete
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 bg-gray-50 p-4 rounded-lg">
                    No addresses added yet.
                  </p>
                )}

                <h2 className="text-2xl font-semibold mb-6 mt-12">
                  Your Orders
                </h2>
                <div className="space-y-8 h-[calc(100vh-200px)] overflow-scroll scrollbar-hidden">
                  {orders.length === 0 ? (
                    <p className="text-center text-gray-500 bg-gray-50 p-4 rounded-lg">
                      No orders found.
                    </p>
                  ) : (
                    orders.map((order) => (
                      <div
                        key={order._id}
                        className="bg-white shadow-lg rounded-lg p-6 border border-gray-200"
                      >
                        <div className="flex justify-between items-center mb-4">
                          <h3 className="text-xl font-semibold text-gray-800">
                            Order #{order._id}
                          </h3>
                          {renderStatusBadge(order.status)}
                        </div>
                        <p className="text-gray-600 mb-2 text-lg">
                          Total: ₹{order.totalAmount.toFixed(2)}
                        </p>
                        <p className="text-gray-600 mb-4">
                          Created:{" "}
                          {new Date(order.createdAt).toLocaleDateString()}
                        </p>
                        <div className="mt-6">
                          <h4 className="text-lg font-semibold mb-4">
                            Order Items:
                          </h4>
                          <ul className="space-y-4">
                            {order.orderItems && order.orderItems.length > 0 ? (
                              order.orderItems.map((item) => (
                                <li
                                  key={item._id}
                                  className="flex items-center space-x-4 bg-gray-50 p-4 rounded-lg"
                                >
                                  <img
                                    src={item.product?.images[0] || ""}
                                    alt={item.product?.name || "Product"}
                                    className="w-20 h-20 object-cover rounded-md"
                                  />
                                  <div>
                                    <p className="text-lg font-medium text-gray-800">
                                      {item.product?.name || "Unknown Product"}
                                    </p>
                                    <p className="text-sm text-gray-600">
                                      Quantity: {item.quantity || 0} | Price: $
                                      {(item.price || 0).toFixed(2)}
                                    </p>
                                  </div>
                                </li>
                              ))
                            ) : (
                              <li className="text-gray-500">
                                No items in this order.
                              </li>
                            )}
                          </ul>
                        </div>
                        {order.status === "pending" && (
                          <button
                            onClick={() => handleCancelOrder(order._id)}
                            className="mt-6 px-6 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition duration-300 text-lg font-semibold"
                          >
                            Cancel Order
                          </button>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Modal isOpen={isEditing} onClose={handleCloseModal}>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSave();
          }}
        >
          <div className="space-y-4">
            <div>
              <label
                htmlFor="username"
                className="block text-sm font-medium text-gray-700"
              >
                Username
              </label>
              <input
                type="text"
                id="username"
                name="username"
                value={editedUser.username || ""}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={editedUser.email || ""}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            <div className="relative">
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                New Password (leave blank to keep current)
              </label>
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                value={editedUser.password || ""}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm pr-10"
                placeholder="Enter your password"
                autoComplete="current-password"
                aria-label="Password"
              />
              <button
                type="button"
                className="absolute inset-y-0 top-6 right-2 pr-3 flex items-center text-gray-600"
                onClick={handleTogglePassword}
              >
                {showPassword ? (
                  <i className="fa-solid fa-eye-slash"></i>
                ) : (
                  <i className="fa-solid fa-eye"></i>
                )}
              </button>
            </div>
          </div>
          <div className="mt-6">
            <button
              type="submit"
              className="w-full px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition duration-300 shadow-md"
            >
              Save Changes
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Profile;
