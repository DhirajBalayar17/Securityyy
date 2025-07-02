import mime from "mime-types";

console.log("JPG:", mime.lookup("image.jpg")); // image/jpeg
console.log("PNG:", mime.lookup("image.png")); // image/png
console.log("PDF:", mime.lookup("file.pdf"));  // application/pdf
