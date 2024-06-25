import Web3 from 'web3';
import BN from 'bn.js';
import ABI from './ABI.json';

const CONTRACT_ADDRESS = '0x5FbDB2315678afecb367f032d93F642f64180aa3';

// Create a new Web3 instance
export const web3 = new Web3(window.ethereum);

// Function to get the contract instance using Web3.js and ABI.
export function getContract() {
  // Check if MetaMask is installed
  if (!window.ethereum) throw new Error('No MetaMask installed!');

  // Get the wallet address from local storage
  const from = localStorage.getItem('wallet');

  // Return a new contract instance using the ABI and contract address
  // The 'from' option is set to the wallet address
  return new web3.eth.Contract(ABI, CONTRACT_ADDRESS, { from });
}

export async function doLogin() {
  if (!window.ethereum) throw new Error('Sem MetaMask instalada!');

  const accounts = await web3.eth.requestAccounts();
  if (!accounts || !accounts.length) throw new Error('Carteira não permitida!');

  localStorage.setItem('wallet', accounts[0].toLowerCase());
  return accounts[0];
}

/**
 * Function to create an invoice on the blockchain contract.
 *
 * @param {string} description - Description of the invoice.
 * @param {string} amount - Amount for the invoice in ETH.
 * @param {number} dueDate - Due date of the invoice in Unix timestamp.
 * @returns {Promise<Receipt>} A promise that resolves to the transaction receipt.
 * @throws Will throw an error if the contract call fails.
 */
export async function createInvoice(description, amount, dueDate) {
  const contract = getContract();
  const weiAmount = Web3.utils.toWei(amount, 'ether');
  return contract.methods.createInvoice(description, weiAmount, dueDate).send();
}

/**
 * Function to get the pending invoices for a supplier.
 *
 * @param {string} supplier - Supplier address.
 * @returns {Promise<Array>} A promise that resolves to an array of pending invoice IDs.
 * @throws Will throw an error if the contract call fails.
 */
export async function getPendingInvoices(supplier) {
  const contract = getContract();
  return contract.methods.getPendingInvoices(supplier).call();
}

/**
 * Function to get the details of an invoice.
 *
 * @param {number} invoiceId - ID of the invoice.
 * @returns {Promise<Object>} A promise that resolves to the invoice details.
 * @throws Will throw an error if the contract call fails.
 */
export async function getInvoice(invoiceId) {
  const contract = getContract();
  const invoice = await contract.methods.invoices(invoiceId).call();
  return {
    invoiceId: invoiceId.toString(),
    description: invoice.description,
    amount: Web3.utils.fromWei(invoice.amount, 'ether'),
    dueDate: new Date(parseInt(invoice.dueDate) * 1000).toLocaleString(),
    supplier: invoice.supplier,    
    isPaid: invoice.isPaid,
  };
}

export async function getAllPendingInvoices() {
  const contract = getContract();
  return contract.methods.getAllPendingInvoices().call();
}

export async function payInvoice(invoiceId, amount, from) {
  const contract = getContract();
  const weiAmount = Web3.utils.toWei(amount, 'ether');

  // Fetch the invoice to check amount and status
  const invoice = await contract.methods.invoices(invoiceId).call();
  console.log(`Invoice amount (wei): ${invoice.amount}`);
  console.log(`Provided amount (wei): ${weiAmount}`);
  
  if (!invoice || invoice.isPaid) {
    throw new Error('Invalid invoice ID or invoice already paid');
  }

  const invoiceAmountBN = new BN(invoice.amount);
  const weiAmountBN = new BN(weiAmount);
  
  console.log(`Invoice amount BN: ${invoiceAmountBN.toString()}`);
  console.log(`Provided amount BN: ${weiAmountBN.toString()}`);
  
  // if (!invoiceAmountBN.eq(weiAmountBN)) {
  //   throw new Error(`Incorrect payment amount. Expected ${invoiceAmountBN.toString()}, got ${weiAmountBN.toString()}`);
  // }

  try {
    const gasEstimate = await contract.methods.payInvoice(invoiceId).estimateGas({
      from,
      value: weiAmount,
    });
    console.log(`Estimated gas: ${gasEstimate}`);
    return contract.methods.payInvoice(invoiceId).send({
      from,
      value: weiAmount,
      gas: gasEstimate,
    });
  } catch (error) {
    console.error('Gas estimation failed:', error);
    throw new Error('Gas estimation failed, transaction might fail.');
  }
}
