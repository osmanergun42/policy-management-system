document.addEventListener("DOMContentLoaded", () => {
    const toggleSidebarBtn = document.getElementById("toggle-sidebar-btn");
    const sidebar = document.getElementById("sidebar");

    toggleSidebarBtn.addEventListener("click", () => {
        sidebar.classList.toggle("closed");
        document.querySelector(".main-content").classList.toggle("expanded");
    });

    const customers = JSON.parse(localStorage.getItem("customers")) || [];
    const policies = JSON.parse(localStorage.getItem("policies")) || {};

    const companies = [
        "Ak Sigorta", "Unico Sigorta", "Anadolu", "Koru", "Corpus", "Ankara", "Hepiyi", "Doğa", 
        "Şeker", "Bereket", "Ray", "Sompo", "Türkiye", "AXA", "Allianz", "HDI", "Neova"
    ];

    const addCustomerForm = document.getElementById("add-customer-form");
    const customerNameInput = document.getElementById("customer-name");
    const customerPhoneInput = document.getElementById("customer-phone");
    const customerEmailInput = document.getElementById("customer-email");
    const customerAddressInput = document.getElementById("customer-address");
    const customerExtraInfoInput = document.getElementById("customer-extra-info");

    const sidebarSearchBtn = document.getElementById("sidebar-search-btn");
    const sidebarSearchInput = document.getElementById("sidebar-search-input");

    const addPolicyModal = document.getElementById("add-policy-modal");
    const closeAddPolicyModal = document.getElementById("close-add-policy-modal");
    const openAddPolicyModalBtn = document.getElementById("open-add-policy-modal");

    const editPolicyModal = document.getElementById("edit-policy-modal");
    const closeEditPolicyModal = document.getElementById("close-edit-policy-modal");

    const searchResultsModal = document.getElementById("search-results-modal");
    const closeSearchResultsModal = document.getElementById("close-search-results-modal");

    const backButton = document.getElementById("back-button");

    // Modal Açma ve Kapatma
    openAddPolicyModalBtn.addEventListener("click", () => {
        addPolicyModal.style.display = "flex";
    });

    closeAddPolicyModal.addEventListener("click", () => {
        addPolicyModal.style.display = "none";
    });

    closeEditPolicyModal.addEventListener("click", () => {
        editPolicyModal.style.display = "none";
    });

    closeSearchResultsModal.addEventListener("click", () => {
        searchResultsModal.style.display = "none";
    });

    window.addEventListener("click", (event) => {
        if (event.target === addPolicyModal) {
            addPolicyModal.style.display = "none";
        }
        if (event.target === editPolicyModal) {
            editPolicyModal.style.display = "none";
        }
        if (event.target === searchResultsModal) {
            searchResultsModal.style.display = "none";
        }
    });

    // Geri Butonu
    backButton.addEventListener("click", () => {
        history.back();
    });

    // Sidebar'dan Müşteri Ekleme Linki
    const addCustomerLink = document.getElementById("add-customer-link");
    addCustomerLink.addEventListener("click", (event) => {
        event.preventDefault();
        backButton.style.display = "block"; // Geri butonunu göster
        showSection('add-customer-section');
    });

    // Müşteri Ekleme Formu
    addCustomerForm.addEventListener("submit", (event) => {
        event.preventDefault();

        const newCustomer = {
            name: customerNameInput.value,
            phone: customerPhoneInput.value,
            email: customerEmailInput.value || '',
            address: customerAddressInput.value || '',
            extraInfo: customerExtraInfoInput.value || "Ek bilgi yok",
        };

        customers.push(newCustomer);
        saveToLocalStorage("customers", customers);
        addCustomerForm.reset();
        alert("Müşteri başarıyla eklendi!");
        renderCustomerList();
        backButton.click(); // Geri butonuna tıklayarak bir önceki sayfaya dön
    });

    // Sidebar Arama Butonu
    sidebarSearchBtn.addEventListener("click", () => {
        performSearch(sidebarSearchInput.value.toLowerCase());
    });

    // Arama İşlevi
    function performSearch(searchTerm) {
        const filteredCustomers = customers.filter(customer => 
            customer.name.toLowerCase().includes(searchTerm) || 
            (policies[customer.name] && policies[customer.name].some(policy => 
                policy.licensePlate.toLowerCase().includes(searchTerm)
            ))
        );

        if (filteredCustomers.length > 0) {
            renderSearchResults(filteredCustomers);
        } else {
            alert("Müşteri veya plaka bulunamadı!");
        }
    }

    // Ana Sayfa Linki
    const homeLink = document.getElementById("home-link");
    homeLink.addEventListener("click", (event) => {
        event.preventDefault();
        backButton.style.display = "none"; // Geri butonunu gizle
        showSection('main-header');
    });

    // Müşterilerim Linki
    const myCustomersLink = document.getElementById("my-customers-link");
    myCustomersLink.addEventListener("click", (event) => {
        event.preventDefault();
        backButton.style.display = "block"; // Geri butonunu göster
        renderCustomerList();
    });

    // Müşteri Listesini Render Etme
    function renderCustomerList(filteredCustomers = customers) {
        showSection('customer-list-section');
        const customerListSection = document.getElementById('customer-list-section');
        customerListSection.innerHTML = `
            <header>
                <h1>Müşterilerim</h1>
            </header>
            <table>
                <thead>
                    <tr>
                        <th>Müşteri Adı</th>
                        <th>Telefon</th>
                        <th>E-posta</th>
                        <th>Adres</th>
                        <th>İşlem</th>
                    </tr>
                </thead>
                <tbody>
                    ${filteredCustomers.map((customer, index) => `
                        <tr>
                            <td>${customer.name}</td>
                            <td>${customer.phone}</td>
                            <td>${customer.email}</td>
                            <td>${customer.address}</td>
                            <td>
                                <button class="add-policy-btn" data-index="${index}">Poliçe Ekle</button>
                                <button class="view-policies-btn" data-index="${index}">Poliçeler</button>
                                <button class="delete-customer-btn" data-index="${index}">Sil</button>
                            </td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        `;

        document.querySelectorAll(".add-policy-btn").forEach(btn => {
            btn.addEventListener("click", (e) => {
                const customerIndex = e.target.getAttribute("data-index");
                const customer = customers[customerIndex];
                document.getElementById("policy-customer-name").innerText = customer.name;
                document.getElementById("add-policy-section").style.display = "block";
                openAddPolicyModalBtn.click();
            });
        });

        document.querySelectorAll(".view-policies-btn").forEach(btn => {
            btn.addEventListener("click", (e) => {
                const customerIndex = e.target.getAttribute("data-index");
                const customer = customers[customerIndex];
                renderPolicyList(customer);
            });
        });

        document.querySelectorAll(".delete-customer-btn").forEach(btn => {
            btn.addEventListener("click", (e) => {
                const customerIndex = e.target.getAttribute("data-index");
                customers.splice(customerIndex, 1);
                saveToLocalStorage("customers", customers);
                renderCustomerList();
            });
        });
    }

    // Arama Sonuçlarını Render Etme
    function renderSearchResults(filteredCustomers) {
        const searchResultsContainer = document.getElementById("search-results");
        searchResultsContainer.innerHTML = `
            <table>
                <thead>
                    <tr>
                        <th>Müşteri Adı</th>
                        <th>Telefon</th>
                        <th>E-posta</th>
                        <th>Adres</th>
                        <th>İşlem</th>
                    </tr>
                </thead>
                <tbody>
                    ${filteredCustomers.map((customer, index) => `
                        <tr>
                            <td>${customer.name}</td>
                            <td>${customer.phone}</td>
                            <td>${customer.email}</td>
                            <td>${customer.address}</td>
                            <td>
                                <button class="add-policy-btn" data-index="${index}">Poliçe Ekle</button>
                                <button class="view-policies-btn" data-index="${index}">Poliçeler</button>
                            </td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        `;

        document.querySelectorAll(".add-policy-btn").forEach(btn => {
            btn.addEventListener("click", (e) => {
                const customerIndex = e.target.getAttribute("data-index");
                const customer = customers[customerIndex];
                document.getElementById("policy-customer-name").innerText = customer.name;
                document.getElementById("add-policy-section").style.display = "block";
                openAddPolicyModalBtn.click();
            });
        });

        document.querySelectorAll(".view-policies-btn").forEach(btn => {
            btn.addEventListener("click", (e) => {
                const customerIndex = e.target.getAttribute("data-index");
                const customer = customers[customerIndex];
                renderPolicyList(customer);
            });
        });

        searchResultsModal.style.display = "flex";
    }

    // LocalStorage'a Kaydetme
    function saveToLocalStorage(key, data) {
        localStorage.setItem(key, JSON.stringify(data));
    }

    // Otomatik Kaydetme
    setInterval(() => {
        saveToLocalStorage("customers", customers);
        saveToLocalStorage("policies", policies);
        console.log("Veriler otomatik olarak kaydedildi.");
    }, 120000); // 2 dakika

    // Poliçe Ekleme Bölümünü Render Etme
    function renderPolicyAddSection(customer) {
        const mainContent = document.querySelector(".main-content");
        mainContent.innerHTML = `
            <header>
                <h1>${customer.name} için Poliçe Ekle</h1>
            </header>
            <div id="add-policy-section">
                <form id="add-policy-form">
                    <input type="text" id="policy-type" placeholder="Poliçe Tipi" required>
                    <input type="date" id="start-date" required>
                    <input type="date" id="end-date" required>
                    <input type="number" id="premium" placeholder="Prim Miktarı (TL)" min="0" required>
                    <input type="number" id="commission-rate" placeholder="Komisyon Oranı (%)" min="0" max="100" required>
                    <input type="text" id="calculated-commission" placeholder="Hesaplanan Komisyon (TL)" readonly>
                    <input type="text" id="policy-number" placeholder="Poliçe Numarası" required>
                    <input type="text" id="license-plate" placeholder="Plaka" required>
                    <input type="text" id="registration-number" placeholder="Tescil Numarası" required>
                    <select id="company-dropdown" required>
                        <option value="" disabled selected>Şirket Seçin</option>
                        ${companies.map(company => `<option value="${company}">${company}</option>`).join('')}
                    </select>
                    <select id="external-agency" required>
                        <option value="" disabled selected>Dış Acente Seçin</option>
                        <option value="SNR Sigorta">SNR Sigorta</option>
                        <option value="Enes Sigorta">Enes Sigorta</option>
                        <option value="Enter Sigorta">Enter Sigorta</option>
                    </select>
                    <button type="submit">Poliçe Ekle</button>
                </form>
            </div>
        `;

        const premiumInput = document.getElementById("premium");
        const commissionRateInput = document.getElementById("commission-rate");
        const calculatedCommissionInput = document.getElementById("calculated-commission");

        premiumInput.addEventListener("input", calculateCommission);
        commissionRateInput.addEventListener("input", calculateCommission);

        function calculateCommission() {
            const premium = parseFloat(premiumInput.value) || 0;
            const commissionRate = parseFloat(commissionRateInput.value) || 0;
            const commission = (premium * commissionRate) / 100;
            calculatedCommissionInput.value = commission.toFixed(2) + " TL";
        }

        const addPolicyForm = document.getElementById("add-policy-form");
        addPolicyForm.addEventListener("submit", (event) => {
            event.preventDefault();

            const newPolicy = {
                type: document.getElementById("policy-type").value,
                startDate: document.getElementById("start-date").value,
                endDate: document.getElementById("end-date").value,
                premium: parseFloat(document.getElementById("premium").value),
                commissionRate: parseFloat(document.getElementById("commission-rate").value),
                calculatedCommission: ((parseFloat(document.getElementById("premium").value) || 0) *
                    (parseFloat(document.getElementById("commission-rate").value) || 0)) / 100,
                policyNumber: document.getElementById("policy-number").value,
                licensePlate: document.getElementById("license-plate").value,
                registrationNumber: document.getElementById("registration-number").value,
                company: document.getElementById("company-dropdown").value,
                externalAgency: document.getElementById("external-agency").value,
            };

            if (!policies[customer.name]) policies[customer.name] = [];
            policies[customer.name].push(newPolicy);
            saveToLocalStorage("policies", policies);

            alert("Poliçe başarıyla eklendi!");
            renderPolicyList(customer);
        });
    }

    // Poliçe Listesini Render Etme
    function renderPolicyList(customer) {
        showSection('policy-list-section');
        const policyListSection = document.getElementById('policy-list-section');
        const customerPolicies = policies[customer.name] || [];

        policyListSection.innerHTML = `
            <header>
                <h1>${customer.name} için Poliçeler</h1>
            </header>
            <table>
                <thead>
                    <tr>
                        <th>Poliçe Tipi</th>
                        <th>Başlangıç Tarihi</th>
                        <th>Bitiş Tarihi</th>
                        <th>Prim</th>
                        <th>Komisyon (%)</th>
                        <th>Komisyon Tutarı</th>
                        <th>Plaka</th>
                        <th>Şirket</th>
                        <th>Dış Acente</th>
                    </tr>
                </thead>
                <tbody>
                    ${customerPolicies.map(policy => `
                        <tr>
                            <td>${policy.type}</td>
                            <td>${policy.startDate}</td>
                            <td>${policy.endDate}</td>
                            <td>${policy.premium} TL</td>
                            <td>${policy.commissionRate}%</td>
                            <td>${policy.calculatedCommission.toFixed(2)} TL</td>
                            <td>${policy.licensePlate}</td>
                            <td>${policy.company}</td>
                            <td>${policy.externalAgency}</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        `;
    }

    // Bölüm Gösterme Fonksiyonu
    function showSection(sectionId) {
        const sections = document.querySelectorAll('.main-content > div');
        sections.forEach((section) => {
            section.style.display = 'none';
        });
        document.getElementById(sectionId).style.display = 'block';
    }

    // Sayfa Yüklendiğinde Ana Sayfa İçeriğini Göster
    showSection('main-header');
});
