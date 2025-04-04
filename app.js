document.addEventListener("DOMContentLoaded", () => {
    const toggleSidebarBtn = document.getElementById("toggle-sidebar-btn");
    const sidebar = document.getElementById("sidebar");

    toggleSidebarBtn.addEventListener("click", () => {
        sidebar.classList.toggle("closed");
        document.querySelector(".main-content").classList.toggle("expanded");
    });
// Acenteler butonunu ekle
const sidebarNav = document.querySelector("#sidebar nav ul");
const agenciesLink = document.createElement("li");
agenciesLink.innerHTML = '<a href="acenteler.html" id="agencies-link">🏢 Acenteler</a>';
sidebarNav.appendChild(agenciesLink);

// Muhasebe butonunu ekle
const accountingLink = document.createElement("li");
accountingLink.innerHTML = '<a href="muhasebe.html" id="accounting-link">💼 Muhasebe</a>';
sidebarNav.appendChild(accountingLink);

// Poliçelerim butonunu ekle
const policiesLink = document.createElement("li");
policiesLink.innerHTML = '<a href="policelerim.html" id="policies-link">📄 Poliçelerim</a>';
sidebarNav.appendChild(policiesLink);

    

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
    const cancelPolicyCheckbox = document.getElementById("cancel-policy");

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

    function calculateCommission() {
        const premium = parseFloat(premiumInput.value);
        const commissionRate = parseFloat(commissionRateInput.value);
        if (!isNaN(premium) && !isNaN(commissionRate) && isFinite(premium) && isFinite(commissionRate)) {
            const commission = (premium * commissionRate) / 100;
            calculatedCommissionInput.value = commission.toFixed(2); // Hesaplanan komisyonu iki ondalık basamakla göster
        } else {
            calculatedCommissionInput.value = ''; // Geçersiz girişler için komisyon alanını temizle
        }
    }
    

    // Premium ve komisyon oranı girişlerine olay dinleyicileri ekleyin
    premiumInput.setAttribute('min', '-Infinity');
    commissionRateInput.setAttribute('min', '-Infinity');
    premiumInput.addEventListener("input", calculateCommission);
    commissionRateInput.addEventListener("input", calculateCommission);

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
    
    document.addEventListener("DOMContentLoaded", () => {
        const exportButton = document.getElementById("exportButton");
        const dateRangeModal = document.getElementById("date-range-modal");
        const closeDateRangeModal = document.getElementById("close-date-range-modal");
        const dateRangeForm = document.getElementById("date-range-form");
        const exportStartDate = document.getElementById("export-start-date");
        const exportEndDate = document.getElementById("export-end-date");
    
        exportButton.addEventListener("click", () => {
            dateRangeModal.style.display = "flex";
        });
    
        closeDateRangeModal.addEventListener("click", () => {
            dateRangeModal.style.display = "none";
        });
    
        dateRangeForm.addEventListener("submit", (event) => {
            event.preventDefault();
    
            const startDate = new Date(exportStartDate.value);
            const endDate = new Date(exportEndDate.value);
    
            if (startDate > endDate) {
                alert("Başlangıç tarihi bitiş tarihinden büyük olamaz.");
                return;
            }
    
            const selectedPolicies = [];
    
            Object.keys(policies).forEach(customerName => {
                policies[customerName].forEach(policy => {
                    const policyStartDate = new Date(policy.startDate);
    
                    if (policyStartDate >= startDate && policyStartDate <= endDate) {
                        selectedPolicies.push({
                            müşteri: customerName,
                            ...policy
                        });
                    }
                });
            });
    
            if (selectedPolicies.length === 0) {
                alert("Belirtilen tarihler arasında poliçe bulunamadı.");
                return;
            }
    
            const data = [
                ['Müşteri Adı', 'Poliçe Tipi', 'Başlangıç Tarihi', 'Bitiş Tarihi', 'Prim Miktarı', 'Komisyon Oranı', 'Hesaplanan Komisyon', 'Poliçe Numarası', 'Plaka', 'Tescil Numarası', 'Şirket', 'Dış Acente']
            ];
    
            selectedPolicies.forEach(policy => {
                data.push([
                    policy.müşteri, policy.type, policy.startDate, policy.endDate, policy.premium, policy.commissionRate,
                    policy.calculatedCommission, policy.policyNumber, policy.licensePlate, policy.registrationNumber,
                    policy.company, policy.externalAgency
                ]);
            });
    
            const ws = XLSX.utils.aoa_to_sheet(data);
            const wb = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(wb, ws, "Poliçeler");
    
            XLSX.writeFile(wb, "policies.xlsx");
    
            alert("Poliçeler başarıyla policies.xlsx dosyasına aktarıldı.");
            dateRangeModal.style.display = "none";
        });
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
        updateCustomerCount();
    });

    // Müşteri sayısını güncelleme işlevi
    function updateCustomerCount() {
        document.getElementById('total-customers').textContent = customers.length;
    }

    // Sayfa yüklendiğinde müşteri sayısını güncelle
    updateCustomerCount();
    // Poliçe Ekleme Formu Gönderme Etkinliği
    addPolicyForm.addEventListener("submit", (event) => {
        event.preventDefault(); // Formun varsayılan gönderme davranışını durdurma

        const customerName = document.getElementById("policy-customer-name").innerText;
        const policyOwnerDropdown = document.getElementById("customer-owner");
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
            externalAgency: externalAgencyDropdown.value,
            policyOwner: policyOwnerDropdown.value, // 👈 BURASI YENİ
            isCancelled: cancelPolicyCheckbox.checked
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
    const searchTerm = sidebarSearchInput.value.toLowerCase();
    if (searchTerm) {
        performSearch(searchTerm);
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
        searchResultsModal.style.display = "flex"; // Arama sonuçları modal penceresini göster
    } else {
        alert("Müşteri veya plaka bulunamadı!");
    }
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
                            <button class="delete-policy-btn" onclick="deletePolicy('${customer.name}', ${index})">Sil</button>
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
            updateCustomerCount();
        });
    });

    searchResultsModal.style.display = "flex";
}

   // Önerilere Tıklama Etkinliği
