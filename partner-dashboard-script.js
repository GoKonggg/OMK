document.addEventListener('DOMContentLoaded', () => {
    // 1. Ambil data user yang sedang login dari sessionStorage
    const loggedInUser = JSON.parse(sessionStorage.getItem('loggedInUser'));

    // Jika tidak ada yang login atau rolenya bukan partner, hentikan eksekusi
    if (!loggedInUser || loggedInUser.role !== 'partner') {
        // (auth-guard.js seharusnya sudah menangani ini, tapi ini pengaman tambahan)
        console.error('No partner user is logged in.');
        return;
    }

    // 2. Ambil semua data deals dari localStorage
    const allDeals = JSON.parse(localStorage.getItem('omaku_deals'));

    // 3. Filter deals yang hanya milik partner ini
    const partnerDeals = allDeals.filter(deal => deal.partnerId === loggedInUser.id);

    // 4. Hitung KPIs
    const commissionRate = 0.10; // Asumsi komisi 10%

    // Total Earnings: dari deals yang sudah "Delivered"
    const totalEarnings = partnerDeals
        .filter(deal => deal.status === 'Delivered')
        .reduce((sum, deal) => sum + (deal.value * commissionRate), 0);
    
    // Pending Commissions: dari deals yang statusnya "Won" tapi belum "Delivered"
    const pendingCommissions = partnerDeals
        .filter(deal => deal.status === 'Won')
        .reduce((sum, deal) => sum + (deal.value * commissionRate), 0);

    // Leads Generated: semua deal yang terhubung dengan partner ini
    const leadsGenerated = partnerDeals.length;

    // Conversion Rate: (Won + Delivered) / Total Leads
    const wonOrDeliveredCount = partnerDeals.filter(deal => deal.status === 'Won' || deal.status === 'Delivered').length;
    const conversionRate = leadsGenerated > 0 ? (wonOrDeliveredCount / leadsGenerated) * 100 : 0;

    // 5. Update tampilan HTML (DOM Manipulation)
    document.getElementById('welcome-message').textContent = `Welcome, ${loggedInUser.name}!`;
    document.getElementById('total-earnings-value').textContent = `$${totalEarnings.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    document.getElementById('pending-commissions-value').textContent = `$${pendingCommissions.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    document.getElementById('leads-generated-value').textContent = leadsGenerated;
    document.getElementById('conversion-rate-value').textContent = `${conversionRate.toFixed(1)}%`;
});