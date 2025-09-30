document.addEventListener('DOMContentLoaded', () => {
    const allDeals = JSON.parse(localStorage.getItem('omaku_deals'));
    const allUsers = JSON.parse(localStorage.getItem('omaku_users'));

    if (!allDeals || !allUsers) {
        console.error('Database not found.');
        return;
    }

    // --- SETUP DATA DAN CHART ---
    const ctx = document.getElementById('revenueChartCanvas');
    let myRevenueChart; // Variabel untuk menyimpan instance chart

    // 1. Proses data deals menjadi data pendapatan harian untuk bulan September
    const septemberLabels = Array.from({ length: 30 }, (_, i) => i + 1); // Label: 1, 2, 3, ... 30
    const septemberRevenue = Array(30).fill(0); // Data: [0, 0, 0, ... 0]

    allDeals.forEach(deal => {
        if (deal.status === 'Won' || deal.status === 'Delivered') {
            const dealDate = new Date(deal.date).getDate(); // Ambil tanggal (1-31)
            const dayIndex = dealDate - 1; // Array index (0-29)
            if (dayIndex >= 0 && dayIndex < 30) {
                septemberRevenue[dayIndex] += deal.value;
            }
        }
    });

    // --- FUNGSI UNTUK MENG-UPDATE CHART ---
    function updateChart(range) {
        let labels = septemberLabels;
        let data = septemberRevenue;

        if (range === 'first') {
            labels = septemberLabels.slice(0, 15);
            data = septemberRevenue.slice(0, 15);
        } else if (range === 'second') {
            labels = septemberLabels.slice(15);
            data = septemberRevenue.slice(15);
        }

        // Update data chart dan render ulang
        myRevenueChart.data.labels = labels;
        myRevenueChart.data.datasets[0].data = data;
        myRevenueChart.update();
    }

    // --- INISIALISASI CHART AWAL ---
    myRevenueChart = new Chart(ctx, {
        type: 'line', // Ganti tipe menjadi 'line'
        data: {
            labels: septemberLabels,
            datasets: [{
                label: 'Revenue',
                data: septemberRevenue,
                fill: true,
                backgroundColor: 'rgba(220, 53, 69, 0.1)',
                borderColor: 'rgba(220, 53, 69, 1)',
                borderWidth: 2,
                tension: 0.3, // Membuat garis sedikit melengkung
                pointBackgroundColor: 'rgba(220, 53, 69, 1)'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: { y: { beginAtZero: true } },
            plugins: { legend: { display: false } }
        }
    });
    
    // --- EVENT LISTENER UNTUK FILTER ---
    const filterButtons = document.querySelectorAll('#chart-filter-group button');
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Hapus class 'active' dari semua tombol
            filterButtons.forEach(btn => btn.classList.remove('active'));
            // Tambahkan class 'active' ke tombol yang diklik
            button.classList.add('active');
            
            // Panggil fungsi update dengan range dari data-attribut
            const range = button.dataset.range;
            updateChart(range);
        });
    });

    // --- (BAGIAN LAIN TIDAK BERUBAH) ---
    // Logika untuk Top Performing Partners dan Sales Funnel Conversion
    // (copy-paste dari versi sebelumnya, tidak ada perubahan)
    const topPartnersTbody = document.getElementById('top-partners-tbody');
    if (topPartnersTbody) {
        const partnerScores = allUsers.filter(u=>u.role==='partner').map(p=>{const s=allDeals.filter(d=>d.partnerId===p.id&&(d.status==='Won'||d.status==='Delivered')).reduce((sum,d)=>sum+d.value,0);return{name:p.name,score:s}}).sort((a,b)=>b.score-a.score).slice(0,3);
        topPartnersTbody.innerHTML = '';
        partnerScores.forEach(p=>{topPartnersTbody.innerHTML+=`<tr><td class="p-4">${p.name}</td><td class="p-4">$${p.score.toLocaleString()}</td></tr>`});
    }
    const funnelList=document.getElementById('funnel-conversion-list');if(funnelList){const l=allDeals.length,q=allDeals.filter(d=>d.status!=='New Leads').length,o=allDeals.filter(d=>d.status==='Won'||d.status==='Delivered').length,l2q=l>0?q/l*100:0,q2o=q>0?o/q*100:0,ovr=l>0?o/l*100:0;funnelList.innerHTML=`<li class="flex justify-between py-2 border-b"><span>Leads to Quotes</span> <span>${l2q.toFixed(1)}%</span></li><li class="flex justify-between py-2 border-b"><span>Quotes to Orders</span> <span>${q2o.toFixed(1)}%</span></li><li class="flex justify-between py-2 font-bold"><span>Overall Conversion</span> <span>${ovr.toFixed(1)}%</span></li>`}
});