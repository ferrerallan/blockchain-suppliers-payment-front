import React, { useState } from 'react';
import CreateInvoice from './components/CreateInvoice';
import PayInvoice from './components/PayInvoice';
import WithdrawFunds from './components/WithdrawFunds';
import PendingInvoices from './components/PendingInvoices';
import AllInvoices from './components/AllInvoices';
import './App.css'; // Import the CSS file

const App = () => {
  const [activeComponent, setActiveComponent] = useState('createInvoice');

  const renderComponent = () => {
    switch (activeComponent) {
      case 'createInvoice':
        return <CreateInvoice />;
      case 'payInvoice':
        return <PayInvoice />;
      case 'withdrawFunds':
        return <WithdrawFunds />;
      case 'pendingInvoices':
        return <PendingInvoices />;
      case 'allInvoices':
        return <AllInvoices />;
      default:
        return <CreateInvoice />;
    }
  };

  return (
    <div className="app-container">
      <h1 className="app-title">DApp: Suppliers Payments</h1>
      <div className="menu">
        <button onClick={() => setActiveComponent('createInvoice')} className="menu-item">Create Invoice</button>
        <button onClick={() => setActiveComponent('payInvoice')} className="menu-item">Pay Invoice</button>
        <button onClick={() => setActiveComponent('withdrawFunds')} className="menu-item">Withdraw Funds</button>
        <button onClick={() => setActiveComponent('pendingInvoices')} className="menu-item">Pending Invoices</button>
        <button onClick={() => setActiveComponent('allInvoices')} className="menu-item">All Invoices</button>
      </div>
      <div className="app-section">
        {renderComponent()}
      </div>
    </div>
  );
};

export default App;
