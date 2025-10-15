/* =================================================================
   SILENT GAMERS V2 - PROFILE PAGE SCRIPT (profile.js)
   ================================================================= */

// main.js se zaroori functions import karo
import { protectPage, showLoader, hideLoader } from './main.js';

// --- A. ELEMENT SELECTORS ---
// Page ke woh saare hisse select karo jinhein humein update karna hai.
const profileUsername = document.getElementById('profile-username');
const profileGameName = document.getElementById('profile-game-name');
const profileUserID = document.getElementById('profile-userid');
const profileMobile = document.getElementById('profile-mobile');
const profileEmail = document.getElementById('profile-email');
const profileGameUID = document.getElementById('profile-gameuid');
const profileUPI = document.getElementById('profile-upi');

// --- B. UI UPDATE FUNCTION ---
// Yeh function data lega aur use HTML mein daal dega.
function populateProfileData(userData) {
    if (!userData) {
        // Agar kisi wajah se data nahi hai, to error dikhao.
        console.error("No user data found to populate profile.");
        // Aage jaakar hum yahan ek error message dikha sakte hain.
        return;
    }

    // Har element mein user ka data set karo.
    // '||' (OR operator) ka istemaal yeh sunishchit karta hai ki agar data
    // undefined ya khali ho, to ek default message dikhe.
    profileUsername.textContent = userData.username || 'N/A';
    profileGameName.textContent = `Game Name: ${userData.gameName || 'N/A'}`;
    profileUserID.textContent = userData.userID || 'N/A';
    profileMobile.textContent = userData.mobile || 'N/A';
    
    // Email aur UPI optional ho sakte hain, isliye check zaroori hai.
    profileEmail.textContent = userData.email || 'Not Provided';
    profileGameUID.textContent = userData.gameUID || 'N/A';
    profileUPI.textContent = userData.upiID || 'Not Provided';
}

// --- C. INITIALIZATION ---
// Jab page load hoga, yeh code chalega.
document.addEventListener('DOMContentLoaded', () => {
    
    // Step 1: Page ko protect karo aur user ka data hasil karo.
    // protectPage() function auth.js se session check karega.
    // Agar user logged-in nahi hai, to yeh use login page par bhej dega.
    const userData = protectPage(); 
    
    // Step 2: Agar user data mila hai, to profile ko populate karo.
    if (userData) {
        // Humne ek chota sa loader dikhaya hai taaki user ko lage ki kuch ho raha hai.
        showLoader();

        // Thoda sa delay (300ms) taaki loader dikhe aur experience smooth lage.
        setTimeout(() => {
            populateProfileData(userData);
            hideLoader();
        }, 300);
    }
    // Agar 'userData' null hai, to protectPage() pehle hi user ko redirect kar chuka hoga.
});
