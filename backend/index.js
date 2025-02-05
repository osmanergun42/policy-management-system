const express = require('express');
const app = express();
const port = 3001; // Backend API için kullanılacak port

// Veritabanı bağlantısı (örneğin MySQL kullanıyorsanız)
const mysql = require('mysql');
const db = mysql.createConnection({
    host: 'localhost',
    user: 'yourusername',
    password: 'yourpassword',
    database: 'yourdatabase'
});

db.connect(err => {
    if (err) {
        console.error('Veritabanına bağlanırken hata oluştu:', err);
    } else {
        console.log('Veritabanına başarıyla bağlanıldı');
    }
});

// Özet verileri için API endpoint
app.get('/api/summary', (req, res) => {
    const summary = {};

    // Toplam Müşteriler
    db.query('SELECT COUNT(*) AS total_customers FROM customers', (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        summary.total_customers = result[0].total_customers;

        // Toplam Yaşayan Poliçe
        db.query("SELECT COUNT(*) AS active_policies FROM policies WHERE status = 'active'", (err, result) => {
            if (err) return res.status(500).json({ error: err.message });
            summary.active_policies = result[0].active_policies;

            // Toplam Poliçe
            db.query('SELECT COUNT(*) AS total_policies FROM policies', (err, result) => {
                if (err) return res.status(500).json({ error: err.message });
                summary.total_policies = result[0].total_policies;

                // Sonuçları döndür
                res.json(summary);
            });
        });
    });
});

// Müşteri ekleme için API endpoint
app.post('/api/customers', (req, res) => {
    const { name, phone, email, address, extra_info } = req.body;
    const query = 'INSERT INTO customers (name, phone, email, address, extra_info) VALUES (?, ?, ?, ?, ?)';
    db.query(query, [name, phone, email, address, extra_info], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: 'Müşteri başarıyla eklendi', customerId: result.insertId });
    });
});

// Poliçe ekleme için API endpoint
app.post('/api/policies', (req, res) => {
    const { type, start_date, end_date, commission_rate, calculated_commission, policy_number, license_plate, registration_number, company_id, external_agency } = req.body;
    const query = 'INSERT INTO policies (type, start_date, end_date, commission_rate, calculated_commission, policy_number, license_plate, registration_number, company_id, external_agency) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
    db.query(query, [type, start_date, end_date, commission_rate, calculated_commission, policy_number, license_plate, registration_number, company_id, external_agency], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: 'Poliçe başarıyla eklendi', policyId: result.insertId });
    });
});

// Sunucuyu başlat
app.listen(port, () => {
    console.log(`Backend API http://localhost:${port} adresinde çalışıyor`);
});