searchSuggestions.addEventListener("click", (event) => {
    if (event.target.classList.contains("suggestion-item")) {
        const customerName = event.target.dataset.id;
        const customer = customers.find(c => c.name === customerName);
        if (customer) {
            renderCustomerDetails(customer);
        }
    }
});

// Müşteri Detaylarını Gösteren İşlev
function renderCustomerDetails(customer) {
    const customerListBody = document.getElementById('customer-list-body');
    customerListBody.innerHTML = `
        <tr>
            <td>${customer.name}</td>
            <td>${customer.phone}</td>
            <td>${customer.email}</td>
            <td>${customer.address}</td>
            <td>
                <button class="add-policy-btn" data-index="${customers.indexOf(customer)}">Poliçe Ekle</button>
                <button class="view-policies-btn" data-index="${customers.indexOf(customer)}">Poliçeler</button>
                <button class="delete-customer-btn" data-index="${customers.indexOf(customer)}">Sil</button>
            </td>
        </tr>
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
            renderPolicyListModal(customer);
        });
    });

    document.querySelectorAll(".delete-customer-btn").forEach(btn => {
        btn.addEventListener("click", (e) => {
            const customerIndex = e.target.getAttribute("data-index");
            customers.splice(customerIndex, 1);
            saveToLocalStorage("customers", customers);
            renderCustomerList();
            updateCustomerCount();
        });
    });

    showSection('customer-list-section'); // Müşteri detaylarını içeren bölümü göster
}

// Bölüm Gösterme Fonksiyonu
function showSection(sectionId) {
    const sections = document.querySelectorAll('.main-content > div');
    sections.forEach((section) => {
        section.style.display = 'none';
    });
    document.getElementById(sectionId).style.display = 'block';
}

    // Önerileri Render Etme
    function renderSuggestions(suggestions) {
        searchSuggestions.innerHTML = suggestions.map(customer => `
            <div class="suggestion-item" data-id="${customer.name}">${customer.name}</div>
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
                updateCustomerCount();
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
                        <tr class="${policy.isCancelled ? 'cancelled-policy' : ''}">
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
        document.addEventListener("DOMContentLoaded", () => {
            const filterNameInput = document.getElementById("filter-name");
            const filterPlateInput = document.getElementById("filter-plate");
            const filterStartDateInput = document.getElementById("filter-start-date");
            const applyFilterButton = document.getElementById("apply-filter");
            const policiesListContainer = document.getElementById("policies-list");
        
            applyFilterButton.addEventListener("click", () => {
                const nameFilter = filterNameInput.value.trim().toLowerCase();
                const plateFilter = filterPlateInput.value.trim().toLowerCase();
                const startDateFilter = filterStartDateInput.value ? new Date(filterStartDateInput.value) : null;
        
                const policies = JSON.parse(localStorage.getItem("policies")) || {};
                policiesListContainer.innerHTML = ""; // Listeyi temizle
        
                let foundPolicies = false;
                Object.keys(policies).forEach(customerName => {
                    policies[customerName].forEach(policy => {
                        const policyStartDate = new Date(policy.startDate);
                        const policyName = customerName.toLowerCase();
                        const policyPlate = policy.licensePlate.toLowerCase();
        
                        const nameMatch = !nameFilter || policyName.includes(nameFilter);
                        const plateMatch = !plateFilter || policyPlate.includes(plateFilter);
                        const dateMatch = !startDateFilter || policyStartDate.toDateString() === startDateFilter.toDateString();
        
                        if (nameMatch && plateMatch && dateMatch) {
                            foundPolicies = true;
                            const row = document.createElement("tr");
                            row.innerHTML = `
                                <td>${customerName}</td>
                                <td>${policy.type}</td>
                                <td>${policy.startDate}</td>
                                <td>${policy.endDate}</td>
                                <td>${policy.premium.toFixed(2)} TL</td>
                                <td>${policy.calculatedCommission.toFixed(2)} TL</td>
                                <td>${policy.licensePlate}</td>
                                <td>${policy.company}</td>
                                <td>${policy.isCancelled ? "İptal Edildi" : "Aktif"}</td>
                            `;
                            policiesListContainer.appendChild(row);
                        }
                    });
                    
                });
        
                if (!foundPolicies) {
                    policiesListContainer.innerHTML = `<tr><td colspan="9" style="text-align: center;">Eşleşen poliçe bulunamadı.</td></tr>`;
                }
            });
        });
        

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
                                <button class="delete-policy-btn" onclick="deletePolicy('${customerName}', ${index})">Sil</button>
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
                updateCustomerCount();
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
  
  function getValidNumber(value) {
      return isNaN(parseFloat(value)) ? 0 : parseFloat(value);
        }  

  // Güncel ayın kazancını hesapla ve göster
function updateMonthlyEarnings() {
    const policies = JSON.parse(localStorage.getItem("policies")) || {};
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();
    let monthlyEarnings = 0; // Initialize monthlyEarnings with 0

    Object.keys(policies).forEach(customerName => {
        policies[customerName].forEach(policy => {
            const policyStartDate = new Date(policy.startDate);

            if (policyStartDate.getMonth() === currentMonth && policyStartDate.getFullYear() === currentYear) {
                monthlyEarnings += policy.calculatedCommission;
            }
        });
    });

    document.getElementById("monthly-earnings-amount").textContent = `${monthlyEarnings.toFixed(2)} TL`;
}

// Sayfa yüklendiğinde ve poliçe eklendiğinde kazancı güncelle
updateMonthlyEarnings();
addPolicyForm.addEventListener("submit", () => {
    updateMonthlyEarnings();
});
});
const earningsBtn = document.getElementById("earnings-btn");
    const earningsModal = document.getElementById("earnings-modal");
    const closeEarningsModal = document.getElementById("close-earnings-modal");
    const earningsTableBody = document.querySelector("#earnings-table tbody");

    // Kazançları hesapla ve tabloya ekle
    function updateEarningsTable() {
        const policies = JSON.parse(localStorage.getItem("policies")) || {};
        const earningsByMonth = {};

        // Tüm poliçeleri dolaşarak aylık kazançları hesaplayalım
        Object.keys(policies).forEach(customerName => {
            policies[customerName].forEach(policy => {
                const policyStartDate = new Date(policy.startDate);
                const yearMonth = `${policyStartDate.getFullYear()}-${policyStartDate.getMonth() + 1}`;

                if (!earningsByMonth[yearMonth]) {
                    earningsByMonth[yearMonth] = 0;
                }

                earningsByMonth[yearMonth] += policy.calculatedCommission;
            });
        });

        // Kazançları tabloya ekleyelim
        earningsTableBody.innerHTML = "";
        Object.keys(earningsByMonth).forEach(month => {
            const row = document.createElement("tr");
            row.innerHTML = `<td>${month}</td><td>${earningsByMonth[month].toFixed(2)} TL</td>`;
            earningsTableBody.appendChild(row);
        });
    }

    // Modal açma ve kapama işlemleri
    earningsBtn.addEventListener("click", () => {
        updateEarningsTable();
        earningsModal.style.display = "block";
    });

    closeEarningsModal.addEventListener("click", () => {
        earningsModal.style.display = "none";
    });

    window.addEventListener("click", (event) => {
        if (event.target === earningsModal) {
            earningsModal.style.display = "none";
        }
    });
