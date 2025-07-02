const { createLogger, transports, format } = require("winston");
require("winston-mongodb");
require("dotenv").config(); // Load .env file

const logger = createLogger({
  level: "info",
  format: format.combine(
    format.timestamp(),
    format.printf(
      (info) => `[${info.timestamp}] ${info.level.toUpperCase()}: ${info.message}`
    )
  ),
  transports: [
    new transports.Console(),

    new transports.MongoDB({
      level: "info",
      db: process.env.DB_URL, // Uses DB_URL from .env
      options: { useUnifiedTopology: true },
      collection: "logs", // You can name it anything you want
      tryReconnect: true,
      format: format.combine(format.timestamp(), format.json()),
    }),
  ],
});

module.exports = logger;
