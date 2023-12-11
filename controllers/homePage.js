exports.getHomePage = (req, res, next) => {
  res.sendFile("home.html", { root: "views" });
};
