import React, { useState, useEffect } from 'react';
import { getAllPendingInvoices, getInvoice } from '../services/Web3Service';
import './PendingInvoices.css'; // Import the CSS file

const AllInvoices = () => {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchInvoices = async () => {
      setLoading(true);
      try {
        const pendingInvoiceIds = await getAllPendingInvoices();
        const allInvoices = await Promise.all(pendingInvoiceIds.map(async (invoiceId) => {
          return await getInvoice(invoiceId);
        }));

        setInvoices(allInvoices);
      } catch (error) {
        console.error('Error fetching invoices:', error);
        setInvoices([]);
      }
      setLoading(false);
    };

    fetchInvoices();
  }, []);

  return (
    <div className="container">
      <div className="invoices-table">
        {loading ? (
          <p>Loading...</p>
        ) : invoices.length > 0 ? (
          <table>
            <thead>
              <tr>
                <th>Invoice ID</th>
                <th>Description</th>
                <th>Amount (ETH)</th>
                <th>Due Date</th>
                <th>Supplier</th>
                <th>Client</th> {/* Adicionando a coluna Client */}
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
                  <td>0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266'</td> {/* Exibindo o Client */}
                  <td>{invoice.isPaid ? 'Yes' : 'No'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No invoices found.</p>
        )}
      </div>
    </div>
  );
};

export default AllInvoices;
