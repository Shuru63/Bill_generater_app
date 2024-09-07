import React from 'react'
import axios from 'axios'
import { useState, useEffect } from 'react'
import { CModal, CModalBody, CModalFooter, CModalHeader, CModalTitle, CButton } from '@coreui/react';
const AllGeneratedBill = () => {
    const [userData, setUserData] = useState()
    const [visible, setVisible] = useState(false);
    const [selectUserData, setselectUserData] = useState();
    const fetchUserData = () => {
        try {
            axios.get('http://127.0.0.1:8000/api/getuser-bill/')

                .then((response) => {
                    setUserData(response.data.getdata)


                })
                .catch((error) => {
                    console.log(error);
                });
        } catch (error) {
            console.log(error, "data is not fetch")
        }
    }
    const clickData = (userid) => {
        try {
            axios.get(`http://127.0.0.1:8000/api//getSingleuser-bill/${userid}`)

                .then((response) => {

                    setselectUserData(response.data.getSingledata)


                })
                .catch((error) => {
                    console.log(error);
                });
        } catch (error) {
            console.log(error, "data is not fetch")
        }
    }
    const getData = (userid) => {

        clickData(userid)
        setVisible(true)

    }


    useEffect(() => {
        fetchUserData()


    }, [])


    return (
        <div>
            <CModal
                size="lg"
                visible={visible}
                onClose={() => setVisible(false)}
                aria-labelledby="LiveDemoExampleLabel"
                alignment='center'

            >
                <CModalHeader onClose={() => setVisible(false)}>
                    <CModalTitle id="LiveDemoExampleLabel">All Data</CModalTitle>
                </CModalHeader>
                <CModalBody>
                    {selectUserData ? (
                        <div className='modal-content'>
                            <div className='detaik-div'>
                                <div >
                                    <h5>Seller Details</h5>
                                    <p><strong>Name:</strong> {selectUserData.sellerDetails.name}</p>
                                    <p><strong>Address:</strong> {selectUserData.sellerDetails.address}</p>
                                    <p><strong>City:</strong> {selectUserData.sellerDetails.city}</p>
                                    <p><strong>State:</strong> {selectUserData.sellerDetails.state}</p>
                                    <p><strong>Pincode:</strong> {selectUserData.sellerDetails.pincode}</p>
                                    <p><strong>PAN No:</strong> {selectUserData.sellerDetails.panNo}</p>
                                    <p><strong>GST No:</strong> {selectUserData.sellerDetails.gstNo}</p>

                                </div>
                                <div>
                                    <h5>Shipping Details</h5>
                                    <p><strong>Name:</strong> {selectUserData.shippingDetails.name}</p>
                                    <p><strong>Address:</strong> {selectUserData.shippingDetails.address}</p>
                                    <p><strong>City:</strong> {selectUserData.shippingDetails.city}</p>
                                    <p><strong>State:</strong> {selectUserData.shippingDetails.state}</p>
                                    <p><strong>Pincode:</strong> {selectUserData.shippingDetails.pincode}</p>
                                </div>
                                <div >
                                    <h5>Billing Details</h5>
                                    <p><strong>Name:</strong> {selectUserData.billingDetails.name}</p>
                                    <p><strong>Address:</strong> {selectUserData.billingDetails.address}</p>
                                    <p><strong>City:</strong> {selectUserData.billingDetails.city}</p>
                                    <p><strong>State:</strong> {selectUserData.billingDetails.state}</p>
                                    <p><strong>Pincode:</strong> {selectUserData.billingDetails.pincode}</p>
                                </div>
                            </div>


<hr/>
                            <div className='detaik-div'>
                                <div >
                                    <h5>Order Details</h5>
                                    <p><strong>Order Date:</strong> {new Date(selectUserData.orderDetails.orderDate).toLocaleString()}</p>
                                    <p><strong>Order ID:</strong> {selectUserData.orderDetails.orderId}</p>
                                </div>
                                <div >

                                    <h5>Invoice Details</h5>
                                    <p><strong>Invoice Date:</strong> {new Date(selectUserData.invoiceDetails.invoiceDate).toLocaleString()}</p>
                                    <p><strong>Invoice Number:</strong> {selectUserData.invoiceDetails.invoiceNumber}</p>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <p>Loading...</p>
                    )}

                </CModalBody>
                <CModalFooter>
                    <CButton color="secondary" onClick={() => setVisible(false)}>
                        Close
                    </CButton>
                </CModalFooter>
            </CModal>
            <div className='all-data'>
                <div className='data-heading'>All Generated bill data</div>
                <div className='all-data-cover'>
                    <div className='name-user'>

                        <div className='Active-user' >
                            {userData && userData.map((invoice, index) => (
                                <div className="active-user-cover" onClick={() => getData(invoice._id)}>
                                    <ul>
                                        <li key={index}>
                                            <p><strong>Name:</strong> {invoice.shippingDetails.name}</p>
                                            <p><strong>Address:</strong> {invoice.shippingDetails.address}</p>
                                            <p><strong>City:</strong> {invoice.shippingDetails.city}</p>
                                            <p><strong>State:</strong> {invoice.shippingDetails.state}</p>
                                            <p><strong>Pincode:</strong> {invoice.shippingDetails.pincode}</p>
                                        </li>

                                    </ul>
                                </div>))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AllGeneratedBill
