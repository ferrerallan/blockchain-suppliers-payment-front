import React, { useState, useEffect } from 'react';
import { payInvoice, web3, doLogin, getInvoice } from '../services/Web3Service';
import './Form.css'; // Import the CSS file

const PayInvoice = () => {
  const [invoiceId, setInvoiceId] = useState('');
  const [invoiceAmount, setInvoiceAmount] = useState('');
  const [inputAmount, setInputAmount] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchInvoiceDetails = async () => {
      if (invoiceId) {
        try {
          const invoice = await getInvoice(invoiceId);
          console.log(invoice);
          setInvoiceAmount(invoice.amount); // Ajuste aqui
        } catch (error) {
          console.error('Error fetching invoice details:', error);
          setInvoiceAmount('');
        }
      }
    };

    fetchInvoiceDetails();
  }, [invoiceId]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');
    setLoading(true);

    try {
      const account = await doLogin();
      console.log(`Account: ${account}`);
      console.log(`Paying Invoice ID: ${invoiceId} with amount: ${inputAmount}`);
      await payInvoice(invoiceId, inputAmount, account);
      setSuccessMessage('Invoice paid successfully!');
    } catch (error) {
      console.error('Error paying invoice:', error);
      setErrorMessage('Failed to pay invoice: ' + error.message);
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="form">
      <div className="form-group">
        <label>Invoice ID</label>
        <input
          value={invoiceId}
          onChange={(e) => setInvoiceId(e.target.value)}
          className="form-control"
        />
      </div>
      {invoiceAmount && (
        <div className="form-group">
          <label>Invoice Amount (ETH): {invoiceAmount}</label>
        </div>
      )}
      <div className="form-group">
        <label>Amount (ETH)</label>
        <input
          value={inputAmount}
          onChange={(e) => setInputAmount(e.target.value)}
          className="form-control"
        />
      </div>
      <button type="submit" className="btn" disabled={loading}>
        {loading ? 'Paying...' : 'Pay Invoice'}
      </button>
      {errorMessage && <p className="error-message">{errorMessage}</p>}
      {successMessage && <p className="success-message">{successMessage}</p>}
    </form>
  );
};

export default PayInvoice;
