/**
 * OMAKU MOCK DATABASE
 * This file acts as a centralized source of truth for our prototype.
 * It initializes sample data into localStorage if it doesn't already exist.
 */

function initializeDatabase() {
    // Check if data already exists to avoid overwriting it on every page load
    if (localStorage.getItem('omaku_deals')) {
        console.log('Omaku database already initialized.');
        return;
    }

    console.log('Initializing Omaku database with sample data...');

    // --- SAMPLE DATA ---

    const users = [
        { id: 1, name: 'Michael Chen', email: 'partner@omaku.com', password: 'password123', role: 'partner' },
        { id: 2, name: 'Jane Doe', email: 'jane.doe@example.com', password: 'password123', role: 'partner' },
        { id: 3, name: 'David Lee', email: 'david.lee@example.com', password: 'password123', role: 'partner' },
        { id: 4, name: 'Sarah Wilson', email: 'sarah.wilson@example.com', password: 'password123', role: 'partner' },
        { id: 100, name: 'Admin Owner', email: 'admin@omaku.com', password: 'adminpass', role: 'admin' }
    ];

    const deals = [
        // Deals for Michael Chen (partnerId: 1)
        { id: 101, title: 'Interior Project for PT Maju Mundur', value: 5000, status: 'Delivered', partnerId: 1, date: '2025-09-15' },
        { id: 102, title: 'Office Furniture Supply', value: 22000, status: 'Won', partnerId: 1, date: '2025-09-22' },
        { id: 103, title: 'Custom Kitchen Set Project', value: 8500, status: 'Quotes Sent', partnerId: 1, date: '2025-09-25' },

        // Deals for Jane Doe (partnerId: 2)
        { id: 104, title: 'Reseller Furniture Batch #5', value: 12000, status: 'Delivered', partnerId: 2, date: '2025-09-18' },
        { id: 105, title: 'Cafe Interior Setup', value: 9500, status: 'Won', partnerId: 2, date: '2025-09-28' },

        // Deals for David Lee (partnerId: 3)
        { id: 106, title: 'Apartment Furnishing', value: 7500, status: 'Delivered', partnerId: 3, date: '2025-09-20' },

        // Deals for Internal Team / Unassigned (partnerId: 100 or null)
        { id: 107, title: 'Hotel Lobby Renovation', value: 55000, status: 'Negotiation', partnerId: 100, date: '2025-09-26' },
        { id: 108, title: 'New Lead from Website', value: 15000, status: 'New Leads', partnerId: null, date: '2025-09-29' }
    ];

    const suratJalan = [
        { id: 201, sjNumber: 'SJ-202509-001', orderId: 101, clientName: 'PT Maju Mundur', date: '2025-09-15', status: 'Delivered' },
        { id: 202, sjNumber: 'SJ-202509-002', orderId: 104, clientName: 'Reseller Batch #5', date: '2025-09-18', status: 'Delivered' },
        { id: 203, sjNumber: 'SJ-202509-003', orderId: 106, clientName: 'Apartment Furnishing', date: '2025-09-20', status: 'Delivered' },
        { id: 204, sjNumber: 'SJ-202509-004', orderId: 102, clientName: 'Office Furniture Supply', date: '2025-09-23', status: 'On Delivery' },
        { id: 205, sjNumber: 'SJ-202509-005', orderId: 105, clientName: 'Cafe Interior Setup', date: '2025-09-29', status: 'Draft' }
    ];

    // --- Save to localStorage ---
    // We prefix with 'omaku_' to avoid conflicts with other websites
    localStorage.setItem('omaku_users', JSON.stringify(users));
    localStorage.setItem('omaku_deals', JSON.stringify(deals));
    localStorage.setItem('omaku_suratJalan', JSON.stringify(suratJalan));
}

// Run the initialization function immediately when the script is loaded
initializeDatabase();