import React, { useContext } from "react";
import AppContext from "../Context/appContext";

const footerData = {
  logo: "🛒 Quicy.",
  description:
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore.",
  socialIcons: [
    { iconClass: "fab fa-facebook-f" },
    { iconClass: "fab fa-twitter" },
    { iconClass: "fab fa-instagram" },
    { iconClass: "fab fa-youtube" },
  ],
  columns: [
    {
      heading: "Company",
      links: [
        { name: "About Us", link: "/about" },
        { name: "Blogs", link: "/blog" },
        { name: "Contact Us", link: "/contact-us" },
        { name: "Career", link: "/career" },
      ],
    },
    {
      heading: "Customer Services",
      links: [
        { name: "My Account", link: "/accounts" },
        { name: "Your Orders", link: "/your-orders" },
        { name: "Contact Us", link: "/contact-us" },
        { name: "Return", link: "/return" },
      ],
    },
    {
      heading: "Our Information",
      links: [
        { name: "Privacy", link: "/privacy" },
        { name: "User Terms & Conditions", link: "/terms" },
        { name: "Return Policy", link: "/return-policy" },
      ],
    },
    {
      heading: "Contact Info",
      links: [
        { icon: "fas fa-phone-alt", text: "+0123-456-789" },
        { icon: "fas fa-envelope", text: "example@gmail.com" },
        {
          icon: "fas fa-map-marker-alt",
          text: "8502 Preston Rd. Inglewood, Maine 98380",
        },
      ],
    },
  ],
  copyright: {
    text: "Copyright © 2024",
    brand: "Grocery Website Design",
    suffix: "All Rights Reserved.",
  },
};

const Footer = () => {
  const { siteData } = useContext(AppContext);

  const primaryColor = siteData?.primaryColor || '#ffffff'; // used for text/icons
  const secondaryColor = siteData?.secondaryColor || '#222831'; // used as background
  const tertiaryColor = siteData?.tertiaryColor || '#222831'; // used as background

  return (
    <footer className="pt-5" style={{ backgroundColor: tertiaryColor, color: primaryColor }}>
      <div className="container">
        <div className="row">
          {/* Logo + Description + Social Icons */}
          <div className="col-md-3 mb-4">
            <h4 style={{ color: primaryColor }}>{footerData.logo}</h4>
            <p>{footerData.description}</p>
            <div className="d-flex gap-3">
              {footerData.socialIcons.map((icon, index) => (
                <a href="#" key={index} style={{ color: primaryColor }}>
                  <i className={icon.iconClass}></i>
                </a>
              ))}
            </div>
          </div>

          {/* Dynamic Columns */}
          {footerData.columns.map((col, index) => (
            <div className="col-md-3 mb-4" key={index}>
              <h5 style={{ color: primaryColor }}>{col.heading}</h5>
              <ul className="list-unstyled">
                {col.links.map((item, i) => (
                  <li key={i} className="mb-2">
                    {item.name ? (
                      <a
                        href={item.link}
                        className="text-decoration-none"
                        style={{ color: primaryColor }}
                      >
                        {item.name}
                      </a>
                    ) : (
                      <span>
                        <i className={`${item.icon} me-2`}></i>
                        {item.text}
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Copyright */}
        <div className="text-center py-3 border-top mt-4" style={{ borderColor: primaryColor }}>
          <small>
            {footerData.copyright.text}{" "}
            <strong>{footerData.copyright.brand}</strong>.{" "}
            {footerData.copyright.suffix}
          </small>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
