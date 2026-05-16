import React from "react";

function CategoryCard({ name, image }) {
  return (
    <div
      className="relative flex-shrink-0 rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
      style={{
        width: "120px",
        height: "120px",
        border: "1px solid #2a2a2a",
        background: "#1a1a1a",
      }}
    >
      {/* Background Image */}
      <img
        src={image}
        alt={name}
        className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
      />

      {/* Overlay */}
      <div
        className="absolute inset-0"
        style={{ background: "linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.2) 50%, transparent 100%)" }}
      />

      {/* Name */}
      <h3
        className="absolute bottom-0 left-0 w-full text-center py-2"
        style={{ color: "#fff", fontSize: "12px", fontWeight: 600, letterSpacing: "0.3px" }}
      >
        {name}
      </h3>
    </div>
  );
}

export default CategoryCard;
