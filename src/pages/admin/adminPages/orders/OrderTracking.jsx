import { useState } from "react";

const OrderTracking = () => {
  const [trackingNumber, setTrackingNumber] = useState("");
  const [trackingResult, setTrackingResult] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();

    setTrackingResult({
      orderNumber: "12345",
      status: "In Transit",
      estimatedDelivery: "2023-07-25",
    });
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Order Tracking</h1>
      <form onSubmit={handleSubmit} className="mb-4">
        <input
          type="text"
          value={trackingNumber}
          onChange={(e) => setTrackingNumber(e.target.value)}
          placeholder="Enter tracking number"
          className="border border-gray-300 p-2 mr-2"
        />
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Track Order
        </button>
      </form>
      {trackingResult && (
        <div className="bg-white shadow-md rounded p-4">
          <h2 className="text-xl font-semibold mb-2">Tracking Result</h2>
          <p className="mb-1">
            <strong>Order Number:</strong> {trackingResult.orderNumber}
          </p>
          <p className="mb-1">
            <strong>Status:</strong> {trackingResult.status}
          </p>
          <p className="mb-1">
            <strong>Estimated Delivery:</strong>{" "}
            {trackingResult.estimatedDelivery}
          </p>
        </div>
      )}
    </div>
  );
};

export default OrderTracking;
