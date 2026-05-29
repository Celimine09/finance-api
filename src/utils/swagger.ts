import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import { type Express } from "express";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Personal Finance API",
      version: "1.0.0",
      description: "คู่มือ API สำหรับแอปพลิเคชันจัดการการเงิน",
    },
    servers: [
      {
        url: "http://localhost:3000",
        description: "Local server",
      },
    ],
  },
  apis: ["./src/routes/*.ts"],
};

const swaggerSpec = swaggerJSDoc(options);

export const setupSwagger = (app: Express) => {
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
  console.log("📄 Swagger Docs is live at http://localhost:3000/api-docs");
};
