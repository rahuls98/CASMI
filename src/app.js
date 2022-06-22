const express = require("express");
const app = express();

app.use("/aws", require("./modules/aws/routes"));
app.use("/azure", require("./modules/azure/routes"));
app.use("/gcp", require("./modules/gcp/routes"));

app.listen(8000, () => {
    console.log("Server listening on 8000!");
});
