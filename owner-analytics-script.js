document.addEventListener('DOMContentLoaded', () => {
    const allDeals = JSON.parse(localStorage.getItem('omaku_deals'));
    const allUsers = JSON.parse(localStorage.getItem('omaku_users'));

    if (!allDeals || !allUsers) {
        console.error('Database not found.');
        return;
    }

    // --- 1. Update Chart Revenue Over Time ---
    const revenueChart = document.getElementById('revenue-chart');
    if (revenueChart) {
        // Simple grouping by date for demo
        const firstHalfRevenue = allDeals
            .filter(d => (d.status === 'Won' || d.status === 'Delivered') && new Date(d.date).getDate() <= 15)
            .reduce((sum, d) => sum + d.value, 0);
        const secondHalfRevenue = allDeals
            .filter(d => (d.status === 'Won' || d.status === 'Delivered') && new Date(d.date).getDate() > 15)
            .reduce((sum, d) => sum + d.value, 0);

        const chartUrl = `https://quickchart.io/chart?c={type:'bar',data:{labels:['1-15 Sep','16-30 Sep'], datasets:[{label:'Revenue',data:[${firstHalfRevenue},${secondHalfRevenue}],backgroundColor:'rgba(220, 53, 69, 0.7)'}]}}`;
        revenueChart.src = chartUrl;
    }

    // --- 2. Update Top Performing Partners Table ---
    const topPartnersTbody = document.getElementById('top-partners-tbody');
    if (topPartnersTbody) {
        const partnerScores = allUsers
            .filter(user => user.role === 'partner')
            .map(partner => {
                const totalSales = allDeals
                    .filter(deal => deal.partnerId === partner.id && (deal.status === 'Won' || deal.status === 'Delivered'))
                    .reduce((sum, deal) => sum + deal.value, 0);
                return { name: partner.name, score: totalSales };
            })
            .sort((a, b) => b.score - a.score)
            .slice(0, 3); // Ambil 3 teratas

        topPartnersTbody.innerHTML = '';
        partnerScores.forEach(partner => {
            topPartnersTbody.innerHTML += `
                <tr>
                    <td class="p-4">${partner.name}</td>
                    <td class="p-4">$${partner.score.toLocaleString()}</td>
                </tr>
            `;
        });
    }
    
    // --- 3. Update Sales Funnel Conversion List ---
    const funnelList = document.getElementById('funnel-conversion-list');
    if (funnelList) {
        const leadsCount = allDeals.length;
        const quotesCount = allDeals.filter(d => d.status !== 'New Leads').length;
        const ordersCount = allDeals.filter(d => d.status === 'Won' || d.status === 'Delivered').length;
        
        const leadToQuoteRate = leadsCount > 0 ? (quotesCount / leadsCount) * 100 : 0;
        const quoteToOrderRate = quotesCount > 0 ? (ordersCount / quotesCount) * 100 : 0;
        const overallRate = leadsCount > 0 ? (ordersCount / leadsCount) * 100 : 0;

        funnelList.innerHTML = `
            <li class="flex justify-between py-2 border-b"><span>Leads to Quotes</span> <span>${leadToQuoteRate.toFixed(1)}%</span></li>
            <li class="flex justify-between py-2 border-b"><span>Quotes to Orders</span> <span>${quoteToOrderRate.toFixed(1)}%</span></li>
            <li class="flex justify-between py-2 font-bold"><span>Overall Conversion</span> <span>${overallRate.toFixed(1)}%</span></li>
        `;
    }
});