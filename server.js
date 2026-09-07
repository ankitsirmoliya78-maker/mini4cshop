const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(cors());

// Serve static frontend files
app.use(express.static('public'));

// Secure Proxy Endpoint for PHP Supplier API
app.post('/api/buy', async (req, res) => {
    try {
        const { product_id, duration, android_id } = req.body;
        const apiKey = process.env.SUPPLIER_API_KEY; // Environment Variable se secure key uthayega

        if (!apiKey) {
            return res.status(500).json({ success: false, message: 'Server configuration error: API Key missing.' });
        }

        // Supplier PHP Endpoint Request
        const params = new URLSearchParams({
            action: 'buy',
            product_id: product_id,
            duration: duration,
            api_key: apiKey
        });

        if (android_id) {
            params.append('android_id', android_id);
        }

        const apiResponse = await fetch(`https://adminpanels.shop/api/reseller_v1.php?${params.toString()}`);
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
