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

// Sunucuyu başlat
app.listen(port, () => {
    console.log(`Backend API http://localhost:${port} adresinde çalışıyor`);
});
