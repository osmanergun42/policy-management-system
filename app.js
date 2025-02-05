document.addEventListener("DOMContentLoaded", () => {
    const toggleSidebarBtn = document.getElementById("toggle-sidebar-btn");
    const sidebar = document.getElementById("sidebar");

    toggleSidebarBtn.addEventListener("click", () => {
        sidebar.classList.toggle("closed");
        document.querySelector(".main-content").classList.toggle("expanded");
    });

    const customers = JSON.parse(localStorage.getItem("customers")) || [];
    const policies = JSON.parse(localStorage.getItem("policies")) || {};

    const addCustomerForm = document.getElementById("add-customer-form");
    const customerNameInput = document.getElementById("customer-name");
    const customerPhoneInput = document.getElementById("customer-phone");
    const customerEmailInput = document.getElementById("customer-email");
    const customerAddressInput = document.getElementById("customer-address");
    const customerExtraInfoInput = document.getElementById("customer-extra-info");

    const addPolicyForm = document.getElementById("add-policy-form");
    const policyTypeInput = document.getElementById("policy-type");
    const startDateInput = document.getElementById("start-date");
    const endDateInput = document.getElementById("end-date");
    const premiumInput = document.getElementById("premium");
    const commissionRateInput = document.getElementById("commission-rate");
    const calculatedCommissionInput = document.getElementById("calculated-commission");
    const policyNumberInput = document.getElementById("policy-number");
    const licensePlateInput = document.getElementById("license-plate");
    const registrationNumberInput = document.getElementById("registration-number");
    const companyDropdown = document.getElementById("company-dropdown");
    const externalAgencyDropdown = document.getElementById("external-agency");

    const sidebarSearchInput = document.getElementById("sidebar-search-input");
    const sidebarSearchBtn = document.getElementById("sidebar-search-btn");
    const searchSuggestions = document.getElementById("search-suggestions");

    const addPolicyModal = document.getElementById("add-policy-modal");
    const closeAddPolicyModal = document.getElementById("close-add-policy-modal");
    const openAddPolicyModalBtn = document.getElementById("open-add-policy-modal");

    const editPolicyModal = document.getElementById("edit-policy-modal");
    const closeEditPolicyModal = document.getElementById("close-edit-policy-modal");

    const searchResultsModal = document.getElementById("search-results-modal");
    const closeSearchResultsModal = document.getElementById("close-search-results-modal");

    const policiesModal = document.getElementById("policies-modal");
    const closePoliciesModal = document.getElementById("close-policies-modal");

    const backButton = document.getElementById("back-button");
    const backButtonAddCustomer = document.getElementById("back-button-add-customer");
    const backButtonAddPolicy = document.getElementById("back-button-add-policy");

    const addCustomerModal = document.getElementById("add-customer-modal");
    const closeAddCustomerModal = document.getElementById("close-add-customer-modal");
    const openAddCustomerModalBtn = document.getElementById("open-add-customer-modal");
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

    closePoliciesModal.addEventListener("click", () => {
        policiesModal.style.display = "none";
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
        if (event.target === policiesModal) {
            policiesModal.style.display = "none";
        }
    });

    // Geri Butonu
    backButton.addEventListener("click", () => {
        history.back();
    });

    // Müşteri Ekleme Modal Geri Butonu
    backButtonAddCustomer.addEventListener("click", () => {
        addCustomerModal.style.display = "none";
    });

    // Poliçe Ekleme Modal Geri Butonu
    backButtonAddPolicy.addEventListener("click", () => {
        addPolicyModal.style.display = "none";
    });

    // Müşteri Ekleme Formu Gönderme Etkinliği
    addCustomerForm.addEventListener("submit", (event) => {
        event.preventDefault(); // Formun varsayılan gönderme davranışını durdurma

        const newCustomer = {
            name: customerNameInput.value,
            phone: customerPhoneInput.value,
            email: customerEmailInput.value,
            address: customerAddressInput.value,
            extraInfo: customerExtraInfoInput.value
        };

        // Yeni müşteriyi diziye ekleyin
        customers.push(newCustomer);

        // Müşterileri localStorage'a kaydedin
        saveToLocalStorage("customers", customers);

        // Müşteri listesini yeniden oluşturun
        renderCustomerList();

        // Müşteri ekleme formunu sıfırlayın
        addCustomerForm.reset();

        // Müşteri ekleme modal penceresini kapatın
        addCustomerModal.style.display = "none";

        alert("Müşteri başarıyla eklendi!");
    });

    // Poliçe Ekleme Formu Gönderme Etkinliği
    addPolicyForm.addEventListener("submit", (event) => {
        event.preventDefault(); // Formun varsayılan gönderme davranışını durdurma

        const customerName = document.getElementById("policy-customer-name").innerText;
        const newPolicy = {
            type: policyTypeInput.value,
            startDate: startDateInput.value,
            endDate: endDateInput.value,
            premium: parseFloat(premiumInput.value),
            commissionRate: parseFloat(commissionRateInput.value),
            calculatedCommission: parseFloat(calculatedCommissionInput.value),
            policyNumber: policyNumberInput.value,
            licensePlate: licensePlateInput.value,
            registrationNumber: registrationNumberInput.value,
            company: companyDropdown.value,
            externalAgency: externalAgencyDropdown.value
        };

        if (!policies[customerName]) {
            policies[customerName] = [];
        }

        // Yeni poliçeyi müşterinin poliçe listesine ekleyin
        policies[customerName].push(newPolicy);

        // Poliçeleri localStorage'a kaydedin
        saveToLocalStorage("policies", policies);

        // Poliçe ekleme formunu sıfırlayın
        addPolicyForm.reset();

        // Poliçe ekleme modal penceresini kapatın
        addPolicyModal.style.display = "none";

        alert("Poliçe başarıyla eklendi!");
    });
// Arama Kutusu Etkinlikleri
    sidebarSearchInput.addEventListener("input", () => {
        const searchTerm = sidebarSearchInput.value.toLowerCase();
        if (searchTerm) {
            const suggestions = customers.filter(customer =>
                customer.name.toLowerCase().includes(searchTerm) ||
                (policies[customer.name] && policies[customer.name].some(policy =>
                    policy.licensePlate.toLowerCase().includes(searchTerm)
                ))
            );
            renderSuggestions(suggestions);
        } else {
            searchSuggestions.innerHTML = '';
        }
    });

    // Sidebar Arama Butonu
    sidebarSearchBtn.addEventListener("click", () => {
        performSearch(sidebarSearchInput.value.toLowerCase());
    });

    // Önerilere Tıklama Etkinliği
    searchSuggestions.addEventListener("click", (event) => {
        if (event.target.classList.contains("suggestion-item")) {
            const customerName = event.target.textContent;
            const customer = customers.find(c => c.name === customerName);
            if (customer) {
                renderPolicyListModal(customer); // Poliçeler modal penceresinde gösterilecek
            }
        }
    });

    // Önerileri Render Etme
    function renderSuggestions(suggestions) {
        searchSuggestions.innerHTML = suggestions.map(customer => `
            <div class="suggestion-item" data-id="${customer.name}">${customer.name}</div>
        `).join('');
    }

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
        renderCustomerList();
        showSection('customer-list-section');
    });

    // Müşteri Listesi Görüntüleme
    function renderCustomerList() {
        const customerListBody = document.getElementById('customer-list-body');
        customerListBody.innerHTML = customers.map((customer, index) => `
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
                renderPolicyListModal(customer);
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

    // Poliçeleri Modal Penceresinde Gösterme
    function renderPolicyListModal(customer) {
        const policiesListContainer = document.getElementById("policies-list");
        const customerPolicies = policies[customer.name] || [];

        policiesListContainer.innerHTML = `
            <table>
                <thead>
                    <tr>
                        <th>Poliçe Tipi</th>
                        <th>Başlangıç Tarihi</th>
                        <th>Bitiş Tarihi</th>
                        <th>Prim</th>
                        <th>Komisyon Tutarı</th>
                        <th>Plaka</th>
                        <th>Tescil Numarası</th>
                        <th>Şirket</th>
                        <th>Dış Acente</th>
                        <th>İşlem</th>
                    </tr>
                </thead>
                <tbody>
                    ${customerPolicies.map((policy, index) => `
                        <tr>
                            <td>${policy.type}</td>
                            <td>${policy.startDate}</td>
                            <td>${policy.endDate}</td>
                            <td>${policy.premium} TL</td>
                            <td>${policy.calculatedCommission.toFixed(2)} TL</td>
                            <td>${policy.licensePlate}</td>
                            <td>${policy.registrationNumber}</td>
                            <td>${policy.company}</td>
                            <td>${policy.externalAgency}</td>
                            <td>
                                <button class="edit-policy-btn" data-customer="${customer.name}" data-index="${index}">Düzenle</button>
                            </td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        `;

        document.querySelectorAll(".edit-policy-btn").forEach(btn => {
            btn.addEventListener("click", (e) => {
                const customerName = e.target.getAttribute("data-customer");
                const policyIndex = e.target.getAttribute("data-index");
                const policy = policies[customerName][policyIndex];

                document.getElementById("edit-policy-type").value = policy.type;
                document.getElementById("edit-start-date").value = policy.startDate;
                document.getElementById("edit-end-date").value = policy.endDate;
                document.getElementById("edit-premium").value = policy.premium;
                document.getElementById("edit-commission-rate").value = policy.commissionRate;
                document.getElementById("edit-calculated-commission").value = policy.calculatedCommission;
                document.getElementById("edit-license-plate").value = policy.licensePlate;
                document.getElementById("edit-registration-number").value = policy.registrationNumber;

                editPolicyModal.style.display = "flex";

                // Poliçe düzenleme formu gönderme etkinliği
                document.getElementById("edit-policy-form").onsubmit = (event) => {
                    event.preventDefault();

                    policy.type = document.getElementById("edit-policy-type").value;
                    policy.startDate = document.getElementById("edit-start-date").value;
                    policy.endDate = document.getElementById("edit-end-date").value;
                    policy.premium = parseFloat(document.getElementById("edit-premium").value);
                    policy.commissionRate = parseFloat(document.getElementById("edit-commission-rate").value);
                    policy.calculatedCommission = parseFloat(document.getElementById("edit-calculated-commission").value);
                    policy.licensePlate = document.getElementById("edit-license-plate").value;
                    policy.registrationNumber = document.getElementById("edit-registration-number").value;

                    saveToLocalStorage("policies", policies);
                    renderPolicyListModal(customer);

                    editPolicyModal.style.display = "none";
                    alert("Poliçe başarıyla güncellendi!");
                };
            });
        });

        policiesModal.style.display = "flex";
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
                                <button class="delete-customer-btn" data-index="${index}">Sil</button>
                            </td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        `;

        // "Poliçe Ekle", "Poliçeler" ve "Sil" butonlarına tıklama olaylarını ekleyelim
        document.querySelectorAll(".add-policy-btn").forEach(btn => {
            btn.addEventListener("click", (e) => {
                const customerIndex = e.target.getAttribute("data-index");
                const customer = filteredCustomers[customerIndex];
                document.getElementById("policy-customer-name").innerText = customer.name;
                document.getElementById("add-policy-section").style.display = "block";
                openAddPolicyModalBtn.click();
            });
        });

        document.querySelectorAll(".view-policies-btn").forEach(btn => {
            btn.addEventListener("click", (e) => {
                const customerIndex = e.target.getAttribute("data-index");
                const customer = filteredCustomers[customerIndex];
                renderPolicyListModal(customer);
            });
        });

        document.querySelectorAll(".delete-customer-btn").forEach(btn => {
            btn.addEventListener("click", (e) => {
                const customerIndex = e.target.getAttribute("data-index");
                filteredCustomers.splice(customerIndex, 1);
                saveToLocalStorage("customers", filteredCustomers);
                renderSearchResults(filteredCustomers);
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

    // Boşluğa tıklayınca önerileri kapatma
    window.addEventListener("click", (event) => {
        if (!sidebarSearchInput.contains(event.target) && !searchSuggestions.contains(event.target)) {
            searchSuggestions.innerHTML = '';
        }
    });

    // Müşteri listesi varsayılan olarak yüklendiğinde görüntülensin
    renderCustomerList();

    // API'den özet verileri çek ve güncelle
    fetch('/api/summary')
        .then(response => response.json())
        .then(data => {
            document.getElementById('total-customers').textContent = data.total_customers;
            document.getElementById('active-policies').textContent = data.active_policies;
            document.getElementById('total-policies').textContent = data.total_policies;
        })
        .catch(error => console.error('Error fetching summary:', error));
});
