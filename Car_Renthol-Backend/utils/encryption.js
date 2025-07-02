const CryptoJS = require("crypto-js");

const encrypt = (text) => {
  return CryptoJS.AES.encrypt(text, process.env.SECRETCRYPTO).toString();
};

const decrypt = (cipher) => {
  const bytes = CryptoJS.AES.decrypt(cipher, process.env.SECRETCRYPTO);
  return bytes.toString(CryptoJS.enc.Utf8);
};

module.exports = { encrypt, decrypt };
