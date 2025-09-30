document.addEventListener('DOMContentLoaded', () => {
    // --- SAMPLE DATA (Self-contained) ---
    const users = [
        { id: 1, name: 'Michael Chen', email: 'partner@omaku.com', password: 'password123', role: 'partner' },
        { id: 2, name: 'Jane Doe', email: 'jane.doe@example.com', password: 'password123', role: 'partner' },
        { id: 3, name: 'David Lee', email: 'david.lee@example.com', password: 'password123', role: 'partner' },
        { id: 4, name: 'Sarah Wilson', email: 'sarah.wilson@example.com', password: 'password123', role: 'partner' },
        { id: 5, name: 'Your Partner Name', email: 'you@example.com', password: 'password123', role: 'partner' },
        { id: 6, name: 'Robert Garcia', email: 'robert.g@example.com', password: 'password123', role: 'partner' },
        { id: 7, name: 'Jessica Kim', email: 'jessica.k@example.com', password: 'password123', role: 'partner' },
        { id: 100, name: 'Admin User', email: 'admin@omaku.com', password: 'adminpass', role: 'admin' }
    ];
    const deals = [
        { id: 101, title: 'Project A', value: 18550, status: 'Won', partnerId: 1 },
        { id: 102, title: 'Project B', value: 15210, status: 'Won', partnerId: 2 },
        { id: 103, title: 'Project C', value: 14980, status: 'Won', partnerId: 3 },
        { id: 104, title: 'Project D', value: 12800, status: 'Won', partnerId: 4 },
        { id: 105, title: 'Project E', value: 11500, status: 'Won', partnerId: 5 },
        { id: 106, title: 'Project F', value: 10950, status: 'Won', partnerId: 6 },
        { id: 107, title: 'Project G', value: 9800, status: 'Won', partnerId: 7 },
        { id: 108, title: 'Project H', value: 5000, status: 'New Leads', partnerId: 1 }
    ];
    const loggedInUser = users.find(user => user.id === 5); 
    // ---------------------------------------------------

    const topPerformersContainer = document.getElementById('top-performers-container');
    const leaderboardTbody = document.getElementById('leaderboard-tbody');

    function calculateAndRender() {
        const partnerScores = users
            .filter(user => user.role === 'partner')
            .map(partner => {
                const partnerDeals = deals.filter(deal => deal.partnerId === partner.id && deal.status === 'Won');
                const totalSales = partnerDeals.reduce((sum, deal) => sum + deal.value, 0);
                return { id: partner.id, name: partner.name, score: totalSales };
            });

        partnerScores.sort((a, b) => b.score - a.score);

        renderTopPerformers(partnerScores.slice(0, 3));
        renderTable(partnerScores.slice(3));
    }

    // In leaderboard-script.js

function renderTopPerformers(topThree) {
    topPerformersContainer.innerHTML = '';
    topThree.forEach((partner, index) => {
        const rank = index + 1;
        const rankClass = `rank-${rank}`;
        const isCurrentUser = loggedInUser && partner.id === loggedInUser.id;
        const partnerName = isCurrentUser ? 'You' : partner.name;
        
        // The only change is moving the rank-badge div in this block of HTML
        const performerCardHTML = `
            <div class="performer-card ${rankClass}">
                <img class="avatar w-20 h-20" src="https://api.dicebear.com/8.x/initials/svg?seed=${partner.name}" alt="avatar">
                <div class="name text-lg font-bold text-dark-gray mb-1">${partnerName}</div>
                <div class="score text-2xl font-bold text-omaku-red">$${partner.score.toLocaleString()}</div>
                
                <div class="rank-badge">${rank}</div> 
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
                    <td>${rank}</td>
                    <td>${partnerName}</td>
                    <td>$${partner.score.toLocaleString()}</td>
                    <td>-</td>
                </tr>
            `;
            leaderboardTbody.innerHTML += tableRowHTML;
        });
    }

    calculateAndRender();
});