
import { Link } from "react-router-dom";
import { Facebook, Instagram, Twitter, Mail, MapPin, Phone } from "lucide-react";
const Footer = () => {
  return <footer className="bg-catering-primary text-white">
      <div className="container mx-auto px-4 py-12 bg-orange-600">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-xl font-semibold mb-4">bysizzle</h3>
            <p className="text-gray-300 mb-4">
              Elevate your corporate events with culturally rich, sustainable catering services tailored for business professionals.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-300 hover:text-catering-accent">
                <Facebook size={20} />
                <span className="sr-only">Facebook</span>
              </a>
              <a href="#" className="text-gray-300 hover:text-catering-accent">
                <Instagram size={20} />
                <span className="sr-only">Instagram</span>
              </a>
              <a href="#" className="text-gray-300 hover:text-catering-accent">
                <Twitter size={20} />
                <span className="sr-only">Twitter</span>
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="text-xl font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-300 hover:text-catering-accent">Home</Link>
              </li>
              <li>
                <Link to="/services" className="text-gray-300 hover:text-catering-accent">Services</Link>
              </li>
              <li>
                <Link to="/menus" className="text-gray-300 hover:text-catering-accent">Menus</Link>
              </li>
              <li>
                <Link to="/about" className="text-gray-300 hover:text-catering-accent">About Us</Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-300 hover:text-catering-accent">Contact</Link>
              </li>
              <li>
                <Link to="/login" className="text-gray-300 hover:text-catering-accent">Client Login</Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-xl font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-4">
              <li className="flex items-start">
                <MapPin className="mr-2 h-5 w-5 text-catering-accent flex-shrink-0" />
                <span className="text-gray-300">Kungssätravägen 15<br />12737 Stockholm, Sweden</span>
              </li>
              <li className="flex items-center">
                <Phone className="mr-2 h-5 w-5 text-catering-accent flex-shrink-0" />
                <span className="text-gray-300">+46 707 202 201</span>
              </li>
              <li className="flex items-center">
                <Mail className="mr-2 h-5 w-5 text-catering-accent flex-shrink-0" />
                <span className="text-gray-300">nabeel@bysizzle.com</span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-12 pt-8 bg-slate-50">
          <p className="text-center text-gray-400 text-sm">
            &copy; {new Date().getFullYear()} bysizzle (Tavernan by Sizzle AB). All rights reserved.
          </p>
        </div>
      </div>
    </footer>;
};
export default Footer;

