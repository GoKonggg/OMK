document.addEventListener('DOMContentLoaded', () => {
    // --- AMBIL DATA & ELEMEN ---
    let allDeals = JSON.parse(localStorage.getItem('omaku_deals'));
    const allUsers = JSON.parse(localStorage.getItem('omaku_users'));
    const columnBodies = document.querySelectorAll('.kanban-column-body');
    
    // Elemen Modal
    const modal = document.getElementById('add-deal-modal');
    const addDealBtn = document.getElementById('add-deal-btn');
    const closeModalBtn = document.getElementById('close-modal-btn');
    const addDealForm = document.getElementById('add-deal-form');
    const partnerSelect = document.getElementById('deal-partner');

    if (!allDeals || !allUsers) { console.error('Database not found.'); return; }

    // --- FUNGSI RENDER & UPDATE ---
    function renderBoard() {
        columnBodies.forEach(col => col.innerHTML = '');
        allDeals.forEach(deal => {
            const assignedPartner = allUsers.find(user => user.id === deal.partnerId);
            const partnerName = assignedPartner ? assignedPartner.name : 'Unassigned';
            const cardHTML = `<div class="kanban-card" data-id="${deal.id}"><div class="card-title">${deal.title}</div><div class="card-value">$${deal.value.toLocaleString()}</div><div class="card-meta">Assigned to: ${partnerName}</div></div>`;
            
            let targetColumn;
            switch (deal.status) {
                case 'New Leads': targetColumn = document.getElementById('col-body-leads'); break;
                case 'Quotes Sent': targetColumn = document.getElementById('col-body-quotes'); break;
                case 'Negotiation': targetColumn = document.getElementById('col-body-negotiation'); break;
                case 'Won': case 'Delivered': targetColumn = document.getElementById('col-body-won'); break;
            }
            if(targetColumn) targetColumn.innerHTML += cardHTML;
        });
        updateCounts();
    }

    function updateCounts() {
        document.getElementById('count-leads').textContent = `(${allDeals.filter(d => d.status === 'New Leads').length})`;
        document.getElementById('count-quotes').textContent = `(${allDeals.filter(d => d.status === 'Quotes Sent').length})`;
        document.getElementById('count-negotiation').textContent = `(${allDeals.filter(d => d.status === 'Negotiation').length})`;
        document.getElementById('count-won').textContent = `(${allDeals.filter(d => d.status === 'Won' || d.status === 'Delivered').length})`;
    }

    // --- LOGIKA MODAL ---
    function openModal() {
        // Isi dropdown partner secara dinamis
        partnerSelect.innerHTML = '<option value="">Unassigned</option>'; // Opsi default
        const partners = allUsers.filter(user => user.role === 'partner');
        partners.forEach(partner => {
            partnerSelect.innerHTML += `<option value="${partner.id}">${partner.name}</option>`;
        });
        modal.classList.add('is-open');
    }

    function closeModal() {
        modal.classList.remove('is-open');
        addDealForm.reset(); // Reset form saat ditutup
    }

    addDealBtn.addEventListener('click', openModal);
    closeModalBtn.addEventListener('click', closeModal);
    window.addEventListener('click', (event) => {
        if (event.target === modal) closeModal();
    });

    // --- LOGIKA SUBMIT FORM ---
    addDealForm.addEventListener('submit', (event) => {
        event.preventDefault();
        
        const newDeal = {
            id: new Date().getTime(), // ID unik sederhana
            title: document.getElementById('deal-title').value,
            value: parseInt(document.getElementById('deal-value').value),
            partnerId: parseInt(document.getElementById('deal-partner').value) || null,
            status: document.getElementById('deal-status').value,
            date: new Date().toISOString().split('T')[0] // Tanggal hari ini
        };

        // Tambahkan deal baru ke array dan simpan ke localStorage
        allDeals.push(newDeal);
        localStorage.setItem('omaku_deals', JSON.stringify(allDeals));
        
        // Render ulang board dan tutup modal
        renderBoard();
        closeModal();
        alert('New deal added successfully!');
    });

    // --- INISIALISASI SORTABLEJS ---
    columnBodies.forEach(col => {
        new Sortable(col, {
            group: 'shared',
            animation: 150,
            onEnd: function (evt) {
                const dealId = parseInt(evt.item.dataset.id);
                const newStatus = evt.to.dataset.status;
                const dealToUpdate = allDeals.find(deal => deal.id === dealId);
                if (dealToUpdate) {
                    dealToUpdate.status = newStatus;
                    localStorage.setItem('omaku_deals', JSON.stringify(allDeals));
                    updateCounts();
                }
            },
        });
    });

    // --- RENDER PERTAMA KALI ---
    renderBoard();
});