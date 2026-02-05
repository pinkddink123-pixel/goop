const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

app.post("/checkcard", async (req, res) => {
    try {
        const { card_number, pin } = req.body;

        if (!card_number || !pin) {
            return res.status(400).json({
                error: "Missing card_number or pin"
            });
        }

        // BODY MUST BE JSON (not XML)
        const jsonBody = {
            card_number: card_number,
            pin: pin
        };

        // Send JSON body with XML header (yes, this is correct)
        const response = await axios.post(
            "https://www.daveandbusters.com/content/dnb-request/datadetails.json?mode=cardBalance",
            jsonBody,
            {
                headers: {
                    "Content-Type": "application/xml",     // D&B expects this fake header
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

app.listen(3000, () => {
    console.log("Server running on port 3000");
});
