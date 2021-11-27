import express from "express";
import createRequest from "./adapter";
// import DockerUtils, { version, VERSIONS } from "./docker";

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

// const dockerUtils = new DockerUtils({ socketPath: "/var/run/docker.sock" }); // This socket needs to be exposed to the container this is run in to interact with Docker
// app.post("/execute", async (req, res) => {
//     // Get the data from the body and check that it is valid
//     const { version, code, packages }: { version: version; code: string; packages: string[] | undefined } = req.body;
//     if (!version) return res.status(400).send("Missing version");
//     if (Object.keys(VERSIONS).filter((vsion) => vsion === version).length === 0)
//         return res.status(400).send(`Invalid version. Valid versions are ${Object.keys(VERSIONS)}`);
//     if (!code) return res.status(400).send("Missing code to execute");

//     // Check that the version has been pulled
//     try {
//         await dockerUtils.pullImage(version);
//     } catch {
//         return res.sendStatus(500);
//     }

//     // Execute the code
//     try {
//         const response = await dockerUtils.runCode(version, code, packages);
//         return res.status(200).json({ response });
//     } catch {
//         return res.sendStatus(500);
//     }
// });

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}...`);
});
