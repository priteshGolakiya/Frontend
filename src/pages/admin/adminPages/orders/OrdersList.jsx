import { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import summaryAPI from "../../../../utils/summaryAPI";
import { useSelector } from "react-redux";

const OrdersList = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = useSelector((store) => store.user.token);

  useEffect(() => {
    fetchOrders();
  }, []);

  const formatPrice = (price) => {
    return typeof price === "number" ? price.toFixed(2) : "N/A";
  };

  const fetchOrders = async () => {
    try {
      const response = await axios.get(summaryAPI.admin.getAllOrders.url, {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setOrders(response.data);
      setLoading(false);
    } catch (error) {
      toast.error("Error fetching orders: " + error.message);
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (orderId, newStatus) => {
    try {
      await axios.post(
        `${summaryAPI.admin.updateOrderStatus.url}/${orderId}/status`,
        { status: newStatus },
        {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success("Order status updated successfully");
      fetchOrders();
    } catch (error) {
      toast.error("Error updating order status: " + error.message);
    }
  };

  const handleDeleteOrder = async (orderId) => {
    if (window.confirm("Are you sure you want to delete this order?")) {
      try {
        await axios.delete(`${summaryAPI.admin.deleteOrder.url}/${orderId}`, {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        toast.success("Order deleted successfully");
        fetchOrders();
      } catch (error) {
        toast.error("Error deleting order: " + error.message);
      }
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">
        Orders Management
      </h1>
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full table-auto">
            <thead>
              <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
                <th className="py-3 px-6 text-left">Order ID</th>
                <th className="py-3 px-6 text-left">User</th>
                <th className="py-3 px-6 text-center">Total Amount</th>
                <th className="py-3 px-6 text-center">Status</th>
                <th className="py-3 px-6 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="text-gray-600 text-sm font-light">
              {orders.map((order) => (
                <tr
                  key={order._id}
                  className="border-b border-gray-200 hover:bg-gray-100"
                >
                  <td className="py-3 px-6 text-left whitespace-nowrap">
                    <span className="font-medium">{order._id}</span>
                  </td>
                  <td className="py-3 px-6 text-left">
                    <span>{order.user.email}</span>
                  </td>
                  <td className="py-3 px-6 text-center">
                    <span className="bg-green-200 text-green-600 py-1 px-3 rounded-full text-xs">
                      ₹{formatPrice(order.totalAmount)}
                    </span>
                  </td>
                  <td className="py-3 px-6 text-center">
                    <span
                      className={`py-1 px-3 rounded-full text-xs ${
                        order.status === "pending"
                          ? "bg-yellow-200 text-yellow-600"
                          : order.status === "shipped"
                          ? "bg-blue-200 text-blue-600"
                          : order.status === "delivered"
                          ? "bg-green-200 text-green-600"
                          : "bg-red-200 text-red-600"
                      }`}
                    >
                      {order.status.charAt(0).toUpperCase() +
                        order.status.slice(1)}
                    </span>
                  </td>
                  <td className="py-3 px-6 text-center">
                    <div className="flex item-center justify-center">
                      <Link
                        to={`/admin-panel/orders/detail/${order._id}`}
                        className="w-4 mr-2 relative transform hover:text-blue-500 hover:scale-110"
                      >
                        <i className="fa-solid fa-eye absolute top-2 right-2"></i>
                      </Link>
                      <select
                        onChange={(e) =>
                          handleStatusUpdate(order._id, e.target.value)
                        }
                        value={order.status}
                        className="block w-full bg-white border border-gray-300 text-gray-700 py-1 px-2 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500 text-xs"
                      >
                        <option value="pending">Pending</option>
                        <option value="shipped">Shipped</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                      <button
                        onClick={() => handleDeleteOrder(order._id)}
                        className="w-4 ml-2 transform hover:text-red-500 hover:scale-110"
                      >
                        <i className="fas fa-trash-alt"></i>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default OrdersList;
