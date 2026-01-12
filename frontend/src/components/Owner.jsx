import { useSelector } from "react-redux";
import Nav from "./nav";
import { GiKnifeFork } from "react-icons/gi";
import { useNavigate } from "react-router-dom";
import Owneritemcard from "./Owneritemcard";

function Owner() {
  const navigate = useNavigate();
  const { shopData } = useSelector((state) => state.owner);

  return (
    < >
      <Nav />
      <main className="w-full min-h-screen flex flex-col items-center justify-start bg-gradient-to-br from-orange-100 via-yellow-50 to-pink-100 text-center p-6 transition-all duration-300">
        {/* 🧩 CASE 1: No Shop Yet */}
        {!shopData ? (
          <div className="flex flex-col items-center gap-5 bg-white/80 backdrop-blur-md p-10 rounded-3xl shadow-2xl max-w-md w-full mt-16 transform hover:scale-[1.02] transition-transform duration-300">
            {/* Icon */}
            <div className="text-5xl text-orange-500 animate-bounce">
              <GiKnifeFork />
            </div>

            {/* Heading */}
            <h2 className="text-3xl font-extrabold text-gray-800">
              Add Your Restaurant
            </h2>

            {/* Paragraph */}
            <p className="text-gray-600 leading-relaxed">
              Join our platform to serve your dishes hot and fresh to hungry
              customers nearby 🍽️
            </p>

            {/* CTA Button */}
            <button
              onClick={() => navigate("/createeditshop")}
              className="bg-gradient-to-r from-orange-500 to-pink-500 text-white font-semibold px-8 py-3 rounded-full shadow-md hover:from-orange-600 hover:to-pink-600 hover:scale-105 transition-all duration-300"
            >
              Get Started
            </button>
          </div>
        ) : (
          // 🧩 CASE 2: Shop Exists
          <div className="w-full flex flex-col items-center gap-10 mt-10 animate-fadeIn">
            {/* 🏪 SHOP DETAILS CARD */}
            <div className="bg-white/90 backdrop-blur-lg p-10 rounded-3xl shadow-2xl max-w-lg w-full transition-all duration-500 hover:shadow-orange-200">
              <h1 className="text-3xl font-bold text-orange-500 mb-4">
                Welcome to {shopData.name}
              </h1>

              {shopData.image && (
                <img
                  src={shopData.image}
                  alt={shopData.name}
                  className="w-full h-56 object-cover rounded-2xl mb-5 shadow-md border border-gray-200"
                />
              )}

              <div className="text-left space-y-2 mb-6">
                <p className="text-gray-700 text-lg">
                  <span className="font-semibold text-gray-800">City:</span>{" "}
                  {shopData.city}
                </p>
                <p className="text-gray-700 text-lg">
                  <span className="font-semibold text-gray-800">Address:</span>{" "}
                  {shopData.address}
                </p>
                {shopData.state && (
                  <p className="text-gray-700 text-lg">
                    <span className="font-semibold text-gray-800">State:</span>{" "}
                    {shopData.state}
                  </p>
                )}
              </div>

              {/* Buttons */}
              <div className="flex items-center justify-center gap-4">
                <button
                  onClick={() => navigate("/createeditshop")}
                  className="bg-gradient-to-r from-orange-400 to-pink-500 text-white font-semibold px-6 py-2 rounded-full shadow hover:from-orange-500 hover:to-pink-600 transition-all duration-300"
                >
                  Edit Shop
                </button>

                <button
                  onClick={() => navigate("/additem")}
                  className="border border-orange-400 text-orange-500 font-semibold px-6 py-2 rounded-full hover:bg-orange-50 hover:scale-105 transition-all duration-300"
                >
                  + Add Item
                </button>
              </div>
            </div>

            {/* 🍔 SHOP ITEMS SECTION */}
            <div className="w-full max-w-5xl bg-white/70 backdrop-blur-md p-8 rounded-3xl shadow-lg">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 text-left border-b border-gray-200 pb-2">
                Your Items 🍔
              </h2>

              {/* CASE 1: No Items */}
              {!shopData.items || shopData.items.length === 0 ? (
                <div className="text-gray-600 italic text-center py-6">
                  You haven’t added any items yet.
                  <br />
                  <button
                    onClick={() => navigate("/additem")}
                    className="mt-4 bg-gradient-to-r from-orange-400 to-pink-500 text-white font-semibold px-6 py-2 rounded-full hover:from-orange-500 hover:to-pink-600 hover:scale-105 transition-all duration-300"
                  >
                    + Add Your First Item
                  </button>
                </div>
              ) : (
                // CASE 2: Items Exist
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {shopData.items.map((item, index) => (
                    <Owneritemcard data={item} key={index} />
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </>
  );
}

export default Owner;
