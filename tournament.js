/* =================================================================
   SILENT GAMERS V2 - TOURNAMENT PAGE SCRIPT (tournament.js)
   ================================================================= */
import { protectPage } from './main.js';
import { callScript } from './api.js';
import { showLoader, hideLoader } from './main.js';

// --- A. GLOBAL STATE & CONFIGURATION ---
let userData = null; // Yahan hum logged-in user ka data save karenge.

// Tournament details. Yeh hum baad mein 'Config' sheet se la sakte hain.
const normalTournamentsData = [
    { id: 'NORMAL_1', name: 'Morning Mayhem', time: '12:00 PM', fee: 10, img: 'https://ik.imagekit.io/silentgamers/SILENT_20251003_232223_0000.png?updatedAt=1759514171688&ik-s=a8e9a9e69272de1573c60875e2a36d42dbcbf532' },
    { id: 'NORMAL_2', name: 'Afternoon Arena', time: '01:00 PM', fee: 12, img: 'https://ik.imagekit.io/silentgamers/SILENT_20251003_231910_0000.png?updatedAt=1759514171713&ik-s=839fd22c68398440cad027d91de8de8a8427deb7' },
    { id: 'NORMAL_3', name: 'Siesta Scrims', time: '02:00 PM', fee: 10, img: 'https://ik.imagekit.io/silentgamers/SILENT_20251003_231641_0000.png?updatedAt=1759514171839&ik-s=a037d9d67132f851731e18bab67557f48bf8d703' },
    { id: 'NORMAL_4', name: 'Evening Endgame', time: '03:00 PM', fee: 50, img: 'https://ik.imagekit.io/silentgamers/SILENT_20251003_232540_0000.png?updatedAt=1759514171791&ik-s=737709b0c3cd2394d1e683a1a1d10fafc428a38c' },
];
// Power tournament data ko hum baad mein add karenge.


// --- B. ELEMENT SELECTORS ---
const welcomeUsername = document.getElementById('welcome-username');
const redTokenBalance = document.getElementById('red-token-balance');
const blueTokenBalance = document.getElementById('blue-token-balance');
const powerCoinBalance = document.getElementById('power-coin-balance');
const normalTournamentsContainer = document.getElementById('normal-tournaments');
const tabButtons = document.querySelectorAll('.tab-btn');
const tabContents = document.querySelectorAll('.tab-content');
const modal = document.getElementById('modal');
const modalTitle = document.getElementById('modal-title');
const modalMessage = document.getElementById('modal-message');
const modalCloseBtn = document.getElementById('modal-close-btn');


// --- C. UI UPDATE FUNCTIONS ---

function updateWalletDisplay(walletData) {
    redTokenBalance.textContent = walletData.RedToken ?? 0;
    blueTokenBalance.textContent = walletData.BlueToken ?? 0;
    powerCoinBalance.textContent = walletData.PowerCoin ?? 0;
}

function renderNormalTournaments(userWallet, joinedIDs) {
    normalTournamentsContainer.innerHTML = ''; // Pehle se jo hai use saaf karo

    normalTournamentsData.forEach(tourney => {
        let actionButtonHTML;

        if (joinedIDs.includes(tourney.id)) {
            // User ne join kar liya hai
            actionButtonHTML = `<button class="card-btn start-btn" data-tournament-id="${tourney.id}">Go to Match</button>`;
        } else {
            // User ne join nahi kiya hai
            const canAfford = userWallet.RedToken >= tourney.fee;
            const btnClass = canAfford ? '' : 'add-tokens';
            const btnText = canAfford ? `Join (${tourney.fee} RT)` : 'Add Tokens';
            actionButtonHTML = `<button class="card-btn join-btn ${btnClass}" data-tournament-id="${tourney.id}" data-fee="${tourney.fee}">${btnText}</button>`;
        }

        const cardHTML = `
            <div class="tournament-card">
                <div class="card-header">
                    <img src="${tourney.img}" alt="${tourney.name}">
                </div>
                <div class="card-body">
                    <div class="card-info">
                        <h4>${tourney.name}</h4>
                        <p>Time: <strong>${tourney.time}</strong></p>
                        <p class="fee">Entry Fee: ${tourney.fee} Red Tokens</p>
                    </div>
                    <div class="card-actions">
                        ${actionButtonHTML}
                        <button class="card-btn rules-btn">Rules</button>
                    </div>
                </div>
            </div>
        `;
        normalTournamentsContainer.innerHTML += cardHTML;
    });
}

