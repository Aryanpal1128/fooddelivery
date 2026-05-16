import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Nav from "../components/Nav";
import { serverurl } from "../App";
import { BsBagCheck } from "react-icons/bs";
import { IoChevronBack } from "react-icons/io5";
import { FaCheckCircle, FaClock, FaReceipt } from "react-icons/fa";

/* ─── Status config ─────────────────────────────────────────────────────────── */
const STATUS = {
  paid: {
    icon: <FaCheckCircle className="text-[10px]" />,
    label: "Paid",
    className: "bg-[#e6f4ea] dark:bg-[#0f2015] text-[#2d7a22] dark:text-[#639922] border border-[#b7dfb8] dark:border-[#1a3820]",
  },
  pending: {
    icon: <FaClock className="text-[10px]" />,
    label: "Pending",
    className: "bg-[#fff3eb] dark:bg-[#1a1208] text-[#e8650a] border border-[#fdd5b0] dark:border-[#3a2810]",
  },
  failed: {
    icon: <FaClock className="text-[10px]" />,
    label: "Failed",
    className: "bg-red-50 dark:bg-red-950/30 text-red-500 border border-red-200 dark:border-red-900",
  },
};

const FILTERS = ["All Orders", "Paid", "Pending"];

/* ─── Single Order Card ─────────────────────────────────────────────────────── */
function OrderCard({ order }) {
  const [expanded, setExpanded] = useState(false);

  const status = STATUS[order.paymentstatus] || STATUS.pending;
  const date = new Date(order.createdAt);
  const dateStr = date.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
  const timeStr = date.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" });
  const allItems = order.shoporders?.flatMap((so) => so.shoporderitems) || [];

  return (
    <div
      className="bg-white dark:bg-[#141210] border border-[#e5ddd5] dark:border-[#1e1c19] rounded-[16px] mb-[12px] cursor-pointer transition-colors select-none"
      onClick={() => setExpanded((e) => !e)}
    >
      {/* Main row */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '18px 24px', boxSizing: 'border-box', width: '100%', overflow: 'hidden' }}>
        {/* Icon box */}
        <div className="w-[48px] h-[48px] shrink-0 rounded-[12px] bg-[#fff3eb] dark:bg-[#1a1208] border border-[#fdd5b0] dark:border-[#3a2810] flex items-center justify-center transition-colors">
          <BsBagCheck className="text-[#e8650a] text-[22px]" />
        </div>

        {/* Info */}
        <div style={{ flex: 1, minWidth: 0, paddingRight: '20px' }}>
          <p className="text-[15px] font-semibold text-[#1a1a1a] dark:text-[#f0ece6] mb-[5px] transition-colors">
            Order #{order._id.slice(-6).toUpperCase()}
          </p>
          <p className="text-[12px] text-[#666] mb-[4px]">{dateStr} · {timeStr}</p>
          <p className="text-[12px] text-[#555]">
            {allItems.length} item{allItems.length !== 1 ? "s" : ""}
          </p>
        </div>

        {/* Price + Status */}
        <div style={{ flexShrink: 0, display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '6px', paddingRight: '12px' }}>
          <span className="text-[16px] font-semibold text-[#e8650a]">₹{order.totalamount}</span>
          <span className={`flex items-center gap-[5px] font-medium rounded-full whitespace-nowrap ${status.className}`} style={{ whiteSpace: 'nowrap', padding: '4px 12px', borderRadius: '50px', fontSize: '12px' }}>
            {status.icon} {status.label}
          </span>
        </div>
      </div>

      {/* Expanded items */}
      {expanded && (
        <div
          className="px-[24px] pb-[16px] border-t border-[#e5ddd5] dark:border-[#1e1c19] mt-0 transition-colors"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="pt-[14px] flex flex-col">
            {allItems.map((item, i) => (
              <div key={i} className="flex justify-between py-[6px]">
                <span className="text-[13px] text-[#666] dark:text-[#aaa] transition-colors">
                  {item.name}
                  <span className="ml-[6px] text-[#555]">× {item.quantity}</span>
                </span>
                <span className="text-[13px] text-[#333] dark:text-[#ddd] transition-colors">
                  ₹{item.price * item.quantity}
                </span>
              </div>
            ))}

            {/* Delivery address */}
            {order.address?.text && (
              <div className="mt-[12px] pt-[12px] border-t border-[#e5ddd5] dark:border-[#1e1c19] transition-colors">
                <p className="text-[11px] font-semibold text-[#888] uppercase tracking-wider mb-[4px]">Delivered to</p>
                <p className="text-[12px] text-[#666] dark:text-[#aaa] leading-[1.5] transition-colors">{order.address.text}</p>
              </div>
            )}

            {/* Payment method */}
            <div className="mt-[10px] flex justify-between items-center">
              <span className="text-[12px] text-[#666] capitalize">
                {order.paymentmethod === "cod" ? "Cash on Delivery" : "UPI / Online"}
              </span>
              <span className="text-[14px] font-semibold text-[#e8650a]">₹{order.totalamount}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ─── Main Page ─────────────────────────────────────────────────────────────── */
function MyOrders() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeFilter, setActiveFilter] = useState("All Orders");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const { data } = await axios.get(`${serverurl}/api/order/myorders`, { withCredentials: true });
        setOrders(data.orders || []);
      } catch (err) {
        setError("Could not load your orders. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const filteredOrders = orders.filter((o) => {
    if (activeFilter === "All Orders") return true;
    return o.paymentstatus === activeFilter.toLowerCase();
  });

  return (
    <div className="min-h-screen bg-[#f5f0eb] dark:bg-[#0f0e0c] transition-colors pb-24">
      <Nav />

      <div className="max-w-1280 mx-auto px-[16px] md:px-[48px]" style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 48px', boxSizing: 'border-box', width: '100%' }}>

        {/* Page Header */}
        <div className="pt-[32px] pb-[16px] mb-[20px] border-b border-[#e5ddd5] dark:border-[#1e1c19] flex items-center gap-[14px] transition-colors">
          <button
            onClick={() => navigate(-1)}
            className="w-[36px] h-[36px] shrink-0 rounded-full flex items-center justify-center bg-white dark:bg-[#1c1a17] border border-[#e5ddd5] dark:border-[#2a2825] text-[#444] dark:text-[#aaa] transition-colors"
          >
            <IoChevronBack size={18} />
          </button>
          <div>
            <h1 className="text-[26px] font-semibold text-[#1a1a1a] dark:text-[#f0ece6] leading-none mb-[4px] transition-colors">My Orders</h1>
            <p className="text-[13px] text-[#666] mt-[4px] transition-colors">
              {loading ? "Loading..." : `${orders.length} order${orders.length !== 1 ? "s" : ""} placed`}
            </p>
          </div>
        </div>

        <div className="max-w-[720px]">

          {/* Filter chips */}
          {!loading && !error && orders.length > 0 && (
            <div style={{ marginTop: '16px', marginBottom: '20px', display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {FILTERS.map((f) => (
                <button
                  key={f}
                  onClick={() => setActiveFilter(f)}
                  style={activeFilter === f
                    ? { padding: '10px 20px', fontSize: '14px', fontWeight: '500', borderRadius: '50px', background: '#e8650a', color: 'white', border: 'none', cursor: 'pointer' }
                    : { padding: '10px 20px', fontSize: '14px', fontWeight: '500', borderRadius: '50px', cursor: 'pointer', border: '0.5px solid #2a2825', background: 'transparent', color: '#666' }
                  }
                >
                  {f}
                </button>
              ))}
            </div>
          )}

          {/* Content */}
          {loading ? (
            /* Skeleton loaders */
            [1, 2, 3].map((i) => (
              <div
                key={i}
                className="bg-white dark:bg-[#141210] border border-[#e5ddd5] dark:border-[#1e1c19] rounded-[16px] mb-[12px] px-[20px] py-[18px] flex items-center gap-[16px] animate-pulse transition-colors"
              >
                <div className="w-[48px] h-[48px] rounded-[12px] bg-[#f5f0eb] dark:bg-[#1c1a17] shrink-0" />
                <div className="flex-1">
                  <div className="h-[14px] w-[130px] bg-[#f5f0eb] dark:bg-[#1c1a17] rounded mb-[8px]" />
                  <div className="h-[11px] w-[90px] bg-[#f5f0eb] dark:bg-[#1c1a17] rounded" />
                </div>
                <div className="flex flex-col items-end gap-[8px]">
                  <div className="h-[16px] w-[50px] bg-[#f5f0eb] dark:bg-[#1c1a17] rounded" />
                  <div className="h-[20px] w-[60px] bg-[#f5f0eb] dark:bg-[#1c1a17] rounded-full" />
                </div>
              </div>
            ))
          ) : error ? (
            <div className="flex flex-col items-center justify-center py-[80px] text-center">
              <FaReceipt className="text-[64px] text-[#2a2825] mb-[20px]" />
              <p className="text-[16px] font-medium text-[#555] mb-[6px]">{error}</p>
            </div>
          ) : filteredOrders.length === 0 ? (
            /* Empty state */
            <div className="flex flex-col items-center justify-center py-[80px] text-center">
              <FaReceipt className="text-[64px] text-[#2a2825] mb-[20px]" />
              <h2 className="text-[20px] font-semibold text-[#555] mb-[8px]">No orders yet</h2>
              <p className="text-[13px] text-[#444]">Your order history will appear here</p>
              {activeFilter === "All Orders" && (
                <button
                  onClick={() => navigate("/")}
                  className="mt-[28px] h-[48px] px-[32px] rounded-[12px] bg-[#e8650a] text-white text-[15px] font-semibold cursor-pointer transition-colors hover:bg-[#cf5807]"
                >
                  Start Ordering
                </button>
              )}
            </div>
          ) : (
            filteredOrders.map((order) => <OrderCard key={order._id} order={order} />)
          )}
        </div>
      </div>
    </div>
  );
}

export default MyOrders;
