document.addEventListener('DOMContentLoaded', () => {
    const loginPartnerBtn = document.getElementById('login-partner-btn');
    const loginOwnerBtn = document.getElementById('login-owner-btn');

    // Pastikan tombol ada di halaman
    if (loginPartnerBtn && loginOwnerBtn) {
        // --- Event Listener untuk Tombol Partner ---
        loginPartnerBtn.addEventListener('click', () => {
            // 1. Baca 'database' dari localStorage
            const users = JSON.parse(localStorage.getItem('omaku_users'));
            if (!users) {
                alert('Error: Database not found. Please ensure data.js is loaded.');
                return;
            }

            // 2. Cari user partner pertama (untuk demo)
            const partnerUser = users.find(user => user.role === 'partner');

            if (partnerUser) {
                // 3. Simpan user ke sessionStorage untuk "mengingat" login
                sessionStorage.setItem('loggedInUser', JSON.stringify(partnerUser));
                alert(`Login successful as ${partnerUser.name}! Redirecting to partner dashboard...`);
                // 4. Arahkan ke dasbor partner
                window.location.href = 'partner-dashboard.html';
            } else {
                alert('No partner user found in the sample data!');
            }
        });

        // --- Event Listener untuk Tombol Owner/Admin ---
        loginOwnerBtn.addEventListener('click', () => {
            const users = JSON.parse(localStorage.getItem('omaku_users'));
            if (!users) {
                alert('Error: Database not found.');
                return;
            }

            const adminUser = users.find(user => user.role === 'admin');

            if (adminUser) {
                sessionStorage.setItem('loggedInUser', JSON.stringify(adminUser));
                alert(`Login successful as ${adminUser.name}! Redirecting to owner dashboard...`);
                window.location.href = 'owner-dashboard.html';
            } else {
                alert('No admin user found in the sample data!');
            }
        });
    }
});