document.addEventListener('DOMContentLoaded', () => {
    // --- 1. AMBIL DATA & ELEMEN ---
    const allSuratJalan = JSON.parse(localStorage.getItem('omaku_suratJalan'));
    const sjTableBody = document.getElementById('sj-table-body');
    const searchInput = document.getElementById('search-input');
    const statusFilter = document.getElementById('status-filter');

    if (!allSuratJalan) {
        console.error('Surat Jalan data not found.');
        return;
    }

    // --- 2. FUNGSI UNTUK MERENDER TABEL ---
    // Fungsi ini sekarang bisa menerima data yang sudah difilter
    function renderTable(dataToRender) {
        sjTableBody.innerHTML = ''; // Kosongkan tabel

        if (dataToRender.length === 0) {
            sjTableBody.innerHTML = '<tr><td colspan="6" style="text-align: center; padding: 1rem;">No data matching filters found.</td></tr>';
            return;
        }

        let tableHTML = '';
        dataToRender.forEach(sj => {
            let statusTag = '';
            switch (sj.status) {
                case 'Delivered': statusTag = '<span class="status status-paid">Delivered</span>'; break;
                case 'On Delivery': statusTag = '<span class="status status-delivery">On Delivery</span>'; break;
                case 'Draft': statusTag = '<span class="status status-draft">Draft</span>'; break;
                default: statusTag = `<span class="status status-draft">${sj.status}</span>`;
            }

            tableHTML += `
                <tr>
                    <td>${sj.sjNumber}</td>
                    <td>#DEAL-${sj.orderId}</td>
                    <td>${sj.clientName}</td>
                    <td>${sj.date}</td>
                    <td>${statusTag}</td>
                    <td class="action-buttons">
                        <a href="#" class="btn btn-secondary btn-sm">Details</a>
                        <a href="#" class="btn btn-secondary btn-sm">Print PDF</a>
                    </td>
                </tr>
            `;
        });
        sjTableBody.innerHTML = tableHTML;
    }

    // --- 3. FUNGSI UNTUK MEMFILTER & MERENDER ULANG ---
    function filterAndRender() {
        const searchTerm = searchInput.value.toLowerCase();
        const statusValue = statusFilter.value;

        let filteredData = allSuratJalan;

        // Terapkan filter pencarian
        if (searchTerm) {
            filteredData = filteredData.filter(sj => 
                sj.clientName.toLowerCase().includes(searchTerm) ||
                sj.sjNumber.toLowerCase().includes(searchTerm) ||
                `#deal-${sj.orderId}`.toLowerCase().includes(searchTerm)
            );
        }

        // Terapkan filter status
        if (statusValue) {
            filteredData = filteredData.filter(sj => sj.status === statusValue);
        }

        renderTable(filteredData);
    }

    // --- 4. TAMBAHKAN EVENT LISTENER ---
    searchInput.addEventListener('input', filterAndRender);
    statusFilter.addEventListener('change', filterAndRender);

    // --- 5. RENDER TABEL UNTUK PERTAMA KALI ---
    renderTable(allSuratJalan);
});