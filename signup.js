/* =================================================================
   SILENT GAMERS V2 - SIGNUP PAGE SCRIPT (signup.js)
   ================================================================= */

// Zaroori functions ko import karo
import { callScript } from './api.js';
import { showLoader, hideLoader } from './main.js'; // Humne main.js mein loader banaya tha, lekin yahan use nahi kar rahe, button mein hi loader hai.

// --- A. ELEMENT SELECTORS ---
const signupForm = document.getElementById('signup-form');
const usernameInput = document.getElementById('username');
const mobileInput = document.getElementById('mobile');
const emailInput = document.getElementById('email');
const gameUIDInput = document.getElementById('gameUID');
const gameNameInput = document.getElementById('gameName');
const upiIDInput = document.getElementById('upiID');
const passwordInput = document.getElementById('password');
const confirmPasswordInput = document.getElementById('confirmPassword');
const signupBtn = document.getElementById('signup-btn');
const signupStatus = document.getElementById('signup-status');

// --- B. EVENT LISTENER ---
signupForm.addEventListener('submit', async (event) => {
    event.preventDefault(); // Form ko default tareeke se submit hone se roko

    // --- C. FRONTEND VALIDATION ---
    // Har baar submit karne par purane message ko saaf karo
    signupStatus.textContent = '';
    signupStatus.classList.remove('success');

    // 1. Saare inputs se values le lo (aur extra space hata do)
    const username = usernameInput.value.trim();
    const mobile = mobileInput.value.trim();
    const email = emailInput.value.trim();
    const gameUID = gameUIDInput.value.trim();
    const gameName = gameNameInput.value.trim();
    const upiID = upiIDInput.value.trim();
    const password = passwordInput.value;
    const confirmPassword = confirmPasswordInput.value;

    // 2. Check karo ki zaroori fields khali to nahi hain
    if (!username || !mobile || !gameUID || !gameName || !password || !confirmPassword) {
        signupStatus.textContent = 'Please fill in all required fields.';
        return;
    }

    // 3. Mobile number 10 digits ka hai ya nahi
    if (mobile.length !== 10 || isNaN(mobile)) {
        signupStatus.textContent = 'Mobile number must be exactly 10 digits.';
        return;
    }

    // 4. Password 6 characters se lamba hai ya nahi (optional, but good practice)
    if (password.length < 6) {
        signupStatus.textContent = 'Password must be at least 6 characters long.';
        return;
    }

    // 5. Password aur Confirm Password match karte hain ya nahi
    if (password !== confirmPassword) {
        signupStatus.textContent = 'Passwords do not match.';
        return;
    }

    // --- D. BACKEND CALL ---
    // Agar saari validation pass ho gayi, to button ko disable karke loader dikhao
    signupBtn.disabled = true;
    signupBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Creating Account...';

    // Ek object mein saara data collect karo
    const registrationData = {
        username,
        mobile,
        email,
        gameUID,
        gameName,
        upiID,
        password // Password ko plain text mein bhej rahe hain, Apps Script use hash karega
    };

    try {
        // api.js ke through 'registerUser' function ko call karo
        const response = await callScript('registerUser', registrationData);

        if (response.status === 'success') {
            // Agar account ban gaya
            signupStatus.textContent = response.message + " Redirecting to login...";
            signupStatus.classList.add('success');
            signupForm.reset(); // Form ko khali kar do

            // User ko 3 second baad login page par bhej do
            setTimeout(() => {
                window.location.href = '/SILENT_GAMERS_V2/index.html';
            }, 3000);
        }
        // Agar script se koi error aata hai, to 'catch' block use handle karega

    } catch (error) {
        // Agar backend se koi error aaya (jaise 'mobile already registered')
        signupStatus.textContent = error.message;
        signupBtn.disabled = false;
        signupBtn.innerHTML = 'Create Account';
    }
});
