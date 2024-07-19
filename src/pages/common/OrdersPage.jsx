import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import summaryAPI from "../../utils/summaryAPI";
import { useDispatch } from "react-redux";
import { clearCart, setCartData } from "../../redux/slices/cartSlice";
import { useNavigate } from "react-router-dom";
const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [carts, setCarts] = useState([]);
  const [addresses, setAddresses] = useState([]);
  const [selectedCart, setSelectedCart] = useState("");
  const [selectedAddress, setSelectedAddress] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      await Promise.all([fetchOrders(), fetchCarts(), fetchAddresses()]);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearCart = useCallback(async () => {
    try {
      await axios.delete(summaryAPI.common.clearCart.url, {
        withCredentials: true,
      });
      dispatch(clearCart());
      setCartData(null);
    } catch (err) {
      toast.error(err.message);
    }
  }, [dispatch]);

  const fetchOrders = async () => {
    try {
      const response = await axios.get(summaryAPI.common.getAllOrders.url, {
        withCredentials: true,
      });
      setOrders(response.data);
    } catch (error) {
      toast.error("Failed to fetch orders");
    }
  };

  const fetchCarts = async () => {
    try {
      const response = await axios.get(summaryAPI.common.getUserCart.url, {
        withCredentials: true,
      });
      const cartsData = Array.isArray(response.data)
        ? response.data
        : [response.data];
      setCarts(cartsData);
    } catch (error) {
      console.error("Error fetching carts:", error);
      toast.error("Failed to fetch carts");
    }
  };

  const fetchAddresses = async () => {
    try {
      const response = await axios.get(
        summaryAPI.common.getAddressesByUserId.url,
        {
          withCredentials: true,
        }
      );
      setAddresses(response.data);
    } catch (error) {
      toast.error("Failed to fetch addresses");
    }
  };

  const handleCreateOrder = async () => {
    if (!selectedCart || !selectedAddress) {
      toast.error("Please select both a cart and an address");
      return;
    }

    try {
      const selectedCartData = carts.find((cart) => cart._id === selectedCart);
      if (!selectedCartData) {
        toast.error("Selected cart not found");
        return;
      }

      const orderData = {
        cartItems: selectedCartData.items.map((item) => ({
          product: item.product._id,
          quantity: item.quantity,
          price: item.product.price,
        })),
        shippingAddressId: selectedAddress,
        totalAmount: selectedCartData.totalPrice,
      };

      const response = await axios.post(
        summaryAPI.common.createOrder.url,
        orderData,
        {
          withCredentials: true,
        }
      );

      console.log("Order creation response:", response.data);
      toast.success("Order created successfully");
      handleClearCart();
      dispatch(clearCart());
      fetchOrders();
      setSelectedCart("");
      setSelectedAddress("");
      navigate("/");
    } catch (error) {
      console.error("Error creating order:", error);
      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.message;
      toast.error(`Failed to create order: ${errorMessage}`);
    }
  };

  const renderCartCard = (cart) => (
    <div
      key={cart._id}
      className={`border rounded-lg p-4 cursor-pointer transition-all ${
        selectedCart === cart._id
          ? "border-blue-500 bg-blue-50"
          : "border-gray-200 hover:border-blue-300"
      }`}
      onClick={() => setSelectedCart(cart._id)}
    >
      <h4 className="font-semibold mb-2">Cart {cart._id}</h4>
      <p className="text-sm text-gray-600 mb-2">
        Total: ${cart.totalPrice.toFixed(2)}
      </p>
      <ul className="text-sm">
        {cart.items && cart.items.length > 0 ? (
          cart.items.map((item) => (
            <li key={item._id} className="flex items-center mb-1">
              <img
                src={item.product.images[0]}
                alt={item.product.name}
                className="w-12 h-12 object-cover rounded mr-2"
              />
              <div>
                <p className="font-medium">{item.product.name}</p>
                <p className="text-xs text-gray-500">
                  Quantity: {item.quantity} | Price: ${item.price.toFixed(2)}
                </p>
                <p className="text-xs text-gray-500">
                  Brand: {item.product.brand}
                </p>
              </div>
            </li>
          ))
        ) : (
          <li>No items in cart</li>
        )}
      </ul>
      <p className="text-xs text-gray-500 mt-2">
        Created: {new Date(cart.createdAt).toLocaleString()}
      </p>
    </div>
  );
  const renderAddressCard = (address) => (
    <div
      key={address._id}
      className={`border rounded-lg p-4 cursor-pointer transition-all ${
        selectedAddress === address._id
          ? "border-blue-500 bg-blue-50"
          : "border-gray-200 hover:border-blue-300"
      }`}
      onClick={() => setSelectedAddress(address._id)}
    >
      <h4 className="font-semibold mb-2">
        {address.street}, {address.city}
      </h4>
      <p className="text-sm text-gray-600">
        {address.state}, {address.country} - {address.zipCode}
      </p>
    </div>
  );

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">My Orders</h1>

      <div className="bg-white shadow-md rounded-lg p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Create New Order</h2>

        <h3 className="text-lg font-medium mb-2">Select a Cart</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
          {carts.length > 0 ? (
            carts.map(renderCartCard)
          ) : (
            <p>No carts available</p>
          )}
        </div>

        <h3 className="text-lg font-medium mb-2">Select an Address</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
          {addresses.map(renderAddressCard)}
        </div>

        <button
          onClick={handleCreateOrder}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-300"
        >
          Create Order
        </button>
      </div>

      {/* <h2 className="text-2xl font-semibold mb-4">Your Orders</h2>
      <div className="space-y-6">
        {orders.length === 0 ? (
          <p className="text-center text-gray-500">No orders found.</p>
        ) : (
          orders.map((order) => (
            <div key={order._id} className="bg-white shadow-md rounded-lg p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Order #{order._id}</h3>
                {renderStatusBadge(order.status)}
              </div>
              <p className="text-gray-600 mb-2">
                Total: ${order.totalAmount.toFixed(2)}
              </p>
              <p className="text-gray-600 mb-4">
                Created: {new Date(order.createdAt).toLocaleDateString()}
              </p>
              <div className="mt-4">
                <h4 className="text-sm font-semibold mb-2">Order Items:</h4>
                <ul className="space-y-2">
                  {order.items.map((item) => (
                    <li key={item._id} className="flex items-center space-x-2">
                      <img
                        src={item.product.images[0]}
                        alt={item.product.name}
                        className="w-12 h-12 object-cover rounded"
                      />
                      <div>
                        <p className="text-sm font-medium">
                          {item.product.name}
                        </p>
                        <p className="text-xs text-gray-500">
                          Quantity: {item.quantity} | Price: $
                          {item.price.toFixed(2)}
                        </p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
              {order.status === "pending" && (
                <button
                  onClick={() => handleCancelOrder(order._id)}
                  className="mt-4 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition duration-300"
                >
                  Cancel Order
                </button>
              )}
            </div>
          ))
        )}
      </div> */}
    </div>
  );
};

export default OrdersPage;
