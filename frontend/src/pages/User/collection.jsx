import React from "react";
import Header from "../components/header";
import Footer from "../components/footer";

export default function Collection() {
  const products = [
    { id: 1, name: "Sample Product 1", price: 199 },
    { id: 2, name: "Sample Product 2", price: 299 },
    { id: 3, name: "Sample Product 3", price: 399 },
  ];

  return React.createElement(
    "div",
    { className: "collection-page" },


    React.createElement(
      "section",
      { className: "collection-container" },

      React.createElement("h2", null, "Our Collection"),

      React.createElement(
        "div",
        { className: "collection-grid" },

        products.map((item) =>
          React.createElement(
            "div",
            { key: item.id, className: "product-card" },

            React.createElement("h3", null, item.name),
            React.createElement("p", null, "₱" + item.price),

            React.createElement(
              "button",
              {
                onClick: () => {
                  window.location.href = "/login"; // redirect to login before adding to cart
                },
              },
              "Add to Cart"
            )
          )
        )
      )
    ),

    React.createElement(Footer, null)
  );
}
