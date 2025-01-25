document.addEventListener("DOMContentLoaded", () => {
    // Sidebar açma/kapatma
    const toggleSidebarBtn = document.getElementById("toggle-sidebar-btn");
    const sidebar = document.getElementById("sidebar");

    toggleSidebarBtn.addEventListener("click", () => {
        sidebar.classList.toggle("closed");
        document.querySelector(".main-content").classList.toggle("expanded");
    });

    // Müşteriler ve poliçeler için LocalStorage verileri
    const customers = JSON.parse(localStorage.getItem("customers")) || [];
    const policies = JSON.parse(localStorage.getItem("policies")) || {};

    // Müşteri Ekleme Formu
    const addCustomerForm = document.getElementById("add-customer-form");
    const customerNameInput = document.getElementById("customer-name");
    const customerPhoneInput = document.getElementById("customer-phone");
    const customerEmailInput = document.getElementById("customer-email");
    const customerAddressInput = document.getElementById("customer-address");
    const customerExtraInfoInput = document.getElementById("customer-extra-info");

    // Müşteri ekleme işlevi
    addCustomerForm.addEventListener("submit", (event) => {
        event.preventDefault();

        const newCustomer = {
            name: customerNameInput.value,
            phone: customerPhoneInput.value,
            email: customerEmailInput.value,
            address: customerAddressInput.value,
            extraInfo: customerExtraInfoInput.value || "Ek bilgi yok",
        };

        customers.push(newCustomer);
        saveToLocalStorage("customers", customers);
        addCustomerForm.reset();
        alert("Müşteri başarıyla eklendi!");
    });

    // LocalStorage kaydetme işlevi
    function saveToLocalStorage(key, data) {
        localStorage.setItem(key, JSON.stringify(data));
    }

    // Poliçe ekleme arayüzünü oluşturma
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

                    <!-- Şirket Dropdown -->
                    <select id="company-dropdown" required>
                        <option value="" disabled selected>Şirket Seçin</option>
                        <option value="Ak Sigorta">Ak Sigorta</option>
                        <option value="Unico Sigorta">Unico Sigorta</option>
                        <option value="Anadolu">Anadolu</option>
                        <option value="Koru">Koru</option>
                        <option value="Corpus">Corpus</option>
                        <option value="Ankara">Ankara</option>
                        <option value="Hepiyi">Hepiyi</option>
                        <option value="Doğa">Doğa</option>
                        <option value="Şeker">Şeker</option>
                        <option value="Bereket">Bereket</option>
                        <option value="Ray">Ray</option>
                        <option value="Sompo">Sompo</option>
                        <option value="Türkiye">Türkiye</option>
                        <option value="AXA">AXA</option>
                        <option value="Allianz">Allianz</option>
                        <option value="HDI">HDI</option>
                        <option value="Neova">Neova</option>
                    </select>

                    <!-- Dış Acente Dropdown -->
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

        // Komisyon hesaplama
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

        // Poliçe ekleme işlemi
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
            renderPolicyAddSection(customer);
        });
    }

    // Poliçeler listesi gösterme
    function renderPolicyList(customer) {
        const mainContent = document.querySelector(".main-content");
        const customerPolicies = policies[customer.name] || [];

        mainContent.innerHTML = `
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
                    ${customerPolicies
                        .map(
                            (policy) => `
                        <tr>
                            <td>${policy.type}</td>
                            <td>${policy.startDate}</td>
                            <td>${policy.endDate}</td>
                            <td>${policy.premium} TL</td>
                            <td>${policy.commissionRate}%</td>
                            <td>${policy.calculatedCommission} TL</td>
                            <td>${policy.licensePlate}</td>
                            <td>${policy.company}</td>
                            <td>${policy.externalAgency}</td>
                        </tr>
                    `
                        )
                        .join("")}
                </tbody>
            </table>
        `;
    }

    // Müşteri listesi oluşturma
    function renderCustomerList() {
        const mainContent = document.querySelector(".main-content");
        mainContent.innerHTML = `
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
                    ${customers
                        .map(
                            (customer, index) => `
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
                        `
                        )
                        .join("")}
                </tbody>
            </table>
        `;

        document.querySelectorAll(".add-policy-btn").forEach((btn) => {
            btn.addEventListener("click", (e) => {
                const customerIndex = e.target.getAttribute("data-index");
                const customer = customers[customerIndex];
                renderPolicyAddSection(customer);
            });
        });

        document.querySelectorAll(".view-policies-btn").forEach((btn) => {
            btn.addEventListener("click", (e) => {
                const customerIndex = e.target.getAttribute("data-index");
                const customer = customers[customerIndex];
                renderPolicyList(customer);
            });
        });
    }

    // Müşterilerim sayfasını göster
    const myCustomersLink = document.getElementById("my-customers-link");
    myCustomersLink.addEventListener("click", (event) => {
        event.preventDefault();
        renderCustomerList();
    });
});
