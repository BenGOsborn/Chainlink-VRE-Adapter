const fs = require("fs");

(async () => {
    // Load the versions
    const loaded = fs.readFileSync("pyVersions.json");
    const json = JSON.parse(loaded);

    // Generate the install command
    const values = Object.values(json);
    let command = "";
    for (let i = 0; i < values.length; i++) {
        command += `docker pull ${values[i]}`;
        if (i !== values.length - 1) command += " && ";
    }

    // Return the command
    console.log(command);
})()
    .then()
    .catch((error) => console.log(error));
