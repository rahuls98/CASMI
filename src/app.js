const express = require("express");
const app = express();
const YAML = require("yamljs");
const swaggerUi = require("swagger-ui-express");

app.use(
    "/docs",
    swaggerUi.serve,
    swaggerUi.setup(YAML.load("/Users/rahuls98/dev/Personal/exl-hack/src/swagger-config.yml"))
);
app.use("/api/v1/files", require("./apis/files/routes"));
app.use("/api/v1/providers", require("./apis/providers/routes"));
app.use("/api/v1/stores", require("./apis/stores/routes"));

app.listen(8000, () => {
    console.log("Server listening on 8000!");
});