function showModal(title, message) {
    modalTitle.textContent = title;
    modalMessage.textContent = message;
    modal.classList.remove('hidden');
}

function hideModal() {
    modal.classList.add('hidden');
}

// --- D. EVENT HANDLERS ---

function handleTabClick(event) {
    const clickedTab = event.target;
    // Pehle saare active classes hata do
    tabButtons.forEach(btn => btn.classList.remove('active'));
    tabContents.forEach(content => content.classList.remove('active'));

    // Sirf click kiye hue tab par active class lagao
    clickedTab.classList.add('active');
    const tabId = clickedTab.dataset.tab;
    document.getElementById(`${tabId}-tournaments`).classList.add('active');
}

async function handleActionClick(event) {
    const target = event.target;

    // --- Join Button Logic ---
    if (target.classList.contains('join-btn')) {
        if (target.classList.contains('add-tokens')) {
            window.location.href = '/SILENT_GAMERS_V2/pages/shop.html';
            return;
        }

        const tournamentId = target.dataset.tournamentId;
        const fee = parseInt(target.dataset.fee, 10);

        if (confirm(`Confirm joining "${tournamentId}" for ${fee} Red Tokens?`)) {
            showLoader();
            try {
                const response = await callScript('processNormalJoin', {
                    userID: userData.userID,
                    tournamentID: tournamentId,
                    fee: fee
                });
                showModal('Success!', response.message);
                // Refresh data after joining
                initializeApp(); 
            } catch (error) {
                showModal('Error', error.message);
            } finally {
                hideLoader();
            }
        }
    }

    // --- Start Button Logic ---
    if (target.classList.contains('start-btn')) {
        const tournamentId = target.dataset.tournamentId;
        showLoader();
        target.disabled = true;
        target.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';

        try {
            const response = await callScript('getTournamentLink', {
                userID: userData.userID,
                tournamentID: tournamentId
            });
            // Redirect to the tournament link
            window.location.href = response.data.link;
        } catch (error) {
            showModal('Access Denied', error.message);
            target.disabled = false;
            target.innerHTML = 'Go to Match';
        } finally {
            hideLoader();
        }
    }
}


// --- E. INITIALIZATION FUNCTION ---

async function initializeApp() {
    showLoader();
    try {
        // Parallel API calls for faster loading
        const [walletResponse, joinedResponse] = await Promise.all([
            callScript('getWalletDetails', { userID: userData.userID }),
            callScript('getMyJoinedTournaments', { userID: userData.userID })
        ]);

        const walletData = walletResponse.data;
        const joinedTournamentIDs = joinedResponse.data;

        // Update UI with the fetched data
        welcomeUsername.textContent = userData.username;
        updateWalletDisplay(walletData);
        renderNormalTournaments(walletData, joinedTournamentIDs);

    } catch (error) {
        showModal('Error', 'Could not load tournament data. Please refresh the page.');
        console.error(error);
    } finally {
        hideLoader();
    }
}

// --- F. SCRIPT EXECUTION ---

// Sabse pehle, page ko protect karo
userData = protectPage();

// Agar user logged in hai, tabhi aage ka code chalao
if (userData) {
    // Event Listeners
    tabButtons.forEach(button => button.addEventListener('click', handleTabClick));
    document.getElementById('tournaments-container').addEventListener('click', handleActionClick);
    modalCloseBtn.addEventListener('click', hideModal);
    
    // App ko initialize karo
    initializeApp();
}
