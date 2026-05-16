import React from 'react'
import { useNavigate } from 'react-router-dom'
import { serverurl } from '../App';
import { useDispatch } from 'react-redux';
import { setshopData } from '../redux/ownerslice';
import axios from 'axios';
import { MdEdit, MdDeleteOutline } from 'react-icons/md';

function Owneritemcard({ data }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handledeletekey = async () => {
    await axios.get(`${serverurl}/api/item/deleteitem/${data._id}`, { withCredentials: true });
    const shopRes = await axios.get(`${serverurl}/api/shop/getmyshop`, { withCredentials: true });
    dispatch(setshopData(shopRes.data));
  };

  return (
    <div
      className="rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-0.5"
      style={{ background: "#1a1a1a", border: "1px solid #2a2a2a" }}
    >
      <img
        src={data.image}
        alt={data.name}
        className="w-full object-cover"
        style={{ height: "160px" }}
      />
      <div className="p-4">
        <h3 style={{ color: "#fff", fontWeight: 700, fontSize: "15px", marginBottom: "4px" }}>
          {data.name}
        </h3>
        <p style={{ color: "#9ca3af", fontSize: "12px", marginBottom: "4px" }}>
          {data.category} · {data.foodtype}
        </p>
        <p style={{ color: "#f97316", fontWeight: 800, fontSize: "16px", marginBottom: "14px" }}>
          ₹{data.price}
        </p>

        <div className="flex gap-2">
          <button
            onClick={() => navigate(`/edititem/${data._id}`)}
            className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-sm font-semibold transition-all duration-200 hover:opacity-90"
            style={{ background: "rgba(99,102,241,0.15)", border: "1px solid rgba(99,102,241,0.3)", color: "#818cf8" }}
          >
            <MdEdit size={15} />
            Edit
          </button>
          <button
            onClick={handledeletekey}
            className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-sm font-semibold transition-all duration-200 hover:opacity-90"
            style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.2)", color: "#ef4444" }}
          >
            <MdDeleteOutline size={16} />
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

export default Owneritemcard;
