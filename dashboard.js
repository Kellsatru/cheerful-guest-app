// ------------------------------------------------------------
// CHEERFUL HOTEL – DASHBOARD (NO PASSWORD VERSION)
// ------------------------------------------------------------
import { db } from "./firebase.js";
import { ref, onValue, update } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";

let allRequests = [];
let currentFilter = "all";


// ------------------------------------------------------------
// 1. LOAD REQUESTS FROM FIREBASE IMMEDIATELY
// ------------------------------------------------------------
window.addEventListener("DOMContentLoaded", () => {
    // hide login screen, show dashboard automatically
    const login = document.getElementById("login-screen");
    const dash = document.getElementById("dashboard");

    if (login) login.style.display = "none";
    if (dash) dash.style.display = "block";

    loadRequests();
});


// ------------------------------------------------------------
// 2. LOAD REQUESTS IN REAL TIME
// ------------------------------------------------------------
function loadRequests() {
    const requestsRef = ref(db, "requests");

    onValue(requestsRef, (snapshot) => {
        const data = snapshot.val();
        allRequests = [];

        if (data) {
            for (let id in data) {
                allRequests.push({
                    id: id,
                    ...data[id]
                });
            }
        }

        // newest → oldest
        allRequests.sort((a, b) => new Date(b.time) - new Date(a.time));

        renderTable();
    });
}


// ------------------------------------------------------------
// 3. FILTER REQUESTS
// ------------------------------------------------------------
window.filterRequests = function (branch) {
    currentFilter = branch;

    document.getElementById("btn-all").classList.remove("active");
    document.getElementById("btn-unaizah").classList.remove("active");
    document.getElementById("btn-alrass").classList.remove("active");

    if (branch === "all") document.getElementById("btn-all").classList.add("active");
    if (branch === "unaizah") document.getElementById("btn-unaizah").classList.add("active");
    if (branch === "alrass") document.getElementById("btn-alrass").classList.add("active");

    renderTable();
};


// ------------------------------------------------------------
// 4. RENDER TABLE
// ------------------------------------------------------------
function renderTable() {
    const tbody = document.getElementById("requests-body");
    tbody.innerHTML = "";

    let filtered = allRequests;

    if (currentFilter !== "all") {
        filtered = allRequests.filter(req => req.branch.toLowerCase() === currentFilter);
    }

    filtered.forEach(req => {
        const row = document.createElement("tr");

        const statusHTML = 
            req.status === "pending"
                ? `<span class="badge badge-pending">Pending</span>`
                : `<span class="badge badge-completed">Completed</span>`;

        const actionHTML =
            req.status === "pending"
                ? `<button class="complete-btn" onclick="markCompleted('${req.id}')">Complete</button>`
                : `—`;

        row.innerHTML = `
            <td>${req.time}</td>
            <td>${req.branch.toUpperCase()}</td>
            <td>${req.room}</td>
            <td>${req.request}</td>
            <td>${statusHTML}</td>
            <td>${actionHTML}</td>
        `;

        tbody.appendChild(row);
    });
}


// ------------------------------------------------------------
// 5. MARK REQUEST AS COMPLETED
// ------------------------------------------------------------
window.markCompleted = function (id) {
    update(ref(db, "requests/" + id), {
        status: "completed"
    });
};
