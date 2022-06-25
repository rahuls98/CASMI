const express = require("express");
const app = express();

app.use("/api/v1/files", require("./apis/files/routes"));
app.use("/api/v1/stores", require("./apis/stores/routes"));

app.listen(8000, () => {
    console.log("Server listening on 8000!");
});
