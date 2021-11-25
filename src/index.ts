import Docker from "dockerode";
import express from "express";

// Initialize clients
const app = express();
const docker = new Docker({ socketPath: "/var/run/docker.sock" });

app.get("data", async (req, res) => {});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}...`);
});
