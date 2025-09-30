document.addEventListener('DOMContentLoaded', () => {
    // Cari tombol logout di halaman
    const logoutBtn = document.getElementById('logout-btn');

    if (logoutBtn) {
        logoutBtn.addEventListener('click', (event) => {
            event.preventDefault(); // Mencegah link berpindah halaman secara normal

            // Hapus data user dari sessionStorage
            sessionStorage.removeItem('loggedInUser');

            // Beri notifikasi dan arahkan ke halaman login
            alert('You have been logged out.');
            window.location.href = 'index.html';
        });
    }
});