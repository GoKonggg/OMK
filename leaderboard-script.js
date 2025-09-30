document.addEventListener('DOMContentLoaded', () => {
    // --- MENGAMBIL DATA DARI SUMBER TERPUSAT ---
    // 1. Ambil data user yang sedang login dari sessionStorage
    const loggedInUser = JSON.parse(sessionStorage.getItem('loggedInUser'));

    // 2. Ambil semua data dari "database" localStorage
    const users = JSON.parse(localStorage.getItem('omaku_users'));
    const deals = JSON.parse(localStorage.getItem('omaku_deals'));
    // ---------------------------------------------

    // Jika data tidak ditemukan, hentikan eksekusi
    if (!users || !deals) {
        console.error('Database not found. Ensure data.js is loaded.');
        return;
    }

    const topPerformersContainer = document.getElementById('top-performers-container');
    const leaderboardTbody = document.getElementById('leaderboard-tbody');

    function calculateAndRender() {
        const partnerScores = users
            .filter(user => user.role === 'partner')
            .map(partner => {
                const partnerDeals = deals.filter(deal => deal.partnerId === partner.id && (deal.status === 'Won' || deal.status === 'Delivered'));
                const totalSales = partnerDeals.reduce((sum, deal) => sum + deal.value, 0);
                return { id: partner.id, name: partner.name, score: totalSales };
            });

        partnerScores.sort((a, b) => b.score - a.score);

        renderTopPerformers(partnerScores.slice(0, 3));
        renderTable(partnerScores.slice(3));
    }

    function renderTopPerformers(topThree) {
        topPerformersContainer.innerHTML = '';
        topThree.forEach((partner, index) => {
            const rank = index + 1;
            const rankClass = `rank-${rank}`;
            const isCurrentUser = loggedInUser && partner.id === loggedInUser.id;
            const partnerName = isCurrentUser ? 'You' : partner.name;
            
            const performerCardHTML = `
                <div class="performer-card ${rankClass}">
                    <div class="rank-badge">${rank}</div>
                    <img class="avatar w-20 h-20" src="https://api.dicebear.com/8.x/initials/svg?seed=${partner.name}" alt="avatar">
                    <div class="name text-lg font-bold text-dark-gray mb-1">${partnerName}</div>
                    <div class="score text-2xl font-bold text-omaku-red">$${partner.score.toLocaleString()}</div>
                </div>
            `;
            
            let finalHTML = performerCardHTML;
            if (rank === 1) {
                finalHTML = finalHTML.replace('class="avatar w-20 h-20"', 'class="avatar w-24 h-24"');
            }
            topPerformersContainer.innerHTML += finalHTML;
        });
    }

    function renderTable(remainingPartners) {
        leaderboardTbody.innerHTML = '';
        remainingPartners.forEach((partner, index) => {
            const rank = index + 4;
            const isCurrentUser = loggedInUser && partner.id === loggedInUser.id;
            const rowClass = isCurrentUser ? 'current-user-row' : '';
            const partnerName = isCurrentUser ? 'You' : partner.name;

            const tableRowHTML = `
                <tr class="${rowClass}">
                    <td class="p-4">${rank}</td>
                    <td class="p-4">${partnerName}</td>
                    <td class="p-4">$${partner.score.toLocaleString()}</td>
                    <td class="p-4 text-gray-500">-</td>
                </tr>
            `;
            leaderboardTbody.innerHTML += tableRowHTML;
        });
    }

    calculateAndRender();
});