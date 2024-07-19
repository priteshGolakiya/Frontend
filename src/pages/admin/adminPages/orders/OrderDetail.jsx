import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import summaryAPI from "../../../../utils/summaryAPI";

const OrderDetail = () => {
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const { id } = useParams();

  const fetchOrderDetails = async () => {
    try {
      const response = await axios.get(
        `${summaryAPI.admin.getOrderDetails.url}/${id}`,
        { withCredentials: true }
      );
      if (response.data) {
        setOrder(response.data);
      } else {
        toast.error("No order data received");
      }
      setLoading(false);
    } catch (error) {
      toast.error("Error fetching order details: " + error.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrderDetails();
  }, [id]);

  const handleStatusUpdate = async (newStatus) => {
    try {
      await axios.put(
        `${summaryAPI.admin.updateOrderStatus.url}/${id}`,
        { status: newStatus },
        { withCredentials: true }
      );
      toast.success("Order status updated successfully");
      fetchOrderDetails();
    } catch (error) {
      toast.error("Error updating order status: " + error.message);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="text-center mt-8 text-red-600 font-semibold text-xl">
        Order not found
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Order Details</h1>
      <div className="bg-white shadow-lg rounded-lg overflow-hidden">
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="space-y-2">
              <p className="text-sm font-medium text-gray-500">Order ID</p>
              <p className="text-lg font-semibold text-gray-800">{order._id}</p>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium text-gray-500">Status</p>
              <p
                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                ${
                  order.status === "pending"
                    ? "bg-yellow-100 text-yellow-800"
                    : order.status === "shipped"
                    ? "bg-blue-100 text-blue-800"
                    : order.status === "delivered"
                    ? "bg-green-100 text-green-800"
                    : "bg-red-100 text-red-800"
                }`}
              >
                {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
              </p>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium text-gray-500">User</p>
              <p className="text-lg text-gray-800">
                {order.user ? order.user.email : "N/A"}
              </p>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium text-gray-500">Total Amount</p>
              <p className="text-lg font-semibold text-green-600">
                ${order.totalAmount.toFixed(2)}
              </p>
            </div>
          </div>

          <div className="mt-8">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">
              Shipping Address
            </h2>
            <div className="bg-gray-50 p-4 rounded-md text-gray-700">
              <p>{order.shippingAddress.street}</p>
              <p>
                {order.shippingAddress.city}, {order.shippingAddress.state}{" "}
                {order.shippingAddress.zipCode}
              </p>
              <p>{order.shippingAddress.country}</p>
            </div>
          </div>

          <div className="mt-8">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">
              Order Items
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="py-3 px-4 font-semibold text-sm text-gray-600 uppercase">
                      Product
                    </th>
                    <th className="py-3 px-4 font-semibold text-sm text-gray-600 uppercase">
                      Quantity
                    </th>
                    <th className="py-3 px-4 font-semibold text-sm text-gray-600 uppercase">
                      Price
                    </th>
                    <th className="py-3 px-4 font-semibold text-sm text-gray-600 uppercase">
                      Subtotal
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {order.orderItems &&
                    order.orderItems.map((item) => (
                      <tr
                        key={item._id}
                        className="border-b border-gray-200 hover:bg-gray-50"
                      >
                        <td className="py-4 px-4">{item.product.name}</td>
                        <td className="py-4 px-4">{item.quantity}</td>
                        <td className="py-4 px-4">
                          ${item.product.price.toFixed(2)}
                        </td>
                        <td className="py-4 px-4">
                          ${(item.quantity * item.product.price).toFixed(2)}
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="mt-8">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">
              Update Order Status
            </h2>
            <select
              onChange={(e) => handleStatusUpdate(e.target.value)}
              value={order.status}
              className="block w-full bg-white border border-gray-300 text-gray-700 py-2 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
            >
              <option value="pending">Pending</option>
              <option value="shipped">Shipped</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetail;
