import React, { useState, useEffect } from 'react';
import { doLogin, getContract } from '../services/Web3Service'; // Certifique-se de importar corretamente
import './Form.css'; // Import the CSS file

const WithdrawFunds = () => {
  const [account, setAccount] = useState('');
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

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

  const handleWithdraw = async () => {
    setErrorMessage('');
    setSuccessMessage('');
    setLoading(true);
    
    try {
      const contract = getContract();
      await contract.methods.withdrawFunds().send({ from: account });
      setSuccessMessage('Funds withdrawn successfully!');
    } catch (error) {
      console.error('Error withdrawing funds:', error);
      setErrorMessage('Failed to withdraw funds: ' + error.message);
    }
    
    setLoading(false);
  };

  return (
    <div>
      <button onClick={handleWithdraw} className="btn" disabled={loading}>
        {loading ? 'Withdrawing...' : 'Withdraw Funds'}
      </button>
      {successMessage && <p className="success-message">{successMessage}</p>}
      {errorMessage && <p className="error-message">{errorMessage}</p>}
    </div>
  );
};

export default WithdrawFunds;
