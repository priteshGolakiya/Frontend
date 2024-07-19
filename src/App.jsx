import { Route, Routes } from "react-router-dom";
import AdminRoute from "./AdminRoute.jsx";
import Layout from "./layout/Layout.jsx";
import AdminHome from "./pages/admin/AdminHome.jsx";
import CategoryList from "./pages/admin/adminPages/category/CategoryList.jsx";
import NewCategory from "./pages/admin/adminPages/category/NewCategory.jsx";
import OrderDetail from "./pages/admin/adminPages/orders/OrderDetail.jsx";
import OrdersList from "./pages/admin/adminPages/orders/OrdersList.jsx";
// import OrderTracking from "./pages/admin/adminPages/orders/OrderTracking.jsx";
import AddProduct from "./pages/admin/adminPages/product/AddProduct.jsx";
import AllProducts from "./pages/admin/adminPages/product/AllProducts.jsx";
import Review from "./pages/admin/adminPages/review/Review.jsx";
import SubCategoryList from "./pages/admin/adminPages/subCategory/SubCategoryList.jsx";
import SubNewCategory from "./pages/admin/adminPages/subCategory/SubNewCategory.jsx";
import AllUser from "./pages/admin/adminPages/users/AllUser.jsx";
import NewUser from "./pages/admin/adminPages/users/NewUser.jsx";
import AdminPanel from "./pages/admin/AdminPanel.jsx";
import Address from "./pages/common/Address.jsx";
import AddressList from "./pages/common/AddressList.jsx";
import Cart from "./pages/common/Cart.jsx";
import CategoryListPage from "./pages/common/CategoryListPage.jsx";
import ProductsDetailsPage from "./pages/common/ProductsDetailsPage.jsx";
import ProductSearch from "./pages/common/ProductSearch.jsx";
import Profile from "./pages/common/Profile.jsx";
import SubCategoryListPage from "./pages/common/SubCategoryListPage.jsx";
import Home from "./pages/Home";
import ForgotPassword from "./pages/loginSingup/ForgotPasswod.jsx";
import Login from "./pages/loginSingup/Login.jsx";
import Signup from "./pages/loginSingup/Signup.jsx";
import OrdersPage from "./pages/common/OrdersPage.jsx";

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="login" element={<Login />} />
        <Route path="signup" element={<Signup />} />
        <Route path="forgot-password" element={<ForgotPassword />} />
        <Route path="profile" element={<Profile />} />
        <Route path="order" element={<OrdersPage />} />

        {/* Common routes accessible from any part of the application */}
        <Route path="category/:id" element={<CategoryListPage />} />
        <Route path="subcategory/:id" element={<SubCategoryListPage />} />
        <Route path="products/:id" element={<ProductsDetailsPage />} />
        <Route path="cart" element={<Cart />} />
        <Route path="search" element={<ProductSearch />} />
        <Route path="address" element={<Address />} />
        <Route path="addressList" element={<AddressList />} />

        <Route element={<AdminRoute />}>
          <Route path="admin-panel" element={<AdminPanel />}>
            <Route index element={<AdminHome />} />
            <Route path="users/all-users" element={<AllUser />} />
            <Route path="users/new" element={<NewUser />} />
            <Route path="products/all-products" element={<AllProducts />} />
            <Route path="products/add" element={<AddProduct />} />
            <Route path="category/list" element={<CategoryList />} />
            <Route path="category/new" element={<NewCategory />} />
            <Route path="sub-category/list" element={<SubCategoryList />} />
            <Route path="sub-category/new" element={<SubNewCategory />} />
            <Route path="orders/list" element={<OrdersList />} />
            <Route path="orders/detail/:id" element={<OrderDetail />} />
            {/* <Route path="orders/tracking" element={<OrderTracking />} /> */}
            <Route path="review" element={<Review />} />
            <Route path="reports" element={<div>View Reports</div>} />
            <Route path="settings" element={<div>Settings</div>} />
          </Route>
        </Route>
      </Route>
    </Routes>
  );
};

export default App;
