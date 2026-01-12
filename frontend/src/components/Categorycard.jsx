import React from "react";

function CategoryCard({ name, image }) {
  return (
    <div
      className="relative w-[120px] h-[120px] md:w-[180px] md:h-[180px]
                 rounded-2xl border-2 border-orange-400 shrink-0 overflow-hidden
                 bg-white shadow-md hover:shadow-lg hover:scale-[1.03] transition-all duration-300 cursor-pointer"
    >
      {/*  Background Image */}
      <img
        src={image}
        alt={name}
        className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
      />

      {/*  Overlay fade effect (no layout change) */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent"></div>

      {/*  Category Name Text */}
      <h3
        className="absolute bottom-0 left-0 w-full text-center text-white text-sm md:text-base font-semibold py-2
                   bg-gradient-to-t from-black/70 via-black/20 to-transparent backdrop-blur-[2px]"
      >
        {name}
      </h3>
    </div>
  );
}

export default CategoryCard;
