import React, { useState } from "react";
import API from "../../api";
import "../../components/Admin.css";
import Navbar from "../../components/Navbar";
import { useToast } from "../../components/ToastProvider";
export default function AddProductPage() {
  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    stock: "",
  });

  const [file, setFile] = useState(null);
  const toast = useToast();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFile = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const fd = new FormData();
    Object.keys(form).forEach((key) => fd.append(key, form[key]));
    if (file) fd.append("image", file);

    try {
      await API.post("/products/add", fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      toast.show("Product added!", { type: 'success' });
    } catch (err) {
      console.error(err);
      toast.show("Failed to add product", { type: 'danger' });
    }
  };
 
  return (
    <>
     <Navbar />
    <div className="admin-container">
      <h2>Add Product</h2>

      <form onSubmit={handleSubmit} className="admin-form">
        <input name="name" placeholder="Name" onChange={handleChange} />
        <input name="description" placeholder="Description" onChange={handleChange} />
        <input name="price" placeholder="Price" onChange={handleChange} />
        <input name="category" placeholder="Category" onChange={handleChange} />
        <input name="stock" placeholder="Stock" onChange={handleChange} />

        <input type="file" name="image" onChange={handleFile} />

        <button type="submit">Add Product</button>
      </form>
    </div>
    </>
  );
}
