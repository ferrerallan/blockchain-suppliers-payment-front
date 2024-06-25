import React, { useState } from 'react';
import { getPendingInvoices, getInvoice } from '../services/Web3Service';
import './PendingInvoices.css'; // Import the CSS file

const PendingInvoices = () => {
  const [supplier, setSupplier] = useState('');
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleCheckInvoices = async () => {
    setLoading(true);
    setErrorMessage('');
    try {
      const pendingInvoiceIds = await getPendingInvoices(supplier);
      const pendingInvoices = await Promise.all(pendingInvoiceIds.map(async (invoiceId) => {
        return await getInvoice(invoiceId);
      }));
      setInvoices(pendingInvoices);
    } catch (error) {
      console.error('Error fetching invoices:', error);
      setErrorMessage('Failed to fetch pending invoices.');
      setInvoices([]);
    }
    setLoading(false);
  };

  return (
    <div className="container">
      <div className="form-group">
        <label>Supplier Address</label>
        <select
          value={supplier}
          onChange={(e) => setSupplier(e.target.value)}
          className="form-control"
        >
          <option value="">Select Supplier</option>
          <option value="0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266">0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266</option>
          <option value="0x70997970C51812dc3A010C7d01b50e0d17dc79C8">0x70997970C51812dc3A010C7d01b50e0d17dc79C8</option>
          <option value="0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC">0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC</option>
          <option value="0x912643AbC9C91Fea9E1Fdf9CB7ED3763885BFAbE">0x912643AbC9C91Fea9E1Fdf9CB7ED3763885BFAbE</option>
          
        </select>
      </div>
      <button onClick={handleCheckInvoices} disabled={loading} className="btn">
        {loading ? 'Loading...' : 'Check Pending Invoices'}
      </button>
      {errorMessage && <p className="error-message">{errorMessage}</p>}
      <div className="invoices-table">
        {invoices.length > 0 ? (
          <table>
            <thead>
              <tr>
                <th>Invoice ID</th>
                <th>Description</th>
                <th>Amount (ETH)</th>
                <th>Due Date</th>
                <th>Supplier</th>
                <th>Is Paid</th>
              </tr>
            </thead>
            <tbody>
              {invoices.map((invoice, index) => (
                <tr key={index}>
                  <td>{invoice.invoiceId}</td>
                  <td>{invoice.description}</td>
                  <td>{invoice.amount}</td>
                  <td>{invoice.dueDate}</td>
                  <td>{invoice.supplier}</td>
                  <td>{invoice.isPaid ? 'Yes' : 'No'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No pending invoices found.</p>
        )}
      </div>
    </div>
  );
};

export default PendingInvoices;
