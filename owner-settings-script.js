document.addEventListener('DOMContentLoaded', () => {
    // 1. Ambil data admin dari "database"
    const allUsers = JSON.parse(localStorage.getItem('omaku_users'));
    const adminUser = allUsers.find(user => user.role === 'admin');

    if (!adminUser) {
        console.error('Admin user not found.');
        return;
    }

    // 2. Isi form "Admin Profile" dengan data yang ada
    document.getElementById('name').value = adminUser.name;
    document.getElementById('email').value = adminUser.email;

    // 3. Tambahkan event listener untuk semua tombol save
    // Kita tidak akan benar-benar menyimpan data ke localStorage di prototipe ini,
    // hanya memberikan feedback bahwa tombolnya berfungsi.
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
        form.addEventListener('submit', (event) => {
            event.preventDefault(); // Mencegah form di-submit
            alert('Settings saved successfully! (Demo)');
        });
    });
});