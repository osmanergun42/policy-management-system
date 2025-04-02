document.addEventListener("DOMContentLoaded", () => {
    const customers = JSON.parse(localStorage.getItem("customers")) || {};
    const policies = JSON.parse(localStorage.getItem("policies")) || {};
  
    const totalCustomers = Object.keys(customers).length;
    let totalPolicies = 0;
    let activePolicies = 0;
    const today = new Date();
  
    Object.values(policies).forEach(customerPolicies => {
      totalPolicies += customerPolicies.length;
      customerPolicies.forEach(policy => {
        const endDate = new Date(policy.endDate);
        if (endDate >= today && !policy.isCancelled) {
          activePolicies++;
        }
      });
    });
  
    // Eğer özet alanı varsa
    const totalCustomersSpan = document.getElementById("total-customers");
    const totalPoliciesSpan = document.getElementById("total-policies");
    const activePoliciesSpan = document.getElementById("active-policies");
  
    if (totalCustomersSpan) totalCustomersSpan.textContent = totalCustomers;
    if (totalPoliciesSpan) totalPoliciesSpan.textContent = totalPolicies;
    if (activePoliciesSpan) activePoliciesSpan.textContent = activePolicies;
  
    renderCustomers(customers);
  
    // Arama butonuna tıklama
    document.getElementById("search-button").addEventListener("click", () => {
      searchCustomers(customers);
    });
  
    // Enter ile arama
    document.getElementById("search-input").addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        searchCustomers(customers);
      }
    });
  });
  
  function renderCustomers(customerData) {
    const tbody = document.getElementById("customer-list-body");
    tbody.innerHTML = "";
  
    Object.entries(customerData).forEach(([id, customer]) => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${customer.name}</td>
        <td>${customer.phone}</td>
        <td>${customer.email}</td>
        <td>${customer.address}</td>
        <td>
          <button onclick="editCustomer('${id}')">Düzenle</button>
          <button onclick="deleteCustomer('${id}')">Sil</button>
        </td>
      `;
      tbody.appendChild(tr);
    });
  }
  
  function searchCustomers(allCustomers) {
    const keyword = document.getElementById("search-input").value.toLowerCase();
  
    const filtered = Object.fromEntries(
      Object.entries(allCustomers).filter(([id, c]) =>
        c.name.toLowerCase().includes(keyword) ||
        c.phone.toLowerCase().includes(keyword) ||
        c.email.toLowerCase().includes(keyword) ||
        c.address.toLowerCase().includes(keyword)
      )
    );
  
    renderCustomers(filtered);
  }
  
  // Boş fonksiyonlar (opsiyonel olarak düzenle)
  function editCustomer(id) {
    alert("Düzenle fonksiyonu burada çalışır: " + id);
  }
  
  function deleteCustomer(id) {
    if (confirm("Bu müşteriyi silmek istiyor musunuz?")) {
      const customers = JSON.parse(localStorage.getItem("customers")) || {};
      delete customers[id];
      localStorage.setItem("customers", JSON.stringify(customers));
      renderCustomers(customers);
    }
  }
  