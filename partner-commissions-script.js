document.addEventListener('DOMContentLoaded', () => {
    const loggedInUser = JSON.parse(sessionStorage.getItem('loggedInUser'));
    if (!loggedInUser || loggedInUser.role !== 'partner') {
        return; 
    }

    // Update pesan selamat datang
    const welcomeMessage = document.getElementById('welcome-message');
    if (welcomeMessage) welcomeMessage.textContent = `Welcome, ${loggedInUser.name}!`;

    const allDeals = JSON.parse(localStorage.getItem('omaku_deals'));
    const partnerDeals = allDeals.filter(deal => deal.partnerId === loggedInUser.id);
    const commissionRate = 0.10;

    // --- MENGHITUNG DAN MENAMPILKAN KARTU RINGKASAN (BAGIAN YANG HILANG) ---
    // Total Paid: Komisi dari deal yang sudah 'Delivered'
    const totalPaid = partnerDeals
        .filter(deal => deal.status === 'Delivered')
        .reduce((sum, deal) => sum + (deal.value * commissionRate), 0);

    // Pending Payout: Komisi dari deal yang statusnya 'Won'
    const pendingPayout = partnerDeals
        .filter(deal => deal.status === 'Won')
        .reduce((sum, deal) => sum + (deal.value * commissionRate), 0);
    
    // Total Orders: Jumlah deal yang sudah jadi order (Won atau Delivered)
    const totalOrders = partnerDeals.filter(deal => deal.status === 'Won' || deal.status === 'Delivered').length;

    // Update elemen HTML dengan data yang sudah dihitung
    document.getElementById('total-paid-value').textContent = `$${totalPaid.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}`;
    document.getElementById('pending-payout-value').textContent = `$${pendingPayout.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}`;
    document.getElementById('total-orders-value').textContent = totalOrders;
    document.getElementById('next-payout-value').textContent = 'Oct 15'; // Masih statis untuk demo
    // ----------------------------------------------------------------------

    // --- MEMBUAT DAN MENAMPILKAN BARIS TABEL ---
    const commissionsTbody = document.getElementById('commissions-tbody');
    if (partnerDeals.length === 0) {
        commissionsTbody.innerHTML = '<tr><td colspan="5" style="text-align: center; padding: 1rem;">No commission history found.</td></tr>';
        return;
    }

    let tableHTML = '';
    partnerDeals.forEach(deal => {
        const commission = deal.value * commissionRate;
        let statusTag = '';

        if (deal.status === 'Delivered') {
            statusTag = '<span class="status status-paid">Paid</span>';
        } else if (deal.status === 'Won' || deal.status === 'On Delivery') {
            statusTag = '<span class="status status-pending">Pending</span>';
        } else {
            return; 
        }
        
        tableHTML += `
            <tr>
                <td>#DEAL-${deal.id}</td>
                <td>${deal.date}</td>
                <td>$${deal.value.toLocaleString()}</td>
                <td>$${commission.toLocaleString('en-US', { minimumFractionDigits: 2 })}</td>
                <td>${statusTag}</td>
            </tr>
        `;
    });

    commissionsTbody.innerHTML = tableHTML;
});