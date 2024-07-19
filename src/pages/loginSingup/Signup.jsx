import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import loginIcon from "../../assets/signin.gif";
import axios from "axios";
import summaryAPI from "../../utils/summaryAPI";
import { toast } from "react-toastify";
import uploadImage from "../../utils/uploadImage";

const SignUp = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    userName: "",
    email: "",
    password: "",
    confirmPassword: "",
    profilePic: "",
  });
  const [error, setError] = useState("");
  const [uploading, setUploading] = useState(false);
  const [imageSelected, setImageSelected] = useState(false);

  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleTogglePassword = () => {
    setShowPassword((prevShow) => !prevShow);
  };

  const handleToggleConfirmPassword = () => {
    setShowConfirmPassword((prevShow) => !prevShow);
  };

  const handleUploadPic = async (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageSelected(true);
      try {
        setUploading(true);
        const uploadResponse = await uploadImage(file);
        setFormData((prev) => ({
          ...prev,
          profilePic: uploadResponse.secure_url,
        }));
        toast.success("Image uploaded successfully");
      } catch (error) {
        toast.error("Image upload failed");
      } finally {
        setUploading(false);
      }
    } else {
      setImageSelected(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (uploading) {
      setError("Please wait for the image to finish uploading");
      toast.error("Please wait for the image to finish uploading");
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match!");
      toast.error("Passwords do not match!");
      return;
    }

    try {
      const response = await axios.post(summaryAPI.common.signUP.url, formData);
      toast.success(response.data.message);
      setError("");
      navigate("/login");
    } catch (error) {
      setError(error.response?.data?.error || "An error occurred");
      toast.error(
        error.response?.data?.error || error.message || "An error occurred"
      );
    }
  };

  return (
    <section
      id="signup"
      className="bg-gray-100 min-h-screen flex items-center justify-center"
    >
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <div className="w-20 h-20 mx-auto relative overflow-hidden rounded-full">
          <img
            src={formData?.profilePic || loginIcon}
            alt="Signup icon"
            className="object-cover w-full h-full"
          />
          <form>
            <label
              htmlFor="profilePic"
              className="text-xs bg-slate-200 bg-opacity-80 pb-4 pt-3 py-4 cursor-pointer text-center absolute bottom-0 w-full"
            >
              {uploading ? "Uploading..." : "Upload Photo"}
            </label>
            <input
              type="file"
              id="profilePic"
              name="profilePic"
              className="hidden"
              onChange={handleUploadPic}
              disabled={uploading}
            />
          </form>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="userName"
              className="block text-sm font-medium text-gray-700"
            >
              Name:
            </label>
            <input
              required
              type="text"
              id="userName"
              name="userName"
              value={formData.userName}
              onChange={handleOnChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="Enter your name"
              autoComplete="name"
              aria-label="Name"
            />
          </div>
          {/* Email input */}
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email:
            </label>
            <input
              required
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleOnChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="Enter your email"
              autoComplete="email"
              aria-label="Email"
            />
          </div>
          {/* Password input */}
          <div className="relative">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Password:
            </label>
            <input
              required
              type={showPassword ? "text" : "password"}
              id="password"
              name="password"
              value={formData.password}
              onChange={handleOnChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm pr-10"
              placeholder="Enter your password"
              autoComplete="new-password"
              aria-label="Password"
            />
            <button
              type="button"
              className="absolute top-6 inset-y-0 right-0 flex items-center px-3 text-gray-600"
              onClick={handleTogglePassword}
            >
              {showPassword ? (
                <i className="fa-solid fa-eye-slash"></i>
              ) : (
                <i className="fa-solid fa-eye"></i>
              )}
            </button>
          </div>
          {/* Confirm Password input */}
          <div className="relative">
            <label
              htmlFor="confirmPassword"
              className="block text-sm font-medium text-gray-700"
            >
              Confirm Password:
            </label>
            <input
              required
              type={showConfirmPassword ? "text" : "password"}
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleOnChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm pr-10"
              placeholder="Confirm your password"
              autoComplete="new-password"
              aria-label="Confirm Password"
            />
            <button
              type="button"
              className="absolute top-6 inset-y-0 right-0 flex items-center px-3 text-gray-600"
              onClick={handleToggleConfirmPassword}
            >
              {showConfirmPassword ? (
                <i className="fa-solid fa-eye-slash"></i>
              ) : (
                <i className="fa-solid fa-eye"></i>
              )}
            </button>
          </div>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <button
            type="submit"
            className="w-full bg-indigo-600 text-white rounded-md py-2 px-4 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50"
            disabled={uploading || (imageSelected && !formData.profilePic)}
          >
            Sign Up
          </button>
          <Link to={"/login"} className="block w-fit ml-auto hover:underline">
            Already have an account? Log in
          </Link>
        </form>
      </div>
    </section>
  );
};

export default SignUp;
