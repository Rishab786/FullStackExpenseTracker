//SEDING DEFAULT OR LOGIN PAGE
exports.getHomePage = (request, response, next) => {
  response.sendFile("home.html", { root: "views" });
};
