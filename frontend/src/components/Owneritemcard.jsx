import React from 'react'
import { useNavigate } from 'react-router-dom'
import { serverurl } from '../App';
import { useDispatch } from 'react-redux';
import { setshopData } from '../redux/ownerslice';
import axios from 'axios';


function Owneritemcard({data}) {
  const navigate=useNavigate();
  const dispatch = useDispatch();
   


  const handledeletekey= async ()=>{
      
      const card = await axios.get(`${serverurl}/api/item/deleteitem/${data._id}`,{withCredentials:true})
       
     dispatch(setshopData(card.data))
     const shopRes = await axios.get(`${serverurl}/api/shop/getmyshop`, { withCredentials: true });
dispatch(setshopData(shopRes.data));

  }
  return (
    <div
      key={data._id}
      className="bg-white border border-gray-200 rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 p-4 text-left"
    >
      <img
        src={data.image}
        alt={data.name}
        className="w-full h-40 object-cover rounded-lg mb-3"
      />
      <h3 className="text-lg font-semibold text-gray-800">
        {data.name}
      </h3>
      <p className="text-gray-600 text-sm">
        {data.category} • {data.foodtype}
      </p>
      <p className="text-orange-500 font-semibold text-lg">
        ₹{data.price}
      </p>
      <div className="flex justify-between mt-3">
        <button
          onClick={() => navigate(`/edititem/${data._id}`)}
          className="text-sm bg-blue-500 text-white px-3 py-1 rounded-lg hover:bg-blue-600"
        >
          Edit
        </button>
        <button
          onClick={handledeletekey}
          className="text-sm bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-600"
        >
          Delete
        </button>
      </div>
    </div>
  )
}

export default Owneritemcard
