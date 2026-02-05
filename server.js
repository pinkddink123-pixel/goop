const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

// Root route so Railway sees the service as alive
app.get("/", (req, res) => {
    res.send("DNB API is running");
});

// Main card balance route
app.post("/checkcard", async (req, res) => {
    try {
        const { card_number, pin } = req.body;

        if (!card_number || !pin) {
            return res.status(400).json({
                error: "Missing card_number or pin"
            });
        }

        // JSON body (this is correct for D&B)
        const jsonBody = {
            card_number: card_number,
            pin: pin
        };

        const response = await axios.post(
            "https://www.daveandbusters.com/content/dnb-request/datadetails.json?mode=cardBalance",
            jsonBody,
            {
                headers: {
                    "Content-Type": "application/xml",
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

// Dynamic port for Railway + fallback port 3000 for local dev
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log("Server running on port " + PORT);
});
