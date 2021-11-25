import Docker from "dockerode";
import express from "express";

// Initialize clients
const docker = new Docker({ socketPath: "/var/run/docker.sock" });
const app = express();
app.use(express.json());

app.get("data", async (req, res) => {});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}...`);
});
