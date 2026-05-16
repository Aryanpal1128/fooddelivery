import { useSelector } from "react-redux";
import Nav from "./Nav";
import { GiKnifeFork } from "react-icons/gi";
import { useNavigate } from "react-router-dom";
import Owneritemcard from "./Owneritemcard";
import { MdAdd, MdEdit } from "react-icons/md";

function Owner() {
  const navigate = useNavigate();
  const { shopData } = useSelector((state) => state.owner);

  return (
    <div className="min-h-screen" style={{ background: "#111111" }}>
      <Nav />
      <main className="px-6 md:px-16 lg:px-24 pt-6 md:pt-8 pb-24 max-w-[1600px] mx-auto">

          {/* No shop yet */}
          {!shopData ? (
            <div className="flex items-center justify-center min-h-[80vh]">
              <div
                className="flex flex-col items-center gap-6 p-10 rounded-3xl text-center max-w-md w-full"
                style={{ background: "#1a1a1a", border: "1px solid #2a2a2a" }}
              >
                <div
                  className="flex items-center justify-center rounded-full"
                  style={{ background: "rgba(249,115,22,0.15)", width: "80px", height: "80px" }}
                >
                  <GiKnifeFork style={{ fontSize: "36px", color: "#f97316" }} />
                </div>
                <div>
                  <h2 style={{ color: "#fff", fontWeight: 800, fontSize: "22px", marginBottom: "8px" }}>
                    Add Your Restaurant
                  </h2>
                  <p style={{ color: "#9ca3af", fontSize: "14px", lineHeight: 1.6 }}>
                    Join our platform to serve your dishes hot and fresh to hungry customers nearby 🍽️
                  </p>
                </div>
                <button
                  onClick={() => navigate("/createeditshop")}
                  className="flex items-center gap-2 px-8 py-3 rounded-xl font-semibold text-sm transition-all duration-200 hover:opacity-90"
                  style={{ background: "#f97316", color: "#fff" }}
                >
                  <MdAdd size={20} />
                  Get Started
                </button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col gap-6">

              {/* Shop Details Card */}
              <div
                className="rounded-2xl overflow-hidden"
                style={{ background: "#1a1a1a", border: "1px solid #2a2a2a" }}
              >
                {shopData.image && (
                  <img
                    src={shopData.image}
                    alt={shopData.name}
                    className="w-full object-cover"
                    style={{ height: "200px" }}
                  />
                )}
                <div className="p-6">
                  <h1 style={{ color: "#f97316", fontWeight: 800, fontSize: "22px", marginBottom: "4px" }}>
                    {shopData.name}
                  </h1>

                  <div className="flex flex-wrap gap-3 mt-3 mb-5">
                    {shopData.city && (
                      <span
                        className="px-3 py-1 rounded-full text-xs font-medium"
                        style={{ background: "#222", border: "1px solid #2a2a2a", color: "#9ca3af" }}
                      >
                        📍 {shopData.city}
                      </span>
                    )}
                    {shopData.address && (
                      <span
                        className="px-3 py-1 rounded-full text-xs font-medium"
                        style={{ background: "#222", border: "1px solid #2a2a2a", color: "#9ca3af" }}
                      >
                        🏠 {shopData.address}
                      </span>
                    )}
                    {shopData.state && (
                      <span
                        className="px-3 py-1 rounded-full text-xs font-medium"
                        style={{ background: "#222", border: "1px solid #2a2a2a", color: "#9ca3af" }}
                      >
                        🗺️ {shopData.state}
                      </span>
                    )}
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={() => navigate("/createeditshop")}
                      className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm transition-all duration-200 hover:opacity-90"
                      style={{ background: "#f97316", color: "#fff" }}
                    >
                      <MdEdit size={16} />
                      Edit Shop
                    </button>
                    <button
                      onClick={() => navigate("/additem")}
                      className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm transition-all duration-200 hover:opacity-90"
                      style={{ background: "#1e1e1e", border: "1.5px solid #f97316", color: "#f97316" }}
                    >
                      <MdAdd size={16} />
                      Add Item
                    </button>
                  </div>
                </div>
              </div>

              {/* Shop Items */}
              <div>
                <h2 style={{ color: "#fff", fontWeight: 700, fontSize: "18px", marginBottom: "16px" }}>
                  Your Menu 🍔
                </h2>

                {!shopData.items || shopData.items.length === 0 ? (
                  <div
                    className="flex flex-col items-center justify-center gap-4 py-16 rounded-2xl text-center"
                    style={{ background: "#1a1a1a", border: "1px solid #2a2a2a" }}
                  >
                    <span style={{ fontSize: "48px" }}>🍽️</span>
                    <p style={{ color: "#9ca3af", fontSize: "14px" }}>No menu items yet.</p>
                    <button
                      onClick={() => navigate("/additem")}
                      className="flex items-center gap-2 px-6 py-2.5 rounded-xl font-semibold text-sm"
                      style={{ background: "#f97316", color: "#fff" }}
                    >
                      <MdAdd size={16} />
                      Add First Item
                    </button>
                  </div>
                ) : (
                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {shopData.items.map((item, index) => (
                      <Owneritemcard data={item} key={index} />
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </main>
    </div>
  );
}

export default Owner;