// İndir Butonu
const exportButton = document.getElementById("exportButton");
const dateRangeModal = document.getElementById("date-range-modal");
const closeDateRangeModal = document.getElementById("close-date-range-modal");
const dateRangeForm = document.getElementById("date-range-form");
const exportStartDate = document.getElementById("export-start-date");
const exportEndDate = document.getElementById("export-end-date");

exportButton.addEventListener("click", () => {
    dateRangeModal.style.display = "flex";
});

closeDateRangeModal.addEventListener("click", () => {
    dateRangeModal.style.display = "none";
});

dateRangeForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const startDate = new Date(exportStartDate.value);
    const endDate = new Date(exportEndDate.value);

    if (startDate > endDate) {
        alert("Başlangıç tarihi bitiş tarihinden büyük olamaz.");
        return;
    }

    const selectedPolicies = [];
    const policies = JSON.parse(localStorage.getItem("policies")) || {}; // Add this line to get policies from localStorage

    Object.keys(policies).forEach(customerName => {
        policies[customerName].forEach(policy => {
            const policyStartDate = new Date(policy.startDate);

            // Poliçe başlangıç tarihi seçilen tarihler arasındaysa
            if (policyStartDate >= startDate && policyStartDate <= endDate) {
                selectedPolicies.push({
                    müşteri: customerName,
                    ...policy
                });
            }
        });
    });

    if (selectedPolicies.length === 0) {
        alert("Belirtilen tarihler arasında poliçe bulunamadı.");
        return;
    }

    const data = [
        ['Müşteri Adı', 'Poliçe Tipi', 'Başlangıç Tarihi', 'Bitiş Tarihi', 'Prim Miktarı', 'Komisyon Oranı', 'Hesaplanan Komisyon', 'Poliçe Numarası', 'Plaka', 'Tescil Numarası', 'Şirket', 'Dış Acente']
    ];

    selectedPolicies.forEach(policy => {
        data.push([
            policy.müşteri, policy.type, policy.startDate, policy.endDate, policy.premium, policy.commissionRate,
            policy.calculatedCommission, policy.policyNumber, policy.licensePlate, policy.registrationNumber,
            policy.company, policy.externalAgency
        ]);
    });

    const ws = XLSX.utils.aoa_to_sheet(data);

    // Sütun genişliklerini ayarla
    ws['!cols'] = [
        { wch: 20 }, // Müşteri Adı
        { wch: 15 }, // Poliçe Tipi
        { wch: 15 }, // Başlangıç Tarihi
        { wch: 15 }, // Bitiş Tarihi
        { wch: 12 }, // Prim Miktarı
        { wch: 18 }, // Komisyon Oranı
        { wch: 20 }, // Hesaplanan Komisyon
        { wch: 15 }, // Poliçe Numarası
        { wch: 10 }, // Plaka
        { wch: 20 }, // Tescil Numarası
        { wch: 15 }, // Şirket
        { wch: 20 }  // Dış Acente
    ];

    // Hücre stillerini ayarla
    const headerStyle = {
        font: { bold: true },
        alignment: { horizontal: 'center' }
    };
    data[0].forEach((header, index) => {
        ws[XLSX.utils.encode_cell({ r: 0, c: index })].s = headerStyle;
    });

    // Negatif komisyon ve iptal durumu kontrolü ve stil uygulaması
    selectedPolicies.forEach((policy, rowIndex) => {
        if (policy.commissionRate < 0 || policy.isCancelled) {
            const cellRange = {
                s: { r: rowIndex + 1, c: 0 }, // Başlangıç hücresi
                e: { r: rowIndex + 1, c: data[0].length - 1 } // Bitiş hücresi
            };

            for (let C = cellRange.s.c; C <= cellRange.e.c; ++C) {
                const cellAddress = XLSX.utils.encode_cell({ r: cellRange.s.r, c: C });
                if (!ws[cellAddress].s) ws[cellAddress].s = {};
                ws[cellAddress].s.fill = {
                    fgColor: { rgb: "FF0000" } // Kırmızı arka plan
                };
            }
        }
    });

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Poliçeler");

    XLSX.writeFile(wb, "policies.xlsx");

    alert("Poliçeler başarıyla policies.xlsx dosyasına indirildi.");
    dateRangeModal.style.display = "none";
});
document.addEventListener("wheel", (event) => {
    window.scrollBy({
        top: event.deltaY, // Mouse wheel delta value determines scroll direction and amount
        behavior: 'smooth'
    });
});
function deletePolicy(customerName, policyIndex) {
    const confirmation = confirm("Bu poliçeyi silmek istediğinize emin misiniz?");
    if (confirmation) {
        let policies = JSON.parse(localStorage.getItem("policies")) || {};
        
        if (policies[customerName]) {
            policies[customerName].splice(policyIndex, 1);
            
            if (policies[customerName].length === 0) {
                delete policies[customerName];
            }
            
            localStorage.setItem("policies", JSON.stringify(policies));
            alert("Poliçe başarıyla silindi!");
            location.reload();
        }
    }
}
