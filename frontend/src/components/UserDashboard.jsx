import React, { useRef, useState, useEffect } from 'react';
import Nav from './Nav.jsx';
import { category } from '../category.js';
import { AiOutlineShoppingCart } from "react-icons/ai";
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Itemcard from './Itemcard.jsx';
import { CiSearch } from "react-icons/ci";
import { MdOutlineTune } from "react-icons/md";
import { FaPlus, FaMinus } from "react-icons/fa6";
import { addtocart, updateCartQuantity, setCity } from '../redux/userSlice';

const GREETING = () => {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 18) return "Good afternoon";
  return "Good evening";
};

const FOOD_EMOJIS = ["🍕","🍔","🌮","🍜","🍱","🥗","🍛","🥪","🍣","🍩"];

function UserDashboard() {
  const categoryScroll = useRef();
  const shopScroll = useRef();
  const itemScroll = useRef();

  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const { city, shopinmycity, iteminmycity, cartitem, totalamount, userData } = useSelector(state => state.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const greeting = GREETING();
  const firstName = userData?.fullname?.split(" ")[0] || "there";

  // Category pills from your category.js + "All"
  const categoryPills = ["All", ...category.map(c => c.category)];

  // Filter items by active category
  const filteredItems = activeCategory === "All"
    ? iteminmycity
    : iteminmycity?.filter(item => item.category?.toLowerCase() === activeCategory.toLowerCase());

  // Search filter
  const displayItems = searchQuery
    ? filteredItems?.filter(item => item.name?.toLowerCase().includes(searchQuery.toLowerCase()))
    : filteredItems;

  // Trending = top-rated items (up to 6)
  const trendingItems = [...(iteminmycity || [])]
    .sort((a, b) => (b.rating?.average || 0) - (a.rating?.average || 0))
    .slice(0, 6);

  return (
    <div className="min-h-screen bg-[#f5f0eb] dark:bg-[#0f0e0c] transition-colors">
        <Nav />

        {/* ── MAIN CONTENT ── */}
      <main className="max-w-1280">

        {/* ── HERO SECTION ── */}
        <section className="pt-[40px] pb-[32px] text-center md:text-left section-gap">
          <h1 className="text-[28px] md:text-[48px] font-medium text-[#1a1a1a] dark:text-white leading-[1.2] mb-[12px] transition-colors heading-gap">
            Your next favourite meal is<br />one click away
          </h1>
          <p className="text-[12px] md:text-[14px] text-center md:text-left text-[#666] dark:text-[#aaa] transition-colors mb-[16px]" style={{ marginBottom: '20px', display: 'block' }}>
            Order from {shopinmycity?.length || "50"}+ restaurants delivering to {city || "Greater Noida"}
          </p>

          {/* Search bar */}
          <div className="flex items-center justify-center md:justify-start mt-[20px] mb-[20px]" style={{ marginTop: '20px', marginBottom: '24px' }}>
            <div className="w-full md:max-w-[680px] h-[50px] flex items-center gap-2 px-[18px] py-[14px] rounded-xl bg-[#f0ece6] dark:bg-[#1c1a17] border border-[#e5ddd5] dark:border-[#1e1c19] transition-colors">
              <CiSearch className="text-[#999] dark:text-[#555] text-[18px] shrink-0 transition-colors" />
              <input
                type="text"
                placeholder="Search for food, restaurants..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 bg-transparent text-sm outline-none text-[#1a1a1a] dark:text-[#f0ece6] transition-colors"
              />
            </div>
          </div>

          {/* Stats Row */}
          <div className="w-full md:max-w-[680px] md:mx-0 py-[20px] mt-[24px] mb-[20px] bg-white dark:bg-transparent border-y border-[#e5ddd5] dark:border-[#1e1c19] transition-colors" style={{ marginTop: '24px', marginBottom: '24px', paddingTop: '20px', paddingBottom: '20px' }}>
            <div className="grid grid-cols-2 md:grid-cols-4 w-full">
              <div className="flex flex-col items-center justify-center py-[8px] md:py-0 md:border-r border-[#e5ddd5] dark:border-[#1e1c19] transition-colors">
                <span className="text-[20px] md:text-[24px] font-semibold text-[#1a1a1a] dark:text-[#f0ece6] transition-colors">50+</span>
                <span className="text-[12px] text-[#666] dark:text-[#aaa] transition-colors">Restaurants</span>
              </div>
              <div className="flex flex-col items-center justify-center py-[8px] md:py-0 md:border-r border-[#e5ddd5] dark:border-[#1e1c19] transition-colors">
                <span className="text-[20px] md:text-[24px] font-semibold text-[#1a1a1a] dark:text-[#f0ece6] transition-colors">20 min</span>
                <span className="text-[12px] text-[#666] dark:text-[#aaa] transition-colors">Avg delivery</span>
              </div>
              <div className="flex flex-col items-center justify-center py-[8px] md:py-0 md:border-r border-[#e5ddd5] dark:border-[#1e1c19] transition-colors">
                <span className="text-[20px] md:text-[24px] font-semibold text-[#1a1a1a] dark:text-[#f0ece6] transition-colors">4.8</span>
                <span className="text-[12px] text-[#666] dark:text-[#aaa] transition-colors">Avg rating</span>
              </div>
              <div className="flex flex-col items-center justify-center py-[8px] md:py-0">
                <span className="text-[20px] md:text-[24px] font-semibold text-[#1a1a1a] dark:text-[#f0ece6] transition-colors">500+</span>
                <span className="text-[12px] text-[#666] dark:text-[#aaa] transition-colors">Happy orders</span>
              </div>
            </div>
          </div>
        </section>

        {/* ── PROMO BANNERS ── */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-[8px] mb-[32px] section-gap">
          {/* Banner 1 */}
          <div className="rounded-[14px] p-[20px_24px] flex items-center justify-between gap-[16px] relative overflow-visible bg-[#fff3eb] dark:bg-[#1a1208] border border-[#fdd5b0] dark:border-[#3a2810] transition-colors">
            <div className="flex-1 min-w-0">
              <span className="inline-block px-2 py-1 rounded-full text-[10px] font-bold mb-[8px] bg-[#e8650a] text-white">
                LIMITED TIME
              </span>
              <h3 className="font-semibold text-[16px] text-[#7a3210] dark:text-[#f0ece6] transition-colors">50% off your first order</h3>
              <p className="text-[12px] mt-[6px] text-[#cc7744] dark:text-[#664422] transition-colors">Min order ₹199</p>
            </div>
            <div className="flex items-center justify-center px-[16px] py-[10px] rounded-[8px] font-bold text-[11px] shrink-0 whitespace-nowrap mr-[4px] border border-dashed border-[#e8650a] text-[#e8650a] transition-colors self-center">
              FOODIE50
            </div>
          </div>

          {/* Banner 2 */}
          <div className="rounded-[14px] p-[20px_24px] flex items-center justify-between gap-[16px] relative overflow-visible bg-[#f0fff4] dark:bg-[#0f1a12] border border-[#b0ddc0] dark:border-[#1a3820] transition-colors">
            <div className="flex-1 min-w-0">
              <span className="inline-block px-2 py-1 rounded-full text-[10px] font-bold mb-[8px] bg-[#22c55e] text-white">
                FREE DELIVERY
              </span>
              <h3 className="font-semibold text-[16px] text-[#1a4a2a] dark:text-[#f0ece6] transition-colors">Free delivery all weekend</h3>
              <p className="text-[12px] mt-[6px] text-[#2d7a45] dark:text-[#2d5a35] transition-colors">No min order · Sat & Sun only</p>
            </div>
            <div className="flex items-center justify-center px-[16px] py-[10px] rounded-[8px] font-bold text-[11px] shrink-0 whitespace-nowrap mr-[4px] border border-dashed border-[#22c55e] dark:border-[#22c55e] text-[#2d7a45] dark:text-[#639922] transition-colors self-center">
              FREEDEL
            </div>
          </div>
        </section>

        {/* ── CATEGORIES ── */}
        <section className="section-gap">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold text-[22px] mt-[8px] mb-[12px] text-[#1a1a1a] dark:text-white transition-colors heading-gap">Categories</h2>
          </div>

          <div className="flex flex-nowrap overflow-x-auto scrollbar-hidden gap-[8px] mb-[24px] py-[4px] px-[2px]">
            {categoryPills.map((cat, i) => {
              let iconClass = "ti-flame";
              if (cat.toLowerCase() === "pizza") iconClass = "ti-pizza";
              else if (cat.toLowerCase() === "burger") iconClass = "ti-burger";
              else if (cat.toLowerCase() === "snacks") iconClass = "ti-bowl";
              else if (cat.toLowerCase() === "dessert") iconClass = "ti-ice-cream";
              else if (cat.toLowerCase() === "main course") iconClass = "ti-tools-kitchen-2";
              else if (cat.toLowerCase() === "biryani") iconClass = "ti-soup";

              return (
                <button
                  key={i}
                  onClick={() => setActiveCategory(cat)}
                  className={`shrink-0 whitespace-nowrap overflow-visible inline-flex items-center gap-[7px] px-[16px] py-[8px] rounded-[50px] text-[13px] cursor-pointer transition-colors border ${
                    activeCategory === cat
                      ? "bg-[#e8650a] dark:bg-[#e8650a] border-[#e8650a] dark:border-[#e8650a] text-white"
                      : "bg-[#f0ece6] dark:bg-[#1c1a17] border-[#e5ddd5] dark:border-[#2a2825] text-[#666] dark:text-[#ccc]"
                  }`}
                >
                  <i className={`ti ${iconClass} text-[14px]`}></i>
                  {cat}
                </button>
              );
            })}
          </div>
        </section>

        {/* ── TRENDING NOW ── */}
        <section className="section-gap">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold text-[22px] mt-[8px] mb-[16px] text-[#1a1a1a] dark:text-white transition-colors heading-gap">Trending near you</h2>
            <button className="text-[#e8650a] text-[12px]">See all</button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-[16px]">
            {trendingItems?.length > 0 ? trendingItems.map((item, index) => (
              <TrendingCard key={index} data={item} navigate={navigate} dispatch={null} cartitem={cartitem} />
            )) : (
              <p style={{ color: "#555", fontSize: "14px" }}>No items nearby yet.</p>
            )}
          </div>
        </section>

        {/* ── BEST SHOPS ── */}
        {shopinmycity?.length > 0 ? (
          <>
            <section id="restaurants" className="section-gap mt-[32px]">
              <div className="flex items-center justify-between">
                <h2 className="font-semibold text-[22px] mb-[16px] text-[#1a1a1a] dark:text-white transition-colors heading-gap">Best shops nearby</h2>
                <button className="text-[#e8650a] text-[12px]">See all</button>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-[16px]">
                {shopinmycity.map((shop, index) => (
                  <ShopCard key={index} shop={shop} />
                ))}
              </div>
            </section>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center gap-6 py-16 text-center rounded-[20px] bg-white dark:bg-[#141210] border border-[#e5ddd5] dark:border-[#1e1c19] px-6 my-8">
            <span style={{ fontSize: "64px" }}>🏪</span>
            <div>
              <h3 className="font-semibold text-lg text-[#1a1a1a] dark:text-white mb-2">
                No active restaurants found in "{city || "your location"}"
              </h3>
              <p className="text-sm text-[#666] dark:text-[#aaa] max-w-md mx-auto">
                We haven't expanded to your location yet. Try exploring one of our fully-supported cities below to check out the food!
              </p>
            </div>
            
            <div className="flex flex-wrap items-center justify-center gap-3 mt-2">
              {["Greater Noida", "Delhi", "Noida"].map((popCity) => (
                <button
                  key={popCity}
                  onClick={() => dispatch(setCity(popCity))}
                  className="px-5 py-2.5 rounded-full text-xs font-semibold border border-[#e8650a] text-[#e8650a] transition-all hover:bg-[#e8650a] hover:text-white"
                >
                  📍 {popCity}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ── ALL FOOD ITEMS ── */}
        <section className="section-gap mt-[32px]">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold text-[22px] mb-[16px] text-[#1a1a1a] dark:text-white transition-colors heading-gap">
              {activeCategory === "All" ? "All Food Items" : activeCategory}
            </h2>
            <span className="text-[#555] text-[12px]">
              {displayItems?.length || 0} items
            </span>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-[16px]">
            {displayItems?.map((data, index) => (
              <Itemcard data={data} key={index} />
            ))}
            {(!displayItems || displayItems.length === 0) && (
              <p style={{ color: "#555", fontSize: "14px" }}>No items found.</p>
            )}
          </div>
        </section>
      </main>

      {/* ── FLOATING CART BAR ── */}
      {cartitem?.length > 0 && (
        <div
          onClick={() => navigate('/cart')}
          className="fixed z-50 flex items-center justify-between cursor-pointer animate-slideUp transition-transform hover:scale-105"
          style={{ 
            bottom: "24px", 
            left: "50%", 
            transform: "translateX(-50%)",
            background: "#e8650a", 
            borderRadius: "50px",
            padding: "14px 28px",
            minWidth: "320px",
            maxWidth: "420px",
            width: "auto",
            boxShadow: "0 4px 20px rgba(232, 101, 10, 0.4)" 
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <AiOutlineShoppingCart style={{ fontSize: "20px", color: "white" }} />
            <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", lineHeight: "1.2" }}>
              <span style={{ fontSize: "14px", fontWeight: 600, color: "white" }}>
                {cartitem.length} {cartitem.length === 1 ? "Item" : "Items"}
              </span>
              <span style={{ fontSize: "13px", color: "rgba(255, 255, 255, 0.8)" }}>
                ₹{totalamount}
              </span>
            </div>
          </div>
          
          <div style={{ display: "flex", alignItems: "center" }}>
            <div style={{ width: "1px", height: "24px", background: "rgba(255, 255, 255, 0.3)", margin: "0 16px" }}></div>
            <span style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "15px", fontWeight: 600, color: "white" }}>
              View Cart &rarr;
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

/* ── Trending item card ── */
function TrendingCard({ data, navigate, cartitem }) {
  const dispatch = useDispatch();
  const cartEntry = cartitem?.find(item => item._id === data._id);
  const quantity = cartEntry?.quantity || 0;
  const emoji = ["🍕","🍔","🌮","🍜","🍱","🥗","🍛","🥪","🍣","🍩"][Math.floor(Math.random() * 10)];

  const handleIncrease = (e) => {
    e.stopPropagation();
    if (quantity === 0) {
      dispatch(addtocart({
        _id: data._id,
        name: data.name,
        price: data.price,
        image: data.image,
        shop: data.shop,
        quantity: 1,
        foodtype: data.foodtype,
      }));
    } else {
      dispatch(updateCartQuantity({ _id: data._id, quantity: quantity + 1 }));
    }
  };

  const handleDecrease = (e) => {
    e.stopPropagation();
    dispatch(updateCartQuantity({ _id: data._id, quantity: quantity - 1 }));
  };

  return (
    <div className="flex flex-col rounded-[14px] overflow-hidden bg-white dark:bg-[#141210] border border-[#e5ddd5] dark:border-[#1e1c19] transition-colors">
      {/* Image area */}
      <div className="w-full relative h-[160px] bg-[#f0ece6] dark:bg-[#1c1a17] transition-colors">
        {/* Veg/non-veg dot */}
        <span
          className="absolute top-2 left-2 w-2 h-2 rounded-sm flex items-center justify-center"
          style={{ border: `1px solid ${data.foodtype === "Veg" ? "#22c55e" : "#ef4444"}` }}
        >
          <span className="w-1 h-1 rounded-full" style={{ background: data.foodtype === "Veg" ? "#22c55e" : "#ef4444" }} />
        </span>

        {data.image ? (
          <img src={data.image} alt={data.name} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center"><span style={{ fontSize: "48px" }}>{emoji}</span></div>
        )}
      </div>

      {/* Info */}
      <div className="p-[12px_14px] flex flex-col justify-between flex-1">
        <div>
          <h3 className="font-medium text-[13px] whitespace-nowrap overflow-hidden text-ellipsis text-[#1a1a1a] dark:text-[#ddd] transition-colors mb-[6px]">
            {data.name}
          </h3>
          <div className="flex items-center justify-between mb-[10px]">
            <span className="font-medium text-[14px] text-[#e8650a] dark:text-[#e8650a] transition-colors">₹{data.price}</span>
            <span className="text-[11px] text-[#666] dark:text-[#666] transition-colors">
              ★ {data.rating?.average ? data.rating.average.toFixed(1) : "4.5"}
            </span>
          </div>
        </div>
        <div className="mt-auto transition-all duration-200 ease-in-out h-[36px]">
          {quantity > 0 ? (
            <div className="w-full h-[36px] bg-[#e8650a] rounded-[8px] flex items-center justify-between px-[4px]">
              <button
                onClick={handleDecrease}
                className="w-[28px] h-[28px] rounded-[6px] bg-white/20 border-none text-white text-[18px] cursor-pointer flex items-center justify-center transition-colors hover:bg-white/30"
              >
                <FaMinus style={{ fontSize: "14px" }} />
              </button>
              <span className="text-[15px] font-semibold text-white min-w-[24px] text-center">
                {quantity}
              </span>
              <button
                onClick={handleIncrease}
                className="w-[28px] h-[28px] rounded-[6px] bg-white/20 border-none text-white text-[18px] cursor-pointer flex items-center justify-center transition-colors hover:bg-white/30"
              >
                <FaPlus style={{ fontSize: "14px" }} />
              </button>
            </div>
          ) : (
            <button
              onClick={handleIncrease}
              className="w-full h-[36px] bg-[#e8650a] rounded-[8px] flex items-center justify-center text-white text-[18px] cursor-pointer transition-colors hover:bg-[#cf5807]"
            >
              <FaPlus style={{ fontSize: "18px" }} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

/* ── Shop card ── */
function ShopCard({ shop }) {
  const navigate = useNavigate();
  return (
    <div
      className="flex flex-col rounded-[14px] overflow-hidden min-h-[200px] bg-white dark:bg-[#141210] border border-[#e5ddd5] dark:border-[#1e1c19] transition-colors cursor-pointer hover:border-[#e8650a] hover:shadow-md"
      onClick={() => navigate(`/shop/${shop._id}`)}
    >
      <div className="w-full relative shrink-0 h-[160px] bg-[#f0ece6] dark:bg-[#1c1a17] transition-colors">
        {shop.image ? (
          <img src={shop.image} alt={shop.name} className="w-full h-full object-cover rounded-t-[12px]" />
        ) : (
          <div className="w-full h-full flex items-center justify-center"><span style={{ fontSize: "24px" }}>🍽️</span></div>
        )}
      </div>

      <div className="p-[12px_14px] flex flex-col flex-1">
        <h4 className="font-medium text-[14px] whitespace-nowrap overflow-hidden text-ellipsis text-[#1a1a1a] dark:text-[#ddd] transition-colors mb-[6px]">
          {shop.name}
        </h4>
        <div className="flex items-center gap-2 mb-[10px]">
          <span className="px-[9px] py-[2px] rounded-[50px] text-[11px] bg-[#fff3eb] dark:bg-[#1a1208] text-[#e8650a] dark:text-[#e8650a] border border-[#fdd5b0] dark:border-[#3a2810] transition-colors">
            New
          </span>
          <span className="text-[11px] text-[#999] dark:text-[#555] transition-colors">25 min</span>
        </div>
        <p className="text-[11px] mt-[4px] text-[#666] dark:text-[#666] transition-colors">
          ★ 4.3
        </p>
      </div>
    </div>
  );
}

export default UserDashboard;
