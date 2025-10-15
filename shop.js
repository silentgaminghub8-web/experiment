/* =================================================================
   SILENT GAMERS V2 - SHOP PAGE SCRIPT (shop.js)
   ================================================================= */

// Zaroori functions ko import karo
import { protectPage, showLoader, hideLoader } from './main.js';
import { callScript } from './api.js';

// --- A. GLOBAL STATE & ELEMENT SELECTORS ---
let userData = null; // Logged-in user ka data
const purchaseForm = document.getElementById('purchase-form');
const paymentSection = document.getElementById('payment-section');
const successSection = document.getElementById('success-section');
const confirmationForm = document.getElementById('confirmation-form');

const amountInput = document.getElementById('amount');
const purchaseError = document.getElementById('purchase-error');
const paymentAmountSpan = document.getElementById('payment-amount');
const qrcodeContainer = document.getElementById('qrcode-container');
const transactionIDInput = document.getElementById('transactionID');
const confirmationError = document.getElementById('confirmation-error');
const confirmBtn = document.getElementById('confirm-btn');
const backToShopBtn = document.getElementById('back-to-shop-btn');

// Apni UPI ID yahan daalein
const UPI_ID = 'your-upi-id@okhdfcbank'; 
const UPI_NAME = 'Silent Gamers';

// --- B. UI CONTROL FUNCTIONS ---
function showStep(stepToShow) {
    // Pehle saare steps chhupa do
    document.querySelectorAll('.step').forEach(step => {
        step.classList.remove('active');
    });
    // Fir zaroori step dikhao
    stepToShow.classList.add('active');
}

// --- C. EVENT HANDLERS ---

// Handle Step 1: User amount enter karta hai
purchaseForm.addEventListener('submit', (event) => {
    event.preventDefault();
    purchaseError.textContent = '';
    
    const amount = parseInt(amountInput.value, 10);
    
    // Validation
    if (isNaN(amount) || amount < 50 || amount > 5000) {
        purchaseError.textContent = 'Please enter an amount between ₹50 and ₹5000.';
        return;
    }

    // Step 2 par jaao
    generateQRCode(amount);
    paymentAmountSpan.textContent = `₹${amount}`;
    showStep(paymentSection);
});

// QR Code generate karne ka function
function generateQRCode(amount) {
    qrcodeContainer.innerHTML = ''; // Purana QR code saaf karo
    const upiString = `upi://pay?pa=${UPI_ID}&pn=${encodeURIComponent(UPI_NAME)}&am=${amount}&cu=INR`;
    
    new QRCode(qrcodeContainer, {
        text: upiString,
        width: 200,
        height: 200,
        colorDark: "#000000",
        colorLight: "#ffffff",
        correctLevel: QRCode.CorrectLevel.H
    });
}

// Handle Step 2: User Transaction ID enter karke confirm karta hai
confirmationForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    confirmationError.textContent = '';

    const transactionID = transactionIDInput.value.trim();
    const tokenType = document.querySelector('input[name="tokenType"]:checked').value;
    const amount = parseInt(amountInput.value, 10);

    // Validation
    if (!transactionID || transactionID.length < 12) {
        confirmationError.textContent = 'Please enter a valid 12-digit Transaction ID (UTR).';
        return;
    }

    confirmBtn.disabled = true;
    confirmBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Confirming...';
    
    const purchaseData = {
        userID: userData.userID,
        tokenType: tokenType,
        amount: amount,
        transactionID: transactionID
    };

    try {
        // Backend ko request bhejo
        const response = await callScript('recordTransaction', purchaseData);
        if (response.status === 'success') {
            showStep(successSection);
        }
    } catch (error) {
        confirmationError.textContent = error.message;
    } finally {
        confirmBtn.disabled = false;
        confirmBtn.innerHTML = 'Confirm Purchase';
    }
});

// "Go Back" button ka logic
backToShopBtn.addEventListener('click', () => {
    showStep(purchaseForm);
});


// --- D. INITIALIZATION ---
document.addEventListener('DOMContentLoaded', () => {
    // Page ko protect karo aur user ka data lo
    userData = protectPage();

    // Agar user logged in nahi hai, to aage ka code nahi chalega
    if (userData) {
        // Page load hone par pehla step dikhao
        showStep(purchaseForm);
    }
});
