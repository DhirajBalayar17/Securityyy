const crypto = require("crypto");

const hashSHA256 = (text) => {
  return crypto.createHash("sha256").update(text).digest("hex");
};

module.exports = { hashSHA256 };
