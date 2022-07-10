const dotenv = require("dotenv");
dotenv.config();

module.exports = {
    openapi: "3.0.0",
    info: {
        title: "CASMI APIs",
        description:
            "CASMI - Cloud Agnostic Storage Management Interface\n\nCASMI is a NodeJS solution that enables cloud-agnostic file management. The CASMI server provides access-controlled APIs to interact with file storage services of different cloud providers.\n\nIt currently supports Amazon S3, Google Cloud Storage, and Azure Blob Storage.",
        version: "1.0",
    },
    servers: [{ url: `http://${process.env.BASE_URL}/api/v1` }],
    paths: {
        "/files": {
            get: {
                summary: "Get details of all files",
                description: "Allowed access: [admin, user, guest]",
                tags: ["Files"],
                security: [{ "Bearer token": [] }],
                responses: {
                    200: {
                        description: "Success",
                        content: {
                            "application/json": {
                                schema: {
                                    type: "object",
                                    properties: {
                                        success: { type: "boolean" },
                                        files: {
                                            type: "array",
                                            items: {
                                                type: "object",
                                                properties: {
                                                    id: { type: "integer" },
                                                    name: { type: "string" },
                                                    size: { type: "integer" },
                                                    provider_key: { type: "string" },
                                                    folder_id: { type: "integer" },
                                                    store_id: { type: "integer" },
                                                    space_id: { type: "integer" },
                                                    space: { type: "string" },
                                                    provider_id: { type: "integer" },
                                                    provider: { type: "string" },
                                                },
                                            },
                                        },
                                    },
                                },
                            },
                        },
                    },
                    400: {
                        description: "Client error",
                        content: {
                            "application/json": {
                                schema: {
                                    $ref: "#/components/schemas/ErrorResponse",
                                },
                            },
                        },
                    },
                    401: {
                        description: "Unauthorized",
                        content: {
                            "application/json": {
                                schema: {
                                    $ref: "#/components/schemas/ErrorResponse",
                                },
                            },
                        },
                    },
                    403: {
                        description: "Forbidden",
                        content: {
                            "application/json": {
                                schema: {
                                    $ref: "#/components/schemas/ErrorResponse",
                                },
                            },
                        },
                    },
                    500: {
                        description: "Server error",
                        content: {
                            "application/json": {
                                schema: {
                                    $ref: "#/components/schemas/ErrorResponse",
                                },
                            },
                        },
                    },
                },
            },
        },

        "/files/{id}": {
            get: {
                summary: "Get details of a single file",
                description: "Allowed access: [admin, user, guest]",
                tags: ["Files"],
                security: [{ "Bearer token": [] }],
                parameters: [
                    {
                        in: "path",
                        name: "id",
                        required: true,
                        schema: {
                            type: "integer",
                        },
                        description: "File ID",
                    },
                ],
                responses: {
                    200: {
                        description: "Success",
                        content: {
                            "application/json": {
                                schema: {
                                    type: "object",
                                    properties: {
                                        success: { type: "boolean" },
                                        file: {
                                            type: "object",
                                            properties: {
                                                id: { type: "integer" },
                                                name: { type: "string" },
                                                size: { type: "integer" },
                                                provider_key: { type: "string" },
                                                folder_id: { type: "integer" },
                                                store_id: { type: "integer" },
                                                space_id: { type: "integer" },
                                                space: { type: "string" },
                                                provider_id: { type: "integer" },
                                                provider: { type: "string" },
                                            },
                                        },
                                    },
                                },
                            },
                        },
                    },
                    400: {
                        description: "Client error",
                        content: {
                            "application/json": {
                                schema: {
                                    $ref: "#/components/schemas/ErrorResponse",
                                },
                            },
                        },
                    },
                    401: {
                        description: "Unauthorized",
                        content: {
                            "application/json": {
                                schema: {
                                    $ref: "#/components/schemas/ErrorResponse",
                                },
                            },
                        },
                    },
                    403: {
                        description: "Forbidden",
                        content: {
                            "application/json": {
                                schema: {
                                    $ref: "#/components/schemas/ErrorResponse",
                                },
                            },
                        },
                    },
                    500: {
                        description: "Server error",
                        content: {
                            "application/json": {
                                schema: {
                                    $ref: "#/components/schemas/ErrorResponse",
                                },
                            },
                        },
                    },
                },
            },
        },

        "/files/{id}/download": {
            get: {
                summary: "Download a file",
                description: "Allowed access: [admin, user, guest]",
                tags: ["Files"],
                security: [{ "Bearer token": [] }],
                parameters: [
                    {
                        in: "path",
                        name: "id",
                        required: true,
                        schema: {
                            type: "integer",
                        },
                        description: "File ID",
                    },
                ],
                responses: {
                    200: {
                        description: "File",
                        content: {
                            "application/json": {
                                schema: {
                                    type: "object",
                                    properties: {
                                        success: { type: "boolean" },
                                        download_link: { type: "string" },
                                    },
                                },
                            },
                        },
                    },
                    400: {
                        description: "Client error",
                        content: {
                            "application/json": {
                                schema: {
                                    $ref: "#/components/schemas/ErrorResponse",
                                },
                            },
                        },
                    },
                    401: {
                        description: "Unauthorized",
                        content: {
                            "application/json": {
                                schema: {
                                    $ref: "#/components/schemas/ErrorResponse",
                                },
                            },
                        },
                    },
                    403: {
                        description: "Forbidden",
                        content: {
                            "application/json": {
                                schema: {
                                    $ref: "#/components/schemas/ErrorResponse",
                                },
                            },
                        },
                    },
                    500: {
                        description: "Server error",
                        content: {
                            "application/json": {
                                schema: {
                                    $ref: "#/components/schemas/ErrorResponse",
                                },
                            },
                        },
                    },
                },
            },
        },

        "/files/upload": {
            post: {
                summary: "Upload a file",
                description: "Allowed access: [admin, user]",
                tags: ["Files"],
                security: [{ "Bearer token": [] }],
                requestBody: {
                    required: true,
                    content: {
                        "multipart/form-data": {
                            schema: {
                                type: "object",
                                properties: {
                                    file: {
                                        required: true,
                                        type: "string",
                                        format: "binary",
                                        description: `File size must be below ${process.env.UPLOAD_FILE_MAX_MB} MB!`,
                                    },
                                    store_id: {
                                        required: true,
                                        type: "integer",
                                        description: "ID of an existing store. (Refer /stores)",
                                    },
                                    destination: {
                                        required: true,
                                        type: "string",
                                        description:
                                            "Destination path within the store.\n\nFormat: /path/to/folder\n\nExamples: '/', '/images', '/event/images'",
                                    },
                                },
                            },
                        },
                    },
                },
                responses: {
                    201: {
                        description: "Created new file.",
                        content: {
                            "application/json": {
                                schema: {
                                    type: "object",
                                    properties: {
                                        success: { type: "boolean" },
                                        file_id: { type: "integer" },
                                    },
                                },
                            },
                        },
                    },
                    400: {
                        description: "Client error",
                        content: {
                            "application/json": {
                                schema: {
                                    $ref: "#/components/schemas/ErrorResponse",
                                },
                            },
                        },
                    },
                    401: {
                        description: "Unauthorized",
                        content: {
                            "application/json": {
                                schema: {
                                    $ref: "#/components/schemas/ErrorResponse",
                                },
                            },
                        },
                    },
                    403: {
                        description: "Forbidden",
                        content: {
                            "application/json": {
                                schema: {
                                    $ref: "#/components/schemas/ErrorResponse",
                                },
                            },
                        },
                    },
                    500: {
                        description: "Server error",
                        content: {
                            "application/json": {
                                schema: {
                                    $ref: "#/components/schemas/ErrorResponse",
                                },
                            },
                        },
                    },
                },
            },
        },

        "/folders": {
            get: {
                summary: "Get details of all folders",
                description: "Allowed access: [admin, user]",
                tags: ["Folders"],
                security: [{ "Bearer token": [] }],
                responses: {
                    200: {
                        description: "Success",
                        content: {
                            "application/json": {
                                schema: {
                                    type: "object",
                                    properties: {
                                        success: { type: "boolean" },
                                        folders: {
                                            type: "array",
                                            items: {
                                                type: "object",
                                                properties: {
                                                    id: { type: "integer" },
                                                    provider_key: { type: "string" },
                                                    store_id: { type: "integer" },
                                                    space_id: { type: "integer" },
                                                    space: { type: "string" },
                                                    provider_id: { type: "integer" },
                                                    provider: { type: "string" },
                                                },
                                            },
                                        },
                                    },
                                },
                            },
                        },
                    },
                    400: {
                        description: "Client error",
                        content: {
                            "application/json": {
                                schema: {
                                    $ref: "#/components/schemas/ErrorResponse",
                                },
                            },
                        },
                    },
                    401: {
                        description: "Unauthorized",
                        content: {
                            "application/json": {
                                schema: {
                                    $ref: "#/components/schemas/ErrorResponse",
                                },
                            },
                        },
                    },
                    403: {
                        description: "Forbidden",
                        content: {
                            "application/json": {
                                schema: {
                                    $ref: "#/components/schemas/ErrorResponse",
                                },
                            },
                        },
                    },
                    500: {
                        description: "Server error",
                        content: {
                            "application/json": {
                                schema: {
                                    $ref: "#/components/schemas/ErrorResponse",
                                },
                            },
                        },
                    },
                },
            },
        },

        "/folders/{id}": {
            get: {
                summary: "Get details of a single folder",
                description: "Allowed access: [admin, user]",
                tags: ["Folders"],
                security: [{ "Bearer token": [] }],
                parameters: [
                    {
                        in: "path",
                        name: "id",
                        required: true,
                        schema: {
                            type: "integer",
                        },
                        description: "Folder ID",
                    },
                ],
                responses: {
                    200: {
                        description: "Success",
                        content: {
                            "application/json": {
                                schema: {
                                    type: "object",
                                    properties: {
                                        success: { type: "boolean" },
                                        folder: {
                                            type: "object",
                                            properties: {
                                                id: { type: "integer" },
                                                provider_key: { type: "string" },
                                                store_id: { type: "integer" },
                                                space_id: { type: "integer" },
                                                space: { type: "string" },
                                                provider_id: { type: "integer" },
                                                provider: { type: "string" },
                                            },
                                        },
                                    },
                                },
                            },
                        },
                    },
                    400: {
                        description: "Client error",
                        content: {
                            "application/json": {
                                schema: {
                                    $ref: "#/components/schemas/ErrorResponse",
                                },
                            },
                        },
                    },
                    401: {
                        description: "Unauthorized",
                        content: {
                            "application/json": {
                                schema: {
                                    $ref: "#/components/schemas/ErrorResponse",
                                },
                            },
                        },
                    },
                    403: {
                        description: "Forbidden",
                        content: {
                            "application/json": {
                                schema: {
                                    $ref: "#/components/schemas/ErrorResponse",
                                },
                            },
                        },
                    },
                    500: {
                        description: "Server error",
                        content: {
                            "application/json": {
                                schema: {
                                    $ref: "#/components/schemas/ErrorResponse",
                                },
                            },
                        },
                    },
                },
            },
        },

        "/providers": {
            get: {
                summary: "Get details of all providers",
                description: "Allowed access: [admin, user]",
                tags: ["Providers"],
                security: [{ "Bearer token": [] }],
                responses: {
                    200: {
                        description: "Success",
                        content: {
                            "application/json": {
                                schema: {
                                    type: "object",
                                    properties: {
                                        success: { type: "boolean" },
                                        providers: {
                                            type: "array",
                                            items: {
                                                type: "object",
                                                properties: {
                                                    id: { type: "integer" },
                                                    code: { type: "string" },
                                                    public_name: { type: "string" },
                                                },
                                            },
                                        },
                                    },
                                },
                            },
                        },
                    },
                    400: {
                        description: "Client error",
                        content: {
                            "application/json": {
                                schema: {
                                    $ref: "#/components/schemas/ErrorResponse",
                                },
                            },
                        },
                    },
                    401: {
                        description: "Unauthorized",
                        content: {
                            "application/json": {
                                schema: {
                                    $ref: "#/components/schemas/ErrorResponse",
                                },
                            },
                        },
                    },
                    403: {
                        description: "Forbidden",
                        content: {
                            "application/json": {
                                schema: {
                                    $ref: "#/components/schemas/ErrorResponse",
                                },
                            },
                        },
                    },
                    500: {
                        description: "Server error",
                        content: {
                            "application/json": {
                                schema: {
                                    $ref: "#/components/schemas/ErrorResponse",
                                },
                            },
                        },
                    },
                },
            },
            post: {
                summary: "Add a new provider",
                description: "Allowed access: [admin]",
                tags: ["Providers"],
                security: [{ "Bearer token": [] }],
                requestBody: {
                    required: true,
                    description:
                        "[code]: 3 letter unique code for the cloud provider\n\n[public_name]: Complete name of the cloud provider",
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    code: { type: "string" },
                                    public_name: { type: "string" },
                                },
                            },
                        },
                    },
                },
                responses: {
                    201: {
                        description: "Created new provider.",
                        content: {
                            "application/json": {
                                schema: {
                                    type: "object",
                                    properties: {
                                        success: { type: "boolean" },
                                        provider_id: { type: "integer" },
                                    },
                                },
                            },
                        },
                    },
                    400: {
                        description: "Client error",
                        content: {
                            "application/json": {
                                schema: {
                                    $ref: "#/components/schemas/ErrorResponse",
                                },
                            },
                        },
                    },
                    401: {
                        description: "Unauthorized",
                        content: {
                            "application/json": {
                                schema: {
                                    $ref: "#/components/schemas/ErrorResponse",
                                },
                            },
                        },
                    },
                    403: {
                        description: "Forbidden",
                        content: {
                            "application/json": {
                                schema: {
                                    $ref: "#/components/schemas/ErrorResponse",
                                },
                            },
                        },
                    },
                    500: {
                        description: "Server error",
                        content: {
                            "application/json": {
                                schema: {
                                    $ref: "#/components/schemas/ErrorResponse",
                                },
                            },
                        },
                    },
                },
            },
        },

        "/providers/{id}": {
            get: {
                summary: "Get details of a single provider",
                description: "Allowed access: [admin, user]",
                tags: ["Providers"],
                security: [{ "Bearer token": [] }],
                parameters: [
                    {
                        in: "path",
                        name: "id",
                        required: true,
                        schema: {
                            type: "integer",
                        },
                        description: "Provider ID",
                    },
                ],
                responses: {
                    200: {
                        description: "Success",
                        content: {
                            "application/json": {
                                schema: {
                                    type: "object",
                                    properties: {
                                        success: { type: "boolean" },
                                        provider: {
                                            type: "object",
                                            properties: {
                                                id: { type: "integer" },
                                                code: { type: "string" },
                                                public_name: { type: "string" },
                                            },
                                        },
                                    },
                                },
                            },
                        },
                    },
                    400: {
                        description: "Client error",
                        content: {
                            "application/json": {
                                schema: {
                                    $ref: "#/components/schemas/ErrorResponse",
                                },
                            },
                        },
                    },
                    401: {
                        description: "Unauthorized",
                        content: {
                            "application/json": {
                                schema: {
                                    $ref: "#/components/schemas/ErrorResponse",
                                },
                            },
                        },
                    },
                    403: {
                        description: "Forbidden",
                        content: {
                            "application/json": {
                                schema: {
                                    $ref: "#/components/schemas/ErrorResponse",
                                },
                            },
                        },
                    },
                    500: {
                        description: "Server error",
                        content: {
                            "application/json": {
                                schema: {
                                    $ref: "#/components/schemas/ErrorResponse",
                                },
                            },
                        },
                    },
                },
            },
        },

        "/secrets/template": {
            get: {
                summary: "Get a template for custom secrets",
                description: "Allowed access: [admin]",
                tags: ["Secrets"],
                security: [{ "Bearer token": [] }],
                responses: {
                    200: {
                        description: "Success",
                        content: {
                            "application/json": {
                                schema: {
                                    type: "object",
                                    properties: {
                                        success: { type: "boolean" },
                                        template: { type: "object" },
                                    },
                                },
                            },
                        },
                    },
                },
            },
        },

        "/spaces": {
            get: {
                summary: "Get details of all spaces",
                description: "Allowed access: [admin, user]",
                tags: ["Spaces"],
                security: [{ "Bearer token": [] }],
                responses: {
                    200: {
                        description: "Success",
                        content: {
                            "application/json": {
                                schema: {
                                    type: "object",
                                    properties: {
                                        success: { type: "boolean" },
                                        spaces: {
                                            type: "array",
                                            items: {
                                                type: "object",
                                                properties: {
                                                    id: { type: "integer" },
                                                    name: { type: "string" },
                                                    providers: {
                                                        type: "array",
                                                        items: { type: "string" },
                                                    },
                                                },
                                            },
                                        },
                                    },
                                },
                            },
                        },
                    },
                    400: {
                        description: "Client error",
                        content: {
                            "application/json": {
                                schema: {
                                    $ref: "#/components/schemas/ErrorResponse",
                                },
                            },
                        },
                    },
                    401: {
                        description: "Unauthorized",
                        content: {
                            "application/json": {
                                schema: {
                                    $ref: "#/components/schemas/ErrorResponse",
                                },
                            },
                        },
                    },
                    403: {
                        description: "Forbidden",
                        content: {
                            "application/json": {
                                schema: {
                                    $ref: "#/components/schemas/ErrorResponse",
                                },
                            },
                        },
                    },
                    500: {
                        description: "Server error",
                        content: {
                            "application/json": {
                                schema: {
                                    $ref: "#/components/schemas/ErrorResponse",
                                },
                            },
                        },
                    },
                },
            },
            post: {
                summary: "Create a new space",
                description: "Allowed access: [admin]",
                tags: ["Spaces"],
                security: [{ "Bearer token": [] }],
                requestBody: {
                    required: true,
                    description:
                        "[name]: Unique name for the space\n\n[provider_ids]: List of provider ids to associate the space with (Refer /providers)\n\n[default_secrets]: 'true' to use default provider secrets | 'false' to provide custom provider secrets\n\n[secrets]: Custom cloud provider secrets (Refer /secrets/template)",
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    name: { type: "string" },
                                    provider_ids: {
                                        type: "array",
                                        items: {
                                            type: "integer",
                                        },
                                        minItems: 1,
                                    },
                                    default_secrets: { type: "boolean" },
                                    secrets: { type: "object" },
                                },
                            },
                        },
                    },
                },
                responses: {
                    201: {
                        description: "Created new space.",
                        content: {
                            "application/json": {
                                schema: {
                                    type: "object",
                                    properties: {
                                        success: { type: "boolean" },
                                        space_id: { type: "integer" },
                                    },
                                },
                            },
                        },
                    },
                    400: {
                        description: "Client error",
                        content: {
                            "application/json": {
                                schema: {
                                    $ref: "#/components/schemas/ErrorResponse",
                                },
                            },
                        },
                    },
                    401: {
                        description: "Unauthorized",
                        content: {
                            "application/json": {
                                schema: {
                                    $ref: "#/components/schemas/ErrorResponse",
                                },
                            },
                        },
                    },
                    403: {
                        description: "Forbidden",
                        content: {
                            "application/json": {
                                schema: {
                                    $ref: "#/components/schemas/ErrorResponse",
                                },
                            },
                        },
                    },
                    500: {
                        description: "Server error",
                        content: {
                            "application/json": {
                                schema: {
                                    $ref: "#/components/schemas/ErrorResponse",
                                },
                            },
                        },
                    },
                },
            },
        },

        "/spaces/{id}": {
            get: {
                summary: "Get details of a single space",
                description: "Allowed access: [admin, user]",
                tags: ["Spaces"],
                security: [{ "Bearer token": [] }],
                parameters: [
                    {
                        in: "path",
                        name: "id",
                        required: true,
                        schema: {
                            type: "integer",
                        },
                        description: "Space ID",
                    },
                ],
                responses: {
                    200: {
                        description: "Success",
                        content: {
                            "application/json": {
                                schema: {
                                    type: "object",
                                    properties: {
                                        success: { type: "boolean" },
                                        space: {
                                            type: "object",
                                            properties: {
                                                id: { type: "integer" },
                                                name: { type: "string" },
                                                providers: {
                                                    type: "array",
                                                    items: { type: "string" },
                                                },
                                            },
                                        },
                                    },
                                },
                            },
                        },
                    },
                    400: {
                        description: "Client error",
                        content: {
                            "application/json": {
                                schema: {
                                    $ref: "#/components/schemas/ErrorResponse",
                                },
                            },
                        },
                    },
                    401: {
                        description: "Unauthorized",
                        content: {
                            "application/json": {
                                schema: {
                                    $ref: "#/components/schemas/ErrorResponse",
                                },
                            },
                        },
                    },
                    403: {
                        description: "Forbidden",
                        content: {
                            "application/json": {
                                schema: {
                                    $ref: "#/components/schemas/ErrorResponse",
                                },
                            },
                        },
                    },
                    500: {
                        description: "Server error",
                        content: {
                            "application/json": {
                                schema: {
                                    $ref: "#/components/schemas/ErrorResponse",
                                },
                            },
                        },
                    },
                },
            },
        },

        "/stores": {
            get: {
                summary: "Get details of all stores",
                description: "Allowed access: [admin, user]",
                tags: ["Stores"],
                security: [{ "Bearer token": [] }],
                responses: {
                    200: {
                        description: "Success",
                        content: {
                            "application/json": {
                                schema: {
                                    type: "object",
                                    properties: {
                                        success: { type: "boolean" },
                                        stores: {
                                            type: "array",
                                            items: {
                                                type: "object",
                                                properties: {
                                                    id: { type: "integer" },
                                                    file_count: { type: "integer" },
                                                    space_id: { type: "integer" },
                                                    space: { type: "string" },
                                                    provider_id: { type: "integer" },
                                                    provider: { type: "string" },
                                                },
                                            },
                                        },
                                    },
                                },
                            },
                        },
                    },
                    400: {
                        description: "Client error",
                        content: {
                            "application/json": {
                                schema: {
                                    $ref: "#/components/schemas/ErrorResponse",
                                },
                            },
                        },
                    },
                    401: {
                        description: "Unauthorized",
                        content: {
                            "application/json": {
                                schema: {
                                    $ref: "#/components/schemas/ErrorResponse",
                                },
                            },
                        },
                    },
                    403: {
                        description: "Forbidden",
                        content: {
                            "application/json": {
                                schema: {
                                    $ref: "#/components/schemas/ErrorResponse",
                                },
                            },
                        },
                    },
                    500: {
                        description: "Server error",
                        content: {
                            "application/json": {
                                schema: {
                                    $ref: "#/components/schemas/ErrorResponse",
                                },
                            },
                        },
                    },
                },
            },
        },

        "/stores/{id}": {
            get: {
                summary: "Get details of a single store",
                description: "Allowed access: [admin, user]",
                tags: ["Stores"],
                security: [{ "Bearer token": [] }],
                parameters: [
                    {
                        in: "path",
                        name: "id",
                        required: true,
                        schema: {
                            type: "integer",
                        },
                        description: "Store ID",
                    },
                ],
                responses: {
                    200: {
                        description: "Success",
                        content: {
                            "application/json": {
                                schema: {
                                    type: "object",
                                    properties: {
                                        success: { type: "boolean" },
                                        store: {
                                            type: "object",
                                            properties: {
                                                id: { type: "integer" },
                                                file_count: { type: "integer" },
                                                space_id: { type: "integer" },
                                                space: { type: "string" },
                                                provider_id: { type: "integer" },
                                                provider: { type: "string" },
                                            },
                                        },
                                    },
                                },
                            },
                        },
                    },
                    400: {
                        description: "Client error",
                        content: {
                            "application/json": {
                                schema: {
                                    $ref: "#/components/schemas/ErrorResponse",
                                },
                            },
                        },
                    },
                    401: {
                        description: "Unauthorized",
                        content: {
                            "application/json": {
                                schema: {
                                    $ref: "#/components/schemas/ErrorResponse",
                                },
                            },
                        },
                    },
                    403: {
                        description: "Forbidden",
                        content: {
                            "application/json": {
                                schema: {
                                    $ref: "#/components/schemas/ErrorResponse",
                                },
                            },
                        },
                    },
                    500: {
                        description: "Server error",
                        content: {
                            "application/json": {
                                schema: {
                                    $ref: "#/components/schemas/ErrorResponse",
                                },
                            },
                        },
                    },
                },
            },
        },

        "/users/": {
            post: {
                summary: "Create a new user",
                description: "Allowed access: [admin]",
                tags: ["Users"],
                security: [{ "Bearer token": [] }],
                requestBody: {
                    required: true,
                    description:
                        "[name]: Display name\n\n[user_type]: Type of user (admin / user / guest)",
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    username: { type: "string" },
                                    password: { type: "string" },
                                    name: { type: "string" },
                                    user_type: { type: "string" },
                                },
                            },
                        },
                    },
                },
                responses: {
                    201: {
                        description: "Success",
                        content: {
                            "application/json": {
                                schema: {
                                    type: "object",
                                    properties: {
                                        success: { type: "boolean", default: true },
                                        user: {
                                            type: "object",
                                            properties: {
                                                uid: { type: "integer" },
                                                name: { type: "string" },
                                                username: { type: "string" },
                                            },
                                        },
                                    },
                                },
                            },
                        },
                    },
                    400: {
                        description: "Client error",
                        content: {
                            "application/json": {
                                schema: {
                                    $ref: "#/components/schemas/ErrorResponse",
                                },
                            },
                        },
                    },
                    401: {
                        description: "Unauthorized",
                        content: {
                            "application/json": {
                                schema: {
                                    $ref: "#/components/schemas/ErrorResponse",
                                },
                            },
                        },
                    },
                    403: {
                        description: "Forbidden",
                        content: {
                            "application/json": {
                                schema: {
                                    $ref: "#/components/schemas/ErrorResponse",
                                },
                            },
                        },
                    },
                    500: {
                        description: "Server error",
                        content: {
                            "application/json": {
                                schema: {
                                    $ref: "#/components/schemas/ErrorResponse",
                                },
                            },
                        },
                    },
                },
            },
        },

        "/users/login": {
            post: {
                summary: "Login as an existing user",
                tags: ["Users"],
                requestBody: {
                    required: true,
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    username: { type: "string" },
                                    password: { type: "string" },
                                },
                            },
                        },
                    },
                },
                responses: {
                    200: {
                        description: "Success",
                        content: {
                            "application/json": {
                                schema: {
                                    type: "object",
                                    properties: {
                                        success: { type: "boolean", default: true },
                                        user: {
                                            type: "object",
                                            properties: {
                                                uid: { type: "integer" },
                                                name: { type: "string" },
                                                username: { type: "string" },
                                                id_token: { type: "string" },
                                            },
                                        },
                                    },
                                },
                            },
                        },
                    },
                    400: {
                        description: "Client error",
                        content: {
                            "application/json": {
                                schema: {
                                    $ref: "#/components/schemas/ErrorResponse",
                                },
                            },
                        },
                    },
                    500: {
                        description: "Server error",
                        content: {
                            "application/json": {
                                schema: {
                                    $ref: "#/components/schemas/ErrorResponse",
                                },
                            },
                        },
                    },
                },
            },
        },
    },
    components: {
        securitySchemes: {
            "Bearer token": {
                type: "http",
                scheme: "bearer",
                bearerFormat: "JWT",
            },
        },
        schemas: {
            ErrorResponse: {
                type: "object",
                properties: {
                    success: { type: "boolean", default: false },
                    message: { type: "string" },
                },
            },
        },
    },
};
