import React, { useRef, useState } from 'react'
import Nav from './nav.jsx';
import CategoryCard from './Categorycard.jsx';
import { category } from '../category.js';
import { FaAngleLeft } from "react-icons/fa6";
import { FaChevronRight } from "react-icons/fa"
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import Itemcard from './Itemcard.jsx';
function UserDashboard() {
   

  const scroll= useRef();
  const[showleftbutton,setshowleftbutton]=useState(false)
  const[showrightbutton,setshowrightbutton]=useState(false)
  const shopscroll= useRef();
  const[showleftshopbutton,setshowleftshopbutton]=useState(false)
  const[showrightshopbutton,setshowrightshopbutton]=useState(false)
  const{ city,shopinmycity,iteminmycity }= useSelector(state=>state.user)
  

  const showbutton = (ref,leftbutton,rightbutton)=>{
    const element = ref.current;
  if(element){
    leftbutton(element.scrollLeft>0)
    rightbutton(element.scrollLeft+element.clientWidth<element.scrollWidth)
  }}
  
  const handlescroll = (ref,direction)=>{
    if(ref.current){
      ref.current.scrollBy({
        left:direction=="left"?-120:120,
        behavior:"smooth"
      })
    }
  }

  useEffect(() => {
  const el = scroll.current;
  const ele = shopscroll.current;

  if (el) {
    const update = () => showbutton(scroll, setshowleftbutton, setshowrightbutton);
    update(); 
    el.addEventListener("scroll", update);

    var cleanup1 = () => el.removeEventListener("scroll", update);
  }

  if (ele) {
    const shopupdate = () =>
      showbutton(shopscroll, setshowleftshopbutton, setshowrightshopbutton);
    shopupdate(); 
    ele.addEventListener("scroll", shopupdate);

    var cleanup2 = () => ele.removeEventListener("scroll", shopupdate);
  }

  return () => {
    if (cleanup1) cleanup1();
    if (cleanup2) cleanup2();
  };
}, []);


  return( <>
      <Nav />
     {/* types of food or category */}
      <div className="w-full max-w-6xl flex flex-col gap-5 items-start p-4 mx-auto">
        {/* Header */}
        <h1 className="text-2xl font-bold text-gray-800 mt-2">
          For Your First Order
        </h1>

        <div className="relative w-full flex items-center">
          {/* Left Scroll Button */}
          {showleftbutton && (
            <button
              onClick={() => handlescroll(scroll, "left")}
              className="absolute left-0 z-10 bg-white/90 shadow-md hover:bg-orange-100 text-orange-500 rounded-full p-2 transition-all duration-300"
            >
              <FaAngleLeft className="text-xl" />
            </button>
          )}

          {/* Scrollable Category List */}
          <div
            className="flex overflow-x-auto scrollbar-hidden gap-4 pb-3 px-10 scroll-smooth "
            ref={scroll}
          >
            {category.map((cate, index) => (
              <CategoryCard name={cate.category} image={cate.image} key={index} />
            ))}
          </div>

          {/* Right Scroll Button */}
          {showrightbutton && (
            <button
              onClick={() => handlescroll(scroll, "right")}
              className="absolute right-0 z-10 bg-white/90 shadow-md hover:bg-orange-100 text-orange-500 rounded-full p-2 transition-all duration-300"
            >
              <FaChevronRight className="text-xl" />
            </button>
          )}
        </div>
    </div>  

    {/* nearbyshop */}
      <div className="w-full max-w-6xl flex flex-col gap-5 items-start p-4 mx-auto">
        {/* Header */}
        <h1 className="text-2xl font-bold text-gray-800 mt-2">
          Best shop in {city}
        </h1>
              <div className="relative w-full flex items-center">
          {/* Left Scroll Button */}
          {showleftshopbutton && (
            <button
              onClick={() => handlescroll(shopscroll, "left")}
              className="absolute left-0 z-10 bg-white/90 shadow-md hover:bg-orange-100 text-orange-500 rounded-full p-2 transition-all duration-300"
            >
              <FaAngleLeft className="text-xl" />
            </button>
          )}

          {/* Scrollable Category List */}
          <div
            className="flex overflow-x-auto scrollbar-hidden gap-4 pb-3 px-10 scroll-smooth"
            ref={shopscroll}
          >
            {shopinmycity?.map((shop, index) => (
              <CategoryCard name={shop.name} image={shop.image} key={index} />
            ))}
          </div>

          {/* Right Scroll Button */}
          {showrightshopbutton && (
            <button
              onClick={() => handlescroll(shopscroll, "right")}
              className="absolute right-0 z-10 bg-white/90 shadow-md hover:bg-orange-100 text-orange-500 rounded-full p-2 transition-all duration-300"
            >
              <FaChevronRight className="text-xl" />
            </button>
          )}
        </div>
        
    </div>  
      
      {/* items */}

      <div className='w-full max-w-6xl flex flex-col gap-5 items-start p-4 mx-auto'>
          <h1 className="text-2xl font-bold text-gray-800 mt-2">
         Food Items 
        </h1>

              <div className="relative w-full flex items-center">
          {/* Left Scroll Button */}
          {showleftshopbutton && (
            <button
              onClick={() => handlescroll(shopscroll, "left")}
              className="absolute left-0 z-10 bg-white/90 shadow-md hover:bg-orange-100 text-orange-500 rounded-full p-2 transition-all duration-300"
            >
              <FaAngleLeft className="text-xl" />
            </button>
          )}

          {/* Scrollable Category List */}
          <div
            className="flex overflow-x-auto scrollbar-hidden gap-4 pb-3 px-10 scroll-smooth"
            ref={shopscroll}
          >
            {iteminmycity?.map((data, index) => (
              <Itemcard data={data} key={index} />
            ))}
          </div>

          {/* Right Scroll Button */}
          {showrightshopbutton && (
            <button
              onClick={() => handlescroll(shopscroll, "right")}
              className="absolute right-0 z-10 bg-white/90 shadow-md hover:bg-orange-100 text-orange-500 rounded-full p-2 transition-all duration-300"
            >
              <FaChevronRight className="text-xl" />
            </button>
          )}
        </div>
      </div>

    </>
  )
}

export default UserDashboard;
