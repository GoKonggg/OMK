/**
 * AUTH GUARD
 * This script protects pages by checking if a user is logged in.
 * If not logged in, it redirects them to the login page.
 */

(function() {
    // Ambil data user yang login dari sessionStorage
    const loggedInUser = sessionStorage.getItem('loggedInUser');

    // Jika tidak ada data user (artinya belum login)
    if (!loggedInUser) {
        // Tampilkan pesan dan arahkan kembali ke halaman login
        alert('You must be logged in to view this page. Redirecting to login...');
        window.location.href = 'login.html';
    }
})(); // This is an IIFE (Immediately Invoked Function Expression), it runs automatically