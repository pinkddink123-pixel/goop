const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Health check (optional but very helpful)
app.get("/", (req, res) => {
    res.json({ status: "ok" });
});

// Main endpoint
app.post("/checkcard", async (req, res) => {
    try {
        const { card_number, pin } = req.body;

        if (!card_number || !pin) {
            return res.status(400).json({
                error: "Missing card_number or pin"
            });
        }

        const jsonBody = {
            card_number,
            pin
        };

        const response = await axios.post(
            "https://www.daveandbusters.com/content/dnb-request/datadetails.json?mode=cardBalance",
            jsonBody,
            {
                headers: {
                    "Content-Type": "application/xml", // yes, this is intentional
                    "Accept": "*/*",
                    "Origin": "https://www.daveandbusters.com",
                    "Referer": "https://www.daveandbusters.com/us/en/power-up/power-cards",
                    "Accept-Language": "en-US,en;q=0.9"
                }
            }
        );

        res.json(response.data);

    } catch (err) {
        console.error("D&B API ERROR:", err.response?.data || err.message);

        res.status(500).json({
            error: "API request failed",
            details: err.response?.data || err.message
        });
    }
});

// 🚨 THIS IS THE CRITICAL FIX 🚨
const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
