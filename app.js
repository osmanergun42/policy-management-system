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
                <!-- Geri Butonu -->
                <button id="back-button-add-policy" class="back-button">Geri</button>
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

    // Poliçeleri Modal Penceresinde Gösterme
    function renderPoliciesModal() {
        const policiesListContainer = document.getElementById("policies-list");
        const allPolicies = Object.entries(policies)
            .flatMap(([customerName, customerPolicies]) => 
                customerPolicies.map(policy => ({ ...policy, customerName }))
            );

        policiesListContainer.innerHTML = `
            <table>
                <thead>
                    <tr>
                        <th>Müşteri Adı</th>
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
                    ${allPolicies.map(policy => `
                        <tr>
                            <td>${policy.customerName}</td>
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

        policiesModal.style.display = "flex";
    }

    // Poliçe Listesini Render Etme
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
