const BaseImage = require("./image");
const BaseUrl = require("./url");

class Factory {
  static async encode(element, encode = "") {
    if (typeof element === "string" && element.startsWith("http")) {
      return await BaseUrl.encode(element, encode);
    } else if (typeof element === "string" && element.match(/\.jpg|\.png$/)) {
      return BaseImage.encode(element, encode);
    } else {
      throw new Error("Invalid input");
    }
  }
}

module.exports = Factory;