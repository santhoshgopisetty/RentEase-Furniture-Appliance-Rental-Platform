import React from 'react';
import { Link } from 'react-router-dom';
import { MdOutlineWeekend } from 'react-icons/md';
import { FiInstagram, FiTwitter, FiFacebook } from 'react-icons/fi';

const Footer = () => {
  return (
    <footer className="bg-dark-950 border-t border-dark-800 text-dark-400">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <Link to="/" className="flex items-center space-x-2 text-brand-500 font-extrabold text-xl tracking-wider">
              <MdOutlineWeekend className="text-2xl" />
              <span>RentEase</span>
            </Link>
            <p className="text-xs text-dark-500 leading-relaxed">
              Premium furniture and high-quality appliances for rent. Furnish your dream home without the upfront commitment. Easy, affordable, and flexible.
            </p>
            <div className="flex space-x-4 text-dark-300">
              <a href="#" className="hover:text-brand-500 transition-colors"><FiFacebook /></a>
              <a href="#" className="hover:text-brand-500 transition-colors"><FiTwitter /></a>
              <a href="#" className="hover:text-brand-500 transition-colors"><FiInstagram /></a>
            </div>
          </div>

          <div>
            <h3 className="text-white text-sm font-semibold tracking-wider uppercase mb-4">Furniture</h3>
            <ul className="space-y-2 text-xs">
              <li><Link to="/products?category=Bed" className="hover:text-white transition-colors">Beds</Link></li>
              <li><Link to="/products?category=Sofa" className="hover:text-white transition-colors">Sofas & Sectionals</Link></li>
              <li><Link to="/products?category=Table" className="hover:text-white transition-colors">Dining & Study Tables</Link></li>
              <li><Link to="/products?category=Chair" className="hover:text-white transition-colors">Ergonomic Chairs</Link></li>
              <li><Link to="/products?category=Wardrobe" className="hover:text-white transition-colors">Spacious Wardrobes</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-white text-sm font-semibold tracking-wider uppercase mb-4">Appliances</h3>
            <ul className="space-y-2 text-xs">
              <li><Link to="/products?category=Refrigerator" className="hover:text-white transition-colors">Refrigerators</Link></li>
              <li><Link to="/products?category=Washing Machine" className="hover:text-white transition-colors">Washing Machines</Link></li>
              <li><Link to="/products?category=Television" className="hover:text-white transition-colors">Smart Televisions</Link></li>
              <li><Link to="/products?category=Microwave" className="hover:text-white transition-colors">Microwave Ovens</Link></li>
              <li><Link to="/products?category=Air Conditioner" className="hover:text-white transition-colors">Air Conditioners</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-white text-sm font-semibold tracking-wider uppercase mb-4">Support & Care</h3>
            <ul className="space-y-2 text-xs">
              <li><Link to="/dashboard" className="hover:text-white transition-colors">Track Deliveries</Link></li>
              <li><Link to="/dashboard" className="hover:text-white transition-colors">Maintenance Request</Link></li>
              <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-dark-800 flex flex-col md:flex-row justify-between items-center text-xs text-dark-500">
          <p>© {new Date().getFullYear()} RentEase Platform. All rights reserved.</p>
          <p className="mt-4 md:mt-0">Internship Capstone Project by Santhosh Gopisetty</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
