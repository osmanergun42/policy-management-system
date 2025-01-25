document.addEventListener("DOMContentLoaded", () => {
    // Poliçe verilerini saklamak için örnek veri
    const policies = [];

    // Poliçe listesi öğesini al
    const policyList = document.querySelector("#policy-list tbody");

    // Veri yükleme fonksiyonu
    function loadPolicies() {
        policyList.innerHTML = ''; // Listeyi temizle
        policies.forEach((policy) => {
            const row = document.createElement("tr");

            row.innerHTML = `
                <td>${policy.name}</td>
                <td>${policy.type}</td>
                <td>${policy.startDate}</td>
                <td>${policy.endDate}</td>
                <td>${policy.premium}</td>
                <td><button class="view-details">Detaylar</button></td>
            `;

            // Detay butonuna tıklama işlevselliği ekle
            row.querySelector(".view-details").addEventListener("click", () => {
                alert(`Detaylar: ${policy.name} Sigortası`);
            });

            policyList.appendChild(row);
        });
    }

    // Arama fonksiyonu
    const searchInput = document.querySelector("#search");
    searchInput.addEventListener("input", (event) => {
        const searchTerm = event.target.value.toLowerCase();
        const filteredPolicies = policies.filter((policy) => {
            return policy.name.toLowerCase().includes(searchTerm) ||
                   policy.type.toLowerCase().includes(searchTerm);
        });
        policies.length = 0; // Mevcut verileri sıfırla
        policies.push(...filteredPolicies); // Filtrelenmiş verileri ekle
        loadPolicies(); // Listeyi yeniden yükle
    });

    // Yeni poliçe ekleme modalini göster
    const addPolicyBtn = document.getElementById('add-policy');
    const addPolicyModal = document.getElementById('add-policy-modal');
    const closeModalBtn = document.getElementById('close-modal');

    addPolicyBtn.addEventListener('click', () => {
        addPolicyModal.style.display = "flex"; // Modal'ı aç
    });

    closeModalBtn.addEventListener('click', () => {
        addPolicyModal.style.display = "none"; // Modal'ı kapat
    });

    // Yeni Poliçe Ekleme Formu
    const addPolicyForm = document.getElementById('add-policy-form');
    addPolicyForm.addEventListener('submit', (event) => {
        event.preventDefault();
        
        const policyName = document.getElementById('policy-name').value;
        const policyType = document.getElementById('policy-type').value;
        const startDate = document.getElementById('start-date').value;
        const endDate = document.getElementById('end-date').value;
        const premium = document.getElementById('premium').value;
        const agency = document.getElementById('policy-agency').value; // Acenta seçimi

        const newPolicy = { name: policyName, type: policyType, startDate, endDate, premium, agency };
        policies.push(newPolicy);
        loadPolicies(); // Yeni poliçeyi listeye ekle

        // Formu sıfırla ve modal'ı kapat
        addPolicyForm.reset();
        addPolicyModal.style.display = "none";
    });

    // İlk yükleme
    loadPolicies();
    
    // Sidebar işlevselliği
    const toggleSidebarBtn = document.getElementById('toggle-sidebar-btn');
    const sidebar = document.getElementById('sidebar');

    // Butona tıklama ile sidebar'ı açıp kapat
    toggleSidebarBtn.addEventListener('click', () => {
        sidebar.classList.toggle('open'); // 'open' sınıfını ekle/kaldır
    });
});
