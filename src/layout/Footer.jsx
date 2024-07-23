/* eslint-disable react/no-unescaped-entities */
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <h2 className="text-xl font-bold mb-4">About Me</h2>
            <p className="text-sm">
              I'm Pritesh Golakiya, a passionate web developer dedicated to
              creating innovative and user-friendly solutions.
            </p>
          </div>
          <div>
            <h2 className="text-xl font-bold mb-4">Quick Links</h2>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="hover:text-white transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link
                  to="#"
                  className="hover:text-white transition-colors"
                >
                  Projects
                </Link>
              </li>
              <li>
                <Link
                  to="#"
                  className="hover:text-white transition-colors"
                >
                  About
                </Link>
              </li>
              <li>
                <Link
                  to="#"
                  className="hover:text-white transition-colors"
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h2 className="text-xl font-bold mb-4">Contact Info</h2>
            <ul className="space-y-2 text-sm">
              <li>
                <i className="fas fa-envelope mr-2"></i> priteshgolakiya00@gmail.com
              </li>
              <li>
                <i className="fas fa-phone mr-2"></i> +91 84011 43813
              </li>
              <li>
                <i className="fas fa-map-marker-alt mr-2"></i> Surat, India
              </li>
            </ul>
          </div>
          <div>
            <h2 className="text-xl font-bold mb-4">Stay Connected</h2>
            <div className="flex space-x-4">
              <Link
                to="https://www.linkedin.com/in/pritesh-golakiya-91b861270/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-gray-700 flex items-center justify-center rounded-full text-white hover:bg-blue-600 transition-colors"
              >
                <i className="fab fa-linkedin-in"></i>
              </Link>
              <Link
                to="https://github.com/priteshGolakiya/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-gray-700 flex items-center justify-center rounded-full text-white hover:bg-gray-500 transition-colors"
              >
                <i className="fab fa-github"></i>
              </Link>
              <Link
                to="https://www.instagram.com/mr.golakiya_._?igsh=d3VzdThsdmw2YmRh"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-gray-700 flex items-center justify-center rounded-full text-white hover:bg-pink-600 transition-colors"
              >
                <i className="fab fa-instagram"></i>
              </Link>
            </div>
          </div>
        </div>
      </div>
      <div className="bg-gray-950 py-4">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm">
            &copy; {new Date().getFullYear()} Pritesh Golakiya. All rights
            reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
