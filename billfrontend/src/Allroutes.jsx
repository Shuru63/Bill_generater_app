import React from 'react'
import Header from './Component/Header'
import BillGeneratedForm from './Component/BillGeneratedForm'
import AllGeneratedBill from './Component/AllGeneratedBill';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
const Allroutes = () => {
    return (
        <div>

<Router>
      <Header /> 
      <Routes>
        <Route path="/" element={<BillGeneratedForm />} />
        <Route path="/all-data" element={<AllGeneratedBill />} />
        
      </Routes>
    </Router>

        </div >
    )
}

export default Allroutes
