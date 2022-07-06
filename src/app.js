const express = require("express");
const app = express();
const swaggerUi = require("swagger-ui-express");

app.use("/docs", swaggerUi.serve, swaggerUi.setup(require("./swagger-config.json")));

app.use("/api/v1/files", require("./apis/files/routes"));
app.use("/api/v1/folders", require("./apis/folders/routes"));
app.use("/api/v1/providers", require("./apis/providers/routes"));
app.use("/api/v1/spaces", require("./apis/spaces/routes"));
app.use("/api/v1/stores", require("./apis/stores/routes"));
app.use("/api/v1/users", require("./apis/users/routes"));

app.listen(8000, () => {
    console.log("Server listening on 8000!\n");
});
