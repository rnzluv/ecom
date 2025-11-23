import React, { useState } from "react";

export default function SearchWithIntellisense({ products }) {
  const [query, setQuery] = useState("");
  const [filtered, setFiltered] = useState([]);

  const handleChange = (e) => {
    const value = e.target.value;
    setQuery(value);

    if (value.trim() === "") {
      setFiltered([]);
      return;
    }

    const results = products.filter((p) =>
      p.name.toLowerCase().includes(value.toLowerCase())
    );

    setFiltered(results);
  };

  return (
    <div style={{ position: "relative", width: "100%" }}>
      <input
        type="text"
        placeholder="Search product..."
        value={query}
        onChange={handleChange}
        className="search-input"
      />

      {filtered.length > 0 && (
        <ul className="search-dropdown">
          {filtered.map((p) => (
            <li key={p.id} className="search-item">
              {p.name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
