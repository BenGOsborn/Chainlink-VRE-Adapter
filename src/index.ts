import express from "express";
import DockerUtils, { version, VERSIONS } from "./docker";

// Initialize clients
const dockerUtils = new DockerUtils({ socketPath: "/var/run/docker.sock" }); // This socket needs to be exposed to the container this is run in to interact with Docker
const app = express();
app.use(express.json());

app.get("/execute", async (req, res) => {
    // Get the data from the body and check that it is valid
    const { version, packages, code }: { version: version; packages: string[]; code: string } = req.body;
    if (!version) return res.status(400).send("Missing version");
    if (Object.keys(VERSIONS).filter((vsion) => vsion === version).length === 0)
        return res.status(400).send(`Invalid version. Valid versions are ${Object.keys(VERSIONS)}`);
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}...`);
});
