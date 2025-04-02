document.addEventListener("DOMContentLoaded", () => {
    const tableBody = document.getElementById("customer-list-body");
    const searchInput = document.getElementById("search-input");

    // Sağ tıklama menüsü oluştur
    const contextMenu = document.createElement("div");
    contextMenu.id = "custom-context-menu";
    contextMenu.style.position = "absolute";
    contextMenu.style.background = "#fff";
    contextMenu.style.border = "1px solid #ccc";
    contextMenu.style.borderRadius = "6px";
    contextMenu.style.boxShadow = "0 2px 6px rgba(0,0,0,0.2)";
    contextMenu.style.display = "none";
    contextMenu.style.zIndex = "10000";
    document.body.appendChild(contextMenu);

    // Menü dışına tıklanırsa menüyü gizle
    document.addEventListener("click", () => {
        contextMenu.style.display = "none";
    });

    function renderTable(filter = "") {
        tableBody.innerHTML = "";

        const policies = JSON.parse(localStorage.getItem("policies")) || {};
        const entries = Object.entries(policies).filter(([name]) =>
            name.toLowerCase().includes(filter.toLowerCase())
        );

        if (entries.length === 0) {
            tableBody.innerHTML = `
                <tr><td colspan="6" style="text-align: center;">Kayıtlı müşteri bulunamadı.</td></tr>
            `;
            return;
        }

        entries.forEach(([customerName, policyList]) => {
            const latestPolicy = policyList[policyList.length - 1];
            const info = latestPolicy.customerInfo || {};

            const row = document.createElement("tr");
            row.innerHTML = `
                <td oncontextmenu="showContextMenu(event, '${customerName}')" style="cursor: context-menu; color: black;">${customerName}</td>
                <td>${info.phone?.trim() || "-"}</td>
                <td>-</td>
                <td>-</td>
                <td>${info.extraInfo?.trim() || "-"}</td>
                <td></td> <!-- İşlem sütunu kaldırıldı -->
            `;
            tableBody.appendChild(row);
        });
    }

    // Sağ tıklama menüsünü göster
    window.showContextMenu = (event, customerName) => {
        event.preventDefault();

        contextMenu.innerHTML = `
            <div style="padding: 10px; cursor: pointer;" onclick="viewPolicies('${customerName}')">📄 Poliçeler</div>
            <div style="padding: 10px; cursor: pointer;" onclick="addPolicy('${customerName}')">➕ Poliçe Ekle</div>
            <div style="padding: 10px; cursor: pointer;" onclick="editCustomer('${customerName}')">✏️ Düzenle</div>
            <div style="padding: 10px; cursor: pointer; color:red;" onclick="confirmDeleteCustomer('${customerName}')">🗑️ Sil</div>
        `;

        contextMenu.style.top = `${event.pageY}px`;
        contextMenu.style.left = `${event.pageX}px`;
        contextMenu.style.display = "block";
    };

    // Poliçeleri göster (yeni sekmede aç)
    window.viewPolicies = (name) => {
        window.open(`musteripolice.html?name=${encodeURIComponent(name)}`, "_self");
    };

    // Poliçe ekleme işlevi (şimdilik yönlendirme yapılabilir ya da modal açılabilir)
    window.addPolicy = (name) => {
        window.location.href = `musteripoliceekle.html?name=${encodeURIComponent(name)}`;
    };

    window.editCustomer = (oldName) => {
        const policies = JSON.parse(localStorage.getItem("policies")) || {};
        const info = policies[oldName]?.[policies[oldName].length - 1]?.customerInfo || {};

        const modal = document.createElement("div");
        modal.id = "edit-modal";
        modal.innerHTML = `
            <div style="position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.5);display:flex;align-items:center;justify-content:center;z-index:1000;">
                <div style="background:#fff;padding:20px;border-radius:10px;max-width:400px;width:100%;">
                    <h3>Müşteri Bilgilerini Güncelle</h3>
                    <label>Ad Soyad:</label>
                    <input type="text" id="edit-name" value="${oldName}" style="width:100%;margin-bottom:10px;" />
                    <label>Telefon:</label>
                    <input type="text" id="edit-phone" value="${info.phone || ""}" style="width:100%;margin-bottom:10px;" />
                    <label>Ek Bilgi:</label>
                    <textarea id="edit-extra" rows="3" style="width:100%;margin-bottom:10px;">${info.extraInfo || ""}</textarea>
                    <div style="text-align:right;">
                        <button id="edit-cancel">İptal</button>
                        <button id="edit-save">Kaydet</button>
                    </div>
                </div>
            </div>
        `;
        document.body.appendChild(modal);

        document.getElementById("edit-cancel").onclick = () => modal.remove();

        document.getElementById("edit-save").onclick = () => {
            const newName = document.getElementById("edit-name").value.trim();
            const newPhone = document.getElementById("edit-phone").value.trim();
            const newExtra = document.getElementById("edit-extra").value.trim();

            if (!newName) {
                alert("Müşteri adı boş olamaz.");
                return;
            }

            const updatedPolicies = JSON.parse(localStorage.getItem("policies")) || {};
            const currentPolicies = updatedPolicies[oldName] || [];

            currentPolicies.forEach(p => {
                if (p.customerInfo) {
                    p.customerInfo.phone = newPhone;
                    p.customerInfo.extraInfo = newExtra;
                }
            });

            if (newName !== oldName) {
                updatedPolicies[newName] = currentPolicies;
                delete updatedPolicies[oldName];
            }

            localStorage.setItem("policies", JSON.stringify(updatedPolicies));
            modal.remove();
            renderTable(searchInput.value);
        };
    };

    window.confirmDeleteCustomer = (name) => {
        const modal = document.createElement("div");
        modal.id = "delete-modal";
        modal.innerHTML = `
            <div style="position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.5);display:flex;align-items:center;justify-content:center;z-index:1000;">
                <div style="background:#fff;padding:20px;border-radius:10px;max-width:400px;width:100%;text-align:center;">
                    <p><strong>${name}</strong> adlı müşteriyi silmek istiyor musun?</p>
                    <button style="margin-right: 10px;" onclick="document.getElementById('delete-modal').remove()">İptal</button>
                    <button onclick="deleteCustomer('${name}')">Evet, Sil</button>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
    };

    window.deleteCustomer = (name) => {
        const policies = JSON.parse(localStorage.getItem("policies")) || {};
        delete policies[name];
        localStorage.setItem("policies", JSON.stringify(policies));
        document.getElementById("delete-modal")?.remove();
        renderTable(searchInput.value);
    };

    searchInput?.addEventListener("input", () => {
        renderTable(searchInput.value);
    });

    renderTable();
});
