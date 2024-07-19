import { useEffect, useState } from "react";
import axios from "axios";
import summaryAPI from "../../utils/summaryAPI";
import Address from "./Address";
import { Link } from "react-router-dom";

const AddressList = () => {
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAddresses = async () => {
    try {
      const { data } = await axios.get(
        summaryAPI.common.getAddressesByUserId.url,
        {
          withCredentials: true,
        }
      );
      setAddresses(data);
    } catch (error) {
      setError(error.response.data.message || "Server Error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAddresses();
  }, []);

  const deleteAddress = async (addressId) => {
    try {
      await axios.delete(
        `${summaryAPI.common.getAllAddresses.url}/${addressId}`,
        {
          withCredentials: true,
        }
      );
      setAddresses(addresses.filter((address) => address._id !== addressId));
    } catch (error) {
      setError(error.response.data.message || "Server Error");
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Your Addresses</h1>
      <Link
        to={`/order`}
        className="bg-blue-500 text-white m-4 px-6 py-2 rounded hover:bg-blue-600 transition duration-200"
      >
        Proced To Place Order
      </Link>

      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <div className="grid grid-cols-1 m-3 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {addresses.map((address) => (
            <div key={address._id} className="border p-4 rounded shadow">
              <p>
                <strong>Street:</strong> {address.street}
              </p>
              <p>
                <strong>City:</strong> {address.city}
              </p>
              <p>
                <strong>State:</strong> {address.state}
              </p>
              <p>
                <strong>Country:</strong> {address.country}
              </p>
              <p>
                <strong>Zip Code:</strong> {address.zipCode}
              </p>
              {address.isDefault && <p className="text-green-500">Default</p>}
              <button
                onClick={() => deleteAddress(address._id)}
                className="mt-2 text-white bg-red-500 hover:bg-red-700 py-1 px-3 rounded"
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      )}
      <Address fetchAddresses={fetchAddresses} />
    </div>
  );
};

export default AddressList;
