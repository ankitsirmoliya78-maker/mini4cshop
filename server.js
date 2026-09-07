const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// Serve static frontend files
app.use(express.static('public'));

// Secure Proxy Endpoint for Supplier API
app.post('/api/buy', async (req, res) => {
    try {
        const { product_id, duration, android_id } = req.body;
        const apiKey = process.env.SUPPLIER_API_KEY;

        if (!apiKey) {
            return res.status(500).json({ success: false, message: 'Server configuration error: API Key missing.' });
        }

        // Supplier POST Request Body Setup
        const formData = new URLSearchParams();
        formData.append('api_key', apiKey);
        formData.append('action', 'buy');
        formData.append('product_id', product_id);
        formData.append('duration', duration);

        if (android_id) {
            formData.append('android_id', android_id);
        }

        const apiResponse = await fetch('https://adminpanels.shop/api/reseller_v1.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: formData.toString()
        });

        const data = await apiResponse.json();
        return res.json({ success: true, data: data });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
