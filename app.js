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
    const searchSuggestions = document.getElementById("search-suggestions");

    const addPolicyModal = document.getElementById("add-policy-modal");
    const closeAddPolicyModal = document.getElementById("close-add-policy-modal");
    const openAddPolicyModalBtn = document.getElementById("open-add-policy-modal");

    const editPolicyModal = document.getElementById("edit-policy-modal");
    const closeEditPolicyModal = document.getElementById("close-edit-policy-modal");

    const searchResultsModal = document.getElementById("search-results-modal");
    const closeSearchResultsModal = document.getElementById("close-search-results-modal");

    const backButton = document.getElementById("back-button");

    const addCustomerModal = document.getElementById("add-customer-modal");
    const closeAddCustomerModal = document.getElementById("close-add-customer-modal");
    const openAddCustomerModalBtn = document.getElementById("open-add-customer-modal");

    // Modal Açma ve Kapatma
    openAddPolicyModalBtn.addEventListener("click", () => {
        addPolicyModal.style.display = "flex";
    });

    closeAddPolicyModal.addEventListener("click", () => {
        addPolicyModal.style.display = "none";
    });

    openAddCustomerModalBtn.addEventListener("click", () => {
        addCustomerModal.style.display = "flex";
    });

    closeAddCustomerModal.addEventListener("click", () => {
        addCustomerModal.style.display = "none";
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
        if (event.target === addCustomerModal) {
            addCustomerModal.style.display = "none";
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

    // Sidebar Arama Butonu
    sidebarSearchBtn.addEventListener("click", () => {
        performSearch(sidebarSearchInput.value.toLowerCase());
    });

    // Arama Kutusu Etkinlikleri
    sidebarSearchInput.addEventListener("input", () => {
        const searchTerm = sidebarSearchInput.value.toLowerCase();
        if (searchTerm) {
            const suggestions = customers.filter(customer =>
                customer.name.toLowerCase().includes(searchTerm)
            );
            renderSuggestions(suggestions);
        } else {
            searchSuggestions.innerHTML = '';
        }
    });

    // Arama İşlevi (Büyük-Küçük Harf Hassasiyetini Kaldırdık)
    function performSearch(searchTerm) {
        const lowerCasedSearchTerm = searchTerm.toLowerCase();
        const filteredCustomers = customers.filter(customer => 
            customer.name.toLowerCase().includes(lowerCasedSearchTerm) || 
            (policies[customer.name] && policies[customer.name].some(policy => 
                policy.licensePlate.toLowerCase().includes(lowerCasedSearchTerm)
            ))
        );

        if (filteredCustomers.length > 0) {
            renderSearchResults(filteredCustomers);
        } else {
            alert("Müşteri veya plaka bulunamadı!");
        }
    }

    // Önerileri Render Etme
    function renderSuggestions(suggestions) {
        searchSuggestions.innerHTML = suggestions.map(customer => `
            <div class="suggestion-item">${customer.name}</div>
        `).join('');
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
        const customerListBody = document.getElementById('customer-list-body');
        customerListBody.innerHTML = filteredCustomers.map((customer, index) => `
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
        `).join('');

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
                    <input type="text" id="calculated-commission" placeholder="
