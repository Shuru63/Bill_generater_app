import axios from 'axios';
import React, { useState } from 'react';
import { CModal, CModalBody, CModalFooter, CModalHeader, CModalTitle, CButton } from '@coreui/react';
import '@coreui/coreui/dist/css/coreui.min.css';
import Loader from '../Loader';

const BillGeneratedForm = () => {
  const [visible, setVisible] = useState(false);
  const [message, setMessage] = useState('');
  const [messageColor, setMessageColor] = useState('green');
  const [loading, setLoading] = useState(false);
  const [formState, setFormState] = useState({
    sellerName: '',
    sellerAddress: '',
    sellerCity: '',
    sellerState: '',
    sellerPincode: '',
    sellerPAN: '',
    sellerGST: '',
    shippingName: '',
    shippingAddress: '',
    shippingCity: '',
    shippingState: '',
    shippingPincode: '',
    reverseCharge: false,
    items: [{ description: '', unitPrice: '', quantity: '', discount: '', taxRate: '', taxType: 'cgst' }],
    signature: ''
  });
  const handleError = (e) => {
    setVisible(true);
    setMessage(e);
    setMessageColor('red');
  };
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (type === 'checkbox') {
      setFormState(prevState => ({
        ...prevState,
        [name]: checked
      }));
    } else if (name.startsWith('items')) {
      const [_, index, field] = name.split('-');
      const newItems = [...formState.items];
      newItems[index][field] = value;
      setFormState(prevState => ({
        ...prevState,
        items: newItems
      }));
    } else {
      setFormState(prevState => ({
        ...prevState,
        [name]: value
      }));
    }
  };
  const validateInvoiceData = (data) => {
    
    // Validate seller details
    if (!data.sellerName) {
      handleError('Seller name is required') ;
    } else if (!data.sellerAddress) {
      handleError( 'Seller address is required');
    } else if (!data.sellerCity) {
      handleError( 'Seller city is required');
    } else if (!data.sellerState) {
      handleError( 'Seller state is required');
    } else if (!data.sellerPincode) {
       handleError('Seller pincode is required');
    } else if (!data.sellerPAN ) {
       handleError('Seller PAN must be at least 10 characters');
    } else if (!data.sellerGST ) {
       handleError('Seller GST must be at least 15 characters');
    }
 
    // Validate shipping details
    if (data.shippingName) {
      if (!data.shippingAddress) {
        handleError('Shipping address is required if shipping name is provided');
      } else if (!data.shippingCity) {
        handleError( 'Shipping city is required if shipping address is provided');
      } else if (!data.shippingState) {
        handleError('Shipping state is required if shipping city is provided');
      } else if (!data.shippingPincode) {
        handleError( 'Shipping pincode is required if shipping state is provided');
      }
    }
  
    // Validate items
    if (!data.items || data.items.length === 0) {
       handleError('At least one item is required');
    } else {
      data.items.forEach((item, index) => {
        if (!item.description) {
          handleError( 'Item description is required');
        }
        if (isNaN(item.unitPrice) || item.unitPrice <= 0) {
          handleError('Item unit price must be a positive number');
        }
        if (isNaN(item.quantity) || item.quantity <= 0) {
          handleError( 'Item quantity must be a positive number');
        }
      });
    }
  

  };
  

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    // Validate form data
  validateInvoiceData(formState);

      // Prepare the request payload
      const payload = {
        sellerDetails: {
          name: formState.sellerName,
          address: formState.sellerAddress,
          city: formState.sellerCity,
          state: formState.sellerState,
          pincode: formState.sellerPincode,
          panNo: formState.sellerPAN,
          gstNo: formState.sellerGST
        },
        placeOfSupply: formState.sellerState,
        billingDetails: {
          name: formState.sellerName,
          address: formState.sellerAddress,
          city: formState.sellerCity,
          state: formState.sellerState,
          pincode: formState.sellerPincode,
        },
        shippingDetails: {
          name: formState.shippingName,
          address: formState.shippingAddress,
          city: formState.shippingCity,
          state: formState.shippingState,
          pincode: formState.shippingPincode
        },
        placeOfDelivery: formState.shippingState,
        reverseCharge: formState.reverseCharge,
        items: formState.items.map(item => ({
          description: item.description,
          unitPrice: parseFloat(item.unitPrice),
          quantity: parseInt(item.quantity, 10),
          discount: parseFloat(item.discount),
          taxRate: parseFloat(item.taxRate)
        })),
        signature: formState.signature
      };
      setLoading(true);
      try {
       
        const response = await axios.post('http://127.0.0.1:8000/api/generate-bill/', payload, {
          headers: {
            'Content-Type': 'application/json',
          },
          responseType: 'blob',
        });
  
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'invoice.pdf'); // File name
        document.body.appendChild(link);
        link.click();
        link.remove();
  
        setLoading(false); 
        setMessage(response.message);
        setMessageColor('green');
        setVisible(true);
        console.log('Response from server:', response.data);
        
  
      } catch (error) {
        if (error.response) {
          console.log('Error response from server:', error.response.data)
          handleError('Error response from server:', error.response.data);
       
        } else if (error.request) {
          console.log('Error response from server:', error.response.data)
          handleError('Network error:', error.request);
         
        } else {
          console.log('Error response from server:', error.response.data)
          handleError('Error setting up request:', error.message);
         
        }
      }
   
  };
  

  const handleAddItem = () => {
    setFormState(prevState => ({
      ...prevState,
      items: [...prevState.items, { description: '', unitPrice: '', quantity: '', discount: '', taxRate: '', taxType: 'cgst' }]
    }));
  };

  const handleRemoveItem = (index) => {
    setFormState(prevState => ({
      ...prevState,
      items: prevState.items.filter((_, i) => i !== index)
    }));
  };

  return (
    <div>
          <CModal
        visible={visible}
        onClose={() => setVisible(false)}
        aria-labelledby="LiveDemoExampleLabel"
      >
        <CModalHeader onClose={() => setVisible(false)}>
          <CModalTitle id="LiveDemoExampleLabel">Alert</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <p style={{ color: messageColor }}>{message}</p>
          
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setVisible(false)}>
            Close
          </CButton>
        </CModalFooter>
      </CModal>
      {loading && <div className="loading-overlay"><Loader/></div>}
      <div className='bill-generater'>
        <div className='bill-generater-cover'>
          <div className="bill-container">
            <div className='heading'>
              <h1>Invoice Generate</h1>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="bill-row">
                <h2>Items Details</h2>
                {formState.items.map((item, index) => (
                  <div className="bill-row" key={index}>
                    <div className="input-group">
                      <input 
                        type="text" 
                        name={`items-${index}-description`}
                        value={item.description}
                        onChange={handleChange}
                        placeholder="Item Description" 
                      />
                    </div>
                    <div className="input-group">
                      <input 
                        type="number" 
                        name={`items-${index}-unitPrice`}
                        value={item.unitPrice}
                        onChange={handleChange}
                        placeholder="Unit Price" 
                      />
                    </div>
                    <div className="input-group">
                      <input 
                        type="number" 
                        name={`items-${index}-quantity`}
                        value={item.quantity}
                        onChange={handleChange}
                        placeholder="Quantity" 
                      />
                    </div>
                    <div className="input-group">
                      <input 
                        type="number" 
                        name={`items-${index}-discount`}
                        value={item.discount}
                        onChange={handleChange}
                        placeholder="Discount" 
                      />
                    </div>
                    <div className="input-group">
                      <input 
                        type="number" 
                        name={`items-${index}-taxRate`}
                        value={item.taxRate}
                        onChange={handleChange}
                        placeholder="Tax Rate" 
                      />
                    </div>
                    <div className="input-group-option">
                      <select 
                        name={`items-${index}-taxType`}
                        value={item.taxType}
                        onChange={handleChange}
                      >
                        <option value="cgst">CGST</option>
                        <option value="sgst">SGST</option>
                      </select>
                      <div className='button-item'>
                    <button className='button-item-Remove' type="button" onClick={() => handleRemoveItem(index)}>Remove Item</button>
                  </div>
                    </div>
                    
                  </div>
                ))}
                <div className='button-item'>
                <button className='button-item-Add' type="button" onClick={handleAddItem}>Add Item</button></div>
              </div>

              <div className="bill-row">
                <h2>Seller Details</h2>
                <div className="input-group input-group-icon">
                  <input 
                    type="text" 
                    name="sellerName"
                    value={formState.sellerName}
                    onChange={handleChange}
                    placeholder="Name" 
                  />
                  <div className="input-icon">
                    <i className="fa fa-user" />
                  </div>
                </div>
                <div className="input-group">
                  <input 
                    type="text" 
                    name="sellerAddress"
                    value={formState.sellerAddress}
                    onChange={handleChange}
                    placeholder="Address" 
                  />
                </div>
                <div className="input-group">
                  <input 
                    type="text" 
                    name="sellerCity"
                    value={formState.sellerCity}
                    onChange={handleChange}
                    placeholder="City" 
                  />
                </div>
                <div className="input-group">
                  <input 
                    type="text" 
                    name="sellerState"
                    value={formState.sellerState}
                    onChange={handleChange}
                    placeholder="State" 
                  />
                </div>
                <div className="input-group">
                  <input 
                    type="text" 
                    name="sellerPincode"
                    value={formState.sellerPincode}
                    onChange={handleChange}
                    placeholder="Pincode" 
                  />
                </div>
                <div className="input-group">
                  <input 
                    type="text" 
                    name="sellerPAN"
                    value={formState.sellerPAN}
                    onChange={handleChange}
                    placeholder="PAN No" 
                  />
                </div>
                <div className="input-group">
                  <input 
                    type="text" 
                    name="sellerGST"
                    value={formState.sellerGST}
                    onChange={handleChange}
                    placeholder="GST No" 
                  />
                </div>
                
              </div>
              <div className="bill-row">
                <h2>Shipping Details</h2>
                <div className="input-group">
                  <input 
                    type="text" 
                    name="shippingName"
                    value={formState.shippingName}
                    onChange={handleChange}
                    placeholder="Shipping Name" 
                  />
                </div>
                <div className="input-group">
                  <input 
                    type="text" 
                    name="shippingAddress"
                    value={formState.shippingAddress}
                    onChange={handleChange}
                    placeholder="Shipping Address" 
                  />
                </div>
                <div className="input-group">
                  <input 
                    type="text" 
                    name="shippingCity"
                    value={formState.shippingCity}
                    onChange={handleChange}
                    placeholder="Shipping City" 
                  />
                </div>
                <div className="input-group">
                  <input 
                    type="text" 
                    name="shippingState"
                    value={formState.shippingState}
                    onChange={handleChange}
                    placeholder="Shipping State" 
                  />
                </div>
                <div className="input-group">
                  <input 
                    type="text" 
                    name="shippingPincode"
                    value={formState.shippingPincode}
                    onChange={handleChange}
                    placeholder="Shipping Pincode" 
                  />
                </div>
              </div>

              <div className="bill-row">
                <h2>Other Details</h2>
                <div className="input-group">
                  <input 
                    type="text" 
                    name="signature"
                    value={formState.signature}
                    onChange={handleChange}
                    placeholder="Authorized Signature" 
                  />
                </div>
                <div className="input-group">
                  <label>
                    <input 
                      type="checkbox" 
                      name="reverseCharge"
                      checked={formState.reverseCharge}
                      onChange={handleChange}
                    />
                  </label>
                </div>
              </div>

              <div className='submit-btn'>
                <button type="submit">Download</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BillGeneratedForm;
