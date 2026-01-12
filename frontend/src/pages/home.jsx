import React from 'react'
import { useSelector } from 'react-redux';
import UserDashboard from '../components/UserDashboard';
import Owner from '../components/Owner';
import Deliveryboy from '../components/Deliveryboy';
function Home() {

  const{userData}=useSelector((state)=>state.user);
  return (
    <div>
      {userData.role==='user'&& <UserDashboard/>}
      {userData.role==='Owner'&& <Owner/>}
      {userData.role==='deliveryboy'&& <Deliveryboy/>}
    </div>
  )
}

export default Home
