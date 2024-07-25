import { Outlet } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Footer from "./Footer.jsx";
import Navbar from "./Navbar.jsx";
// import NavbarSecond from "./NavbarSecond.jsx";
import ScrollToTop from "../component/common/ScrollToTop.jsx";

function Layout() {
  return (
    <>
      <ToastContainer
        autoClose={2000}
        position="top-right"
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
      <ScrollToTop />

      <Navbar />
      {/* <div className="pt-24">
        <MenuNavbar />
      </div> */}
      <main className="min-h-[calc(100vh-120px)] pt-28">
        <Outlet />
      </main>
      <Footer />
    </>
  );
}

export default Layout;
