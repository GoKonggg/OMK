document.addEventListener('DOMContentLoaded', () => {
    // 1. Ambil semua data dari "database"
    const allUsers = JSON.parse(localStorage.getItem('omaku_users'));
    const allDeals = JSON.parse(localStorage.getItem('omaku_deals'));

    if (!allUsers || !allDeals) {
        console.error('Database not found. Ensure data.js is loaded.');
        return;
    }

    const commissionRate = 0.10; // Asumsi komisi 10%

    // 2. Filter untuk mendapatkan hanya partner
    const allPartners = allUsers.filter(user => user.role === 'partner');

    // 3. Hitung KPIs untuk kartu ringkasan
    const totalActivePartners = allPartners.length;
    
    const revenueFromPartners = allDeals
        .filter(deal => deal.partnerId !== null && deal.partnerId !== 100 && (deal.status === 'Won' || deal.status === 'Delivered'))
        .reduce((sum, deal) => sum + deal.value, 0);

    // Hitung penjualan per partner untuk mencari top partner
    let topPartner = { name: 'N/A', sales: 0 };
    const partnerSales = allPartners.map(partner => {
        const sales = allDeals
            .filter(deal => deal.partnerId === partner.id && (deal.status === 'Won' || deal.status === 'Delivered'))
            .reduce((sum, deal) => sum + deal.value, 0);
        return { name: partner.name, sales: sales };
    });

    if (partnerSales.length > 0) {
        topPartner = partnerSales.reduce((top, current) => current.sales > top.sales ? current : top, partnerSales[0]);
    }

    // 4. Update kartu ringkasan di HTML
    document.getElementById('total-partners').textContent = totalActivePartners;
    document.getElementById('revenue-from-partners').textContent = `$${revenueFromPartners.toLocaleString()}`;
    document.getElementById('top-partner-name').textContent = topPartner.name;
    // Angka "New Signups" kita buat statis untuk demo
    document.getElementById('new-signups').textContent = '2';


    // 5. Buat baris tabel untuk setiap partner
    const partnersTableBody = document.getElementById('partners-table-body');
    partnersTableBody.innerHTML = ''; // Kosongkan tabel

    allPartners.forEach(partner => {
        // Ambil data penjualan untuk partner saat ini
        const salesData = partnerSales.find(p => p.name === partner.name);
        const totalSales = salesData ? salesData.sales : 0;
        const commissionPaid = totalSales * commissionRate;
        const status = 'Active'; // Dibuat statis untuk demo

        const tableRowHTML = `
            <tr>
                <td>
                    <div class="partner-info">
                        <img class="partner-avatar" src="https://api.dicebear.com/8.x/initials/svg?seed=${partner.name}" alt="avatar">
                        <span>${partner.name}</span>
                    </div>
                </td>
                <td>$${totalSales.toLocaleString()}</td>
                <td>$${commissionPaid.toLocaleString('en-US', {minimumFractionDigits: 2})}</td>
                <td><span class="status status-paid">${status}</span></td>
                <td class="action-buttons">
                    <a href="#" class="btn btn-secondary btn-sm">Details</a>
                </td>
            </tr>
        `;
        partnersTableBody.innerHTML += tableRowHTML;
    });
});