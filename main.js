/* =================================================================
   SILENT GAMERS V2 - MAIN UI SCRIPT (main.js)
   ================================================================= */
import { checkSession, logout } from './auth.js';

// --- A. ELEMENT SELECTORS ---
// Yeh saare elements har page par ho sakte hain, isliye hum inhein yahan define kar rahe hain.
const menuTrigger = document.getElementById('menu-trigger');
const slideNav = document.getElementById('slide-nav');
const logoutBtn = document.getElementById('logout-btn');
const pageLoader = document.getElementById('page-loader'); // Hum yeh loader har page par add karenge

// --- B. LOADER FUNCTIONS ---
// In functions ko hum kisi bhi file se call kar sakte hain loader dikhane/chhupane ke liye.
export function showLoader() {
    if (pageLoader) pageLoader.classList.remove('hidden');
}

export function hideLoader() {
    if (pageLoader) pageLoader.classList.add('hidden');
}

// --- C. HEADER & NAVIGATION LOGIC ---
function initializeHeader() {
    if (menuTrigger && slideNav) {
        menuTrigger.addEventListener('click', () => {
            slideNav.classList.toggle('menu-open');
        });
    }

    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            // Confirmation maango logout se pehle
            if (confirm("Are you sure you want to log out?")) {
                showLoader();
                logout(); // auth.js se logout function call hoga
            }
        });
    }
}

// --- D. SESSION MANAGEMENT & PAGE PROTECTION ---
// Yeh function check karega ki user logged in hai ya nahi.
// Agar nahi, to login page par bhej dega.
// Yeh function har page (login page ko chhodkar) ki JS file mein sabse pehle call hoga.
export function protectPage() {
    const userData = checkSession(); // auth.js se session data check karo

    if (!userData) {
        // Agar session data nahi hai, to user logged in nahi hai.
        // Turant login page par bhej do.
        alert("You must be logged in to view this page.");
        window.location.href = '/SILENT_GAMERS_V2/index.html'; // Path theek se daalein
        return null; // Aage ka code na chale
    }

    // Agar user logged in hai, to uska data wapas de do
    return userData;
}


// --- E. INITIALIZATION ---
// Jab bhi yeh file kisi HTML mein import hogi, yeh code chalega.
document.addEventListener('DOMContentLoaded', () => {
    initializeHeader();

    // Check karo ki user logged in hai ya nahi
    const userData = checkSession();
    
    // Agar user logged in hai, to header mein uske naam wagerah dikha sakte hain (future feature)
    if (userData) {
        // Example: Agar header mein user ka naam dikhana ho
        const usernameDisplay = document.getElementById('header-username');
        if(usernameDisplay) {
            usernameDisplay.textContent = userData.username;
        }

        // Logout button ko dikhao
        if(logoutBtn) logoutBtn.classList.remove('hidden');

    } else {
        // Agar user logged in nahi hai, to logout button ko chhupa do
        if(logoutBtn) logoutBtn.classList.add('hidden');
    }
});
