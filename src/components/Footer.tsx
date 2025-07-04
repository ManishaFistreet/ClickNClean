import React from "react";
import { facebook } from "../assets";
import { X } from "../assets";
import { instagram } from "../assets";
import Rating from '@mui/material/Rating';
const Footer = () => {
  return (
    <>
      <footer className="w-full bg-[#2a4f3e]">
        <div className="max-w-7xl mx-auto mt-[-2rem]">
          {/* White Top Box */}
          <div className="bg-white rounded-t-2xl shadow-md px-6 md:px-12 py-8 flex flex-col md:flex-row justify-between items-center">
            {/* Logo & Text */}
            <div className="flex items-center space-x-3">
              ✨
              <h1 className="text-xl font-bold text-green-700">
                Click<span className="text-green-900">NClean</span>
              </h1>
            </div>

            {/* Tagline */}
            <h2 className="text-lg font-semibold text-green-800 text-center mt-4 md:mt-0">
              Cleaning your worries away!
            </h2>

            {/* Social Icons */}
            <div className="flex space-x-4 mt-4 md:mt-0">
              <div className="bg-lime-400 p-3 rounded-full" style={{ width: '45px', height: '45px' }}>
                <img src={facebook} />
              </div>
              <div className="bg-lime-400 p-3 rounded-full" style={{ width: '45px', height: '45px' }}>
                <img src={X} />

              </div>
              <div className="bg-lime-400 p-3 rounded-full" style={{ width: '45px', height: '45px' }}>
                <img src={instagram} />

              </div>

            </div>
          </div>

          {/* Main Grid Section */}
          <div className="bg-[#e1f0af] rounded-b-2xl px-6 md:px-12 py-12 grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Contact */}
            <div>
              <h3 className="font-semibold text-black mb-3">Contact Us</h3>
              <p className="text-sm text-gray-700">
                Office: jodhpur<br />
                Jodhpur-Rajasthan <br />
                Email:{" "}
                <a href="mailto:hello@yourdomain.tld" className="underline">
                  clicknclick.gmail.com
                </a>
              </p>
              <div className="flex items-center space-x-3 mt-4">
                <div className="bg-yellow-400 rounded-full p-2">
                  <i className="bi bi-telephone text-green-800 text-lg"></i>
                </div>
                <span className="text-green-800 text-lg font-bold select-none">
                  888 4000-234
                </span>
              </div>
            </div>

            {/* Services */}
            <div>
              <h3 className="font-semibold text-black mb-3">Services</h3>
              <ul className="text-sm text-gray-800 space-y-1">
                <li>Room Cleaning</li>
                <li>Window Cleaning</li>
                <li>Toilet Cleaning</li>
                <li>Garden Cleaning</li>
                <li>Kitchen Cleaning</li>
              </ul>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="font-semibold text-black mb-3">Quick Links</h3>
              <ul className="text-sm text-gray-800 space-y-1">
                <li>About Us</li>
                <li>Offers</li>
                <li>Packages</li>
                <li>Register as Professional</li>
                <li>Reviews</li>
              </ul>
            </div>


            <div>
              <h3 className="font-semibold text-black mb-3">Give your Rating & Review</h3>
              <Rating name="no-value" value={null}   style={{marginLeft:'35px',marginBottom:''}}/>
              <div style={{marginLeft:'40px'}}>
                <button
                  type="submit"
                  className="bg-gradient-to-r from-lime-400 to-lime-600 text-white text-base px-6 py-3 rounded-md shadow-md hover:opacity-90 transition">
                  Submit
                </button>
              </div>
            </div>
          </div>

          {/* Bottom Copyright */}
          <div className="bg-[#2a4f3e] text-white text-xs py-4 px-6 md:px-12 flex flex-col md:flex-row justify-between items-center rounded-b-2xl">
            <p className="text-center md:text-left">
              Copyright © ClickNClean, All rights reserved. Powered by
              Fistreet System Pvt. Ltd.
            </p>
            <div className="flex space-x-4 mt-2 md:mt-0">
              <a href="#" className="hover:underline">
                Privacy Policy
              </a>
              <a href="#" className="hover:underline">
                Cookie Policy
              </a>
              <a href="#" className="hover:underline">
                Terms of Service
              </a>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Footer;
