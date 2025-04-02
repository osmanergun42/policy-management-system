document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("add-policy-form");
    const premiumInput = document.getElementById("premium");
    const commissionRateInput = document.getElementById("commission-rate");
    const commissionOutput = document.getElementById("calculated-commission");

    function updateCommission() {
        const premium = parseFloat(premiumInput.value) || 0;
        const rate = parseFloat(commissionRateInput.value) || 0;
        const commission = (premium * rate) / 100;
        commissionOutput.value = commission.toFixed(2);
    }

    premiumInput.addEventListener("input", updateCommission);
    commissionRateInput.addEventListener("input", updateCommission);

    form.addEventListener("submit", (e) => {
        e.preventDefault();

        // Modal zaten varsa kaldır
        const existingModal = document.getElementById("customer-modal-overlay");
        if (existingModal) existingModal.remove();

        const customerModal = document.createElement("div");
        customerModal.id = "customer-modal-overlay";
        customerModal.innerHTML = `
        <div style="position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.5);display:flex;align-items:center;justify-content:center;z-index:1000;">
            <div style="background:#fff;padding:20px;border-radius:10px;max-width:400px;width:100%;">
                <h3>Müşteri Bilgileri</h3>
                <label>Ad Soyad (zorunlu):</label>
                <input type="text" id="modal-customer-name" required style="width:100%;margin-bottom:10px;" />
                <label>T.C. No:</label>
                <input type="text" id="modal-customer-tc" style="width:100%;margin-bottom:10px;" />
                <label>Telefon:</label>
                <input type="text" id="modal-customer-phone" style="width:100%;margin-bottom:10px;" />
                <label>Ek Bilgi:</label>
                <textarea id="modal-customer-extra" rows="3" style="width:100%;margin-bottom:10px;"></textarea>
                <div style="text-align:right;">
                    <button id="modal-cancel">İptal</button>
                    <button id="modal-save">Kaydet</button>
                </div>
            </div>
        </div>
        `;
        document.body.appendChild(customerModal);

        document.getElementById("modal-cancel").onclick = () => {
            document.body.removeChild(customerModal);
        };

        document.getElementById("modal-save").onclick = () => {
            const customerName = document.getElementById("modal-customer-name").value.trim().replace(/\s+/g, " ");
            const tc = document.getElementById("modal-customer-tc").value.trim();
            const phone = document.getElementById("modal-customer-phone").value.trim();
            const extra = document.getElementById("modal-customer-extra").value.trim();

            if (!customerName || customerName.length < 3) {
                alert("Geçerli bir müşteri adı girin (en az 3 karakter).");
                return;
            }

            const policyId = `${customerName}_${Date.now()}`;
            const policy = {
                id: policyId,
                type: document.getElementById("policy-type").value,
                startDate: document.getElementById("start-date").value,
                endDate: document.getElementById("end-date").value,
                premium: parseFloat(document.getElementById("premium").value),
                commissionRate: parseFloat(document.getElementById("commission-rate").value),
                calculatedCommission: parseFloat(document.getElementById("calculated-commission").value),
                policyNumber: document.getElementById("policy-number").value,
                licensePlate: document.getElementById("license-plate").value,
                registrationNumber: document.getElementById("registration-number").value,
                company: document.getElementById("company-dropdown").value,
                policyOwner: document.getElementById("policy-owner").value,
                externalAgency: document.getElementById("external-agency").value,
                isCancelled: document.getElementById("cancel-policy").checked,
                customerInfo: {
                    phone,
                    tc,
                    extraInfo: extra
                }
            };

            // Poliçe kaydı
            const policies = JSON.parse(localStorage.getItem("policies")) || {};
            if (!policies[customerName]) policies[customerName] = [];
            policies[customerName].push(policy);
            localStorage.setItem("policies", JSON.stringify(policies));

            // Kimin müşterisi kaydı
            const kiminMusterisiMap = JSON.parse(localStorage.getItem("kiminMusterisiMap")) || {};
            if (!kiminMusterisiMap[policy.policyOwner]) kiminMusterisiMap[policy.policyOwner] = [];
            kiminMusterisiMap[policy.policyOwner].push({ customerName, policyId });
            localStorage.setItem("kiminMusterisiMap", JSON.stringify(kiminMusterisiMap));

            // Dış acente kaydı
            const disAcenteMap = JSON.parse(localStorage.getItem("disAcenteMap")) || {};
            if (!disAcenteMap[policy.externalAgency]) disAcenteMap[policy.externalAgency] = [];
            disAcenteMap[policy.externalAgency].push({ customerName, policyId });
            localStorage.setItem("disAcenteMap", JSON.stringify(disAcenteMap));

            alert("Poliçe başarıyla eklendi!");
            document.body.removeChild(customerModal);
          
        };
    });
});
