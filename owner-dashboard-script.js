document.addEventListener('DOMContentLoaded', () => {
    // 1. Get Logged In User & All Data from "Database"
    const loggedInUser = JSON.parse(sessionStorage.getItem('loggedInUser'));
    const allUsers = JSON.parse(localStorage.getItem('omaku_users'));
    const allDeals = JSON.parse(localStorage.getItem('omaku_deals'));

    // Security check - only run for admin
    if (!loggedInUser || loggedInUser.role !== 'admin' || !allUsers || !allDeals) {
        return; 
    }

    // 2. Calculate Global KPIs
    const totalRevenue = allDeals
        .filter(deal => deal.status === 'Delivered')
        .reduce((sum, deal) => sum + deal.value, 0);

    const newLeadsCount = allDeals
        .filter(deal => deal.status === 'New Leads').length;
    
    const ordersInProgressCount = allDeals
        .filter(deal => deal.status === 'Won' || deal.status === 'On Delivery').length;

    const totalPartnersCount = allUsers
        .filter(user => user.role === 'partner').length;

    // 3. Update KPI Cards
    document.getElementById('total-revenue').textContent = `$${totalRevenue.toLocaleString()}`;
    document.getElementById('new-leads').textContent = newLeadsCount;
    document.getElementById('orders-in-progress').textContent = ordersInProgressCount;
    document.getElementById('total-partners').textContent = totalPartnersCount;

    // 4. Update Sales Funnel Visual
    document.getElementById('funnel-leads').textContent = allDeals.filter(d => d.status === 'New Leads').length;
    document.getElementById('funnel-quotes').textContent = allDeals.filter(d => d.status === 'Quotes Sent').length;
    document.getElementById('funnel-orders').textContent = allDeals.filter(d => d.status === 'Won').length;
    document.getElementById('funnel-delivered').textContent = allDeals.filter(d => d.status === 'Delivered').length;

    // 5. Update Activity Lists
    const ordersList = document.getElementById('orders-list');
    const partnersList = document.getElementById('partners-list');
    
    // Populate Orders Requiring Action
    const activeOrders = allDeals
        .filter(deal => deal.status === 'Won' || deal.status === 'On Delivery')
        .slice(0, 4); // Show latest 4

    ordersList.innerHTML = ''; // Clear static content
    activeOrders.forEach(deal => {
        const statusClass = deal.status === 'Won' ? 'status-pending' : 'status-delivery';
        const statusText = deal.status === 'Won' ? 'Pending Delivery' : 'On Delivery';
        ordersList.innerHTML += `
            <li class="flex justify-between py-2 border-b border-gray-200">
                <span>#DEAL-${deal.id}</span>
                <span class="status ${statusClass}">${statusText}</span>
            </li>
        `;
    });

    // Populate Recent Partner Signups
    const recentPartners = allUsers
        .filter(user => user.role === 'partner')
        .slice(0, 4); // Show latest 4

    partnersList.innerHTML = ''; // Clear static content
    recentPartners.forEach(partner => {
        partnersList.innerHTML += `
            <li class="flex justify-between py-2 border-b border-gray-200">
                <span>${partner.name}</span>
                <span class="text-gray-500">Joined Sep 2025</span>
            </li>
        `;
    });
});