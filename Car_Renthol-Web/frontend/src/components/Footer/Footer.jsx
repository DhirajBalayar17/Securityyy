import React from "react";
import {
  FaFacebook,
  FaInstagram,
  FaLinkedin,
  FaLocationArrow,
  FaMobileAlt,
} from "react-icons/fa";

const FooterLinks = [
  { title: "Home", link: "/" },
  { title: "About Us", link: "/#about" },
  { title: "Contact", link: "/#contact" },
  { title: "Blog", link: "/#blog" },
];

const Footer = () => {
  return (
    <div className="bg-gray-900 text-white mt-14 rounded-t-3xl">
      <section className="container mx-auto py-10 px-4">
        <div className="grid md:grid-cols-3 gap-8">
          {/* 🌟 Company Details */}
          <div className="py-4">
            <h1 className="text-3xl font-bold mb-4 font-serif">Car Rental</h1>
            <p className="text-gray-400">
              Your trusted partner for hassle-free car rentals. Find the perfect
              ride at the best prices for your journey.
            </p>
            <div className="mt-5 space-y-3">
              <div className="flex items-center gap-3">
                <FaLocationArrow />
                <p>Kathmandu, Nepal</p>
              </div>
              <div className="flex items-center gap-3">
                <FaMobileAlt />
                <p>+977 9766978321</p>
              </div>
            </div>
            {/* 🌍 Social Media */}
            <div className="flex items-center gap-4 mt-6">
              <a href="#" className="text-3xl hover:text-yellow-400 transition">
                <FaInstagram />
              </a>
              <a href="#" className="text-3xl hover:text-blue-600 transition">
                <FaFacebook />
              </a>
              <a href="#" className="text-3xl hover:text-blue-400 transition">
                <FaLinkedin />
              </a>
            </div>
          </div>

          {/* 🔗 Links Sections */}
          <div className="grid grid-cols-2 sm:grid-cols-3 col-span-2 gap-8">
            {["Quick Links", "Explore", "Support"].map((category, index) => (
              <div key={index} className="py-4">
                <h1 className="text-xl font-bold mb-3">{category}</h1>
                <ul className="flex flex-col space-y-3">
                  {FooterLinks.map((link, i) => (
                    <li key={i}>
                      <a
                        href={link.link}
                        className="hover:text-yellow-400 transition text-gray-400"
                      >
                        ➤ {link.title}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Footer;
