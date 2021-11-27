import express from "express";
import createRequest from "./adapter";

// Initialize clients
const app = express();
app.use(express.json());

// Handle the requests
app.post("/", async (req, res) => {
    createRequest(req.body, (status: any, result: any) => {
        console.log(`Result: ${result}`);
        res.status(status).json(result);
    });
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}...`);
});
