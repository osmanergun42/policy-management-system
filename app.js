document.addEventListener("DOMContentLoaded", () => {
    const toggleSidebarBtn = document.getElementById("toggle-sidebar-btn");
    const sidebar = document.getElementById("sidebar");

    toggleSidebarBtn.addEventListener("click", () => {
        sidebar.classList.toggle("closed");
        document.querySelector(".main-content").classList.toggle("expanded");
    });

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

    // Müşterilerim butonu
    const myCustomersLink = document.getElementById("my-customers-link"); // my-customers-btn -> my-customers-link
    const customerListSection = document.getElementById("customer-list-section");
    const customerListBody = document.getElementById("customer-list-body");

    // Komisyon hesaplama işlevi
    function calculateCommission() {
        const commissionRate = parseFloat(commissionRateInput.value);
        if (!isNaN(commissionRate)) {
            calculatedCommissionInput.value = commissionRate.toFixed(2); // Hesaplanan komisyonu iki ondalık basamakla göster
        } else {
            calculatedCommissionInput.value = ''; // Geçersiz girişler için komisyon alanını temizle
        }
    }

    // Komisyon oranı girişlerine olay dinleyicileri ekleyin
    commissionRateInput.addEventListener("input", calculateCommission);

    // Müşteri ekleme formunun gönderim işlevi
    addCustomerForm.addEventListener("submit", (event) => {
        event.preventDefault();
        const customerData = {
            name: customerNameInput.value,
            phone: customerPhoneInput.value,
            email: customerEmailInput.value,
            address: customerAddressInput.value,
            extra_info: customerExtraInfoInput.value
        };
        fetch('/api/customers', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(customerData)
        })
        .then(response => response.json())
        .then(data => {
            console.log('Müşteri başarıyla eklendi:', data);
            addCustomerForm.reset();
        })
        .catch(error => console.error('Müşteri eklenirken hata oluştu:', error));
    });

    // Poliçe ekleme formunun gönderim işlevi
    addPolicyForm.addEventListener("submit", (event) => {
        event.preventDefault();
        const policyData = {
            type: policyTypeInput.value,
            start_date: startDateInput.value,
            end_date: endDateInput.value,
            commission_rate: commissionRateInput.value,
            calculated_commission: calculatedCommissionInput.value,
            policy_number: policyNumberInput.value,
            license_plate: licensePlateInput.value,
            registration_number: registrationNumberInput.value,
            company_id: companyDropdown.value,
            external_agency: externalAgencyDropdown.value
        };
        fetch('/api/policies', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(policyData)
        })
        .then(response => response.json())
        .then(data => {
            console.log('Poliçe başarıyla eklendi:', data);
            addPolicyForm.reset();
        })
        .catch(error => console.error('Poliçe eklenirken hata oluştu:', error));
    });

    // Müşterilerim butonu olay dinleyici
    myCustomersLink.addEventListener("click", (event) => {
        event.preventDefault();
        fetch('/api/customers')
        .then(response => response.json())
        .then(data => {
            customerListBody.innerHTML = '';
            data.forEach(customer => {
                const customerItem = document.createElement("tr");
                customerItem.innerHTML = `
                    <td>${customer.name}</td>
                    <td>${customer.phone}</td>
                    <td>${customer.email}</td>
                    <td>${customer.address}</td>
                    <td><button class="delete-customer" data-id="${customer.id}">Sil</button></td>
                `;
                customerListBody.appendChild(customerItem);
            });
            customerListSection.style.display = 'block';
        })
        .catch(error => console.error('Müşteri listesi alınırken hata oluştu:', error));
    });

    // Özet bilgilerini güncelle
    function updateSummary() {
        fetch('/api/summary')
            .then(response => response.json())
            .then(data => {
                document.getElementById('total-customers').textContent = data.total_customers;
                document.getElementById('active-policies').textContent = data.active_policies;
                document.getElementById('total-policies').textContent = data.total_policies;
            })
            .catch(error => console.error('Özet verilerini alırken hata oluştu:', error));
    }

    // Sayfa yüklendiğinde özet bilgilerini güncelle
    updateSummary();

    // Diğer buton işlevleri...
    openAddCustomerModalBtn.addEventListener("click", () => {
        addCustomerModal.classList.add("show");
    });

    closeAddCustomerModal.addEventListener("click", () => {
        addCustomerModal.classList.remove("show");
    });

    openAddPolicyModalBtn.addEventListener("click", () => {
        addPolicyModal.classList.add("show");
    });

    closeAddPolicyModal.addEventListener("click", () => {
        addPolicyModal.classList.remove("show");
    });

    closeEditPolicyModal.addEventListener("click", () => {
        editPolicyModal.classList.remove("show");
    });

    closeSearchResultsModal.addEventListener("click", () => {
        searchResultsModal.classList.remove("show");
    });

    closePoliciesModal.addEventListener("click", () => {
        policiesModal.classList.remove("show");
    });

    backButton.addEventListener("click", () => {
        window.history.back();
    });

    backButtonAddCustomer.addEventListener("click", () => {
        window.history.back();
    });

    backButtonAddPolicy.addEventListener("click", () => {
        window.history.back();
    });

    sidebarSearchBtn.addEventListener("click", () => {
        const query = sidebarSearchInput.value;
        if (query) {
            fetch(`/api/search?query=${query}`)
                .then(response => response.json())
                .then(data => {
                    searchSuggestions.innerHTML = '';
                    data.suggestions.forEach(suggestion => {
                        const suggestionItem = document.createElement("div");
                        suggestionItem.textContent = suggestion;
                        searchSuggestions.appendChild(suggestionItem);
                    });
                })
                .catch(error => console.error('Arama yapılırken hata oluştu:', error));
        }
    });
});
