import React, { useState, useEffect } from 'react';
import { doLogin, createInvoice } from '../services/Web3Service';
import './Form.css'; // Import the CSS file

const CreateInvoice = () => {
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [account, setAccount] = useState('');

  useEffect(() => {
    const connectWallet = async () => {
      try {
        const account = await doLogin();
        setAccount(account);
      } catch (error) {
        setErrorMessage('Error connecting to MetaMask: ' + error.message);
      }
    };

    connectWallet();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSuccessMessage('');
    setErrorMessage('');

    if (!account) {
      setErrorMessage('No account found. Please connect to MetaMask.');
      return;
    }

    const timestamp = new Date(dueDate).getTime() / 1000;

    try {
      await createInvoice(description, amount, timestamp);
      setSuccessMessage('Invoice created successfully!');
    } catch (error) {
      console.error('Error creating invoice:', error);
      setErrorMessage('Failed to create invoice: ' + error.message);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="form">
      <div className="form-group">
        <label>Description</label>
        <input
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="form-control"
        />
      </div>
      <div className="form-group">
        <label>Amount (ETH)</label>
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="form-control"
        />
      </div>
      <div className="form-group">
        <label>Due Date</label>
        <input
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          className="form-control"
        />
      </div>
      <button type="submit" className="btn">Create Invoice</button>
      {successMessage && <p className="success-message">{successMessage}</p>}
      {errorMessage && <p className="error-message">{errorMessage}</p>}
    </form>
  );
};

export default CreateInvoice;
