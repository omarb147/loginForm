const proxy = require("http-proxy-middleware");

module.exports = function(app) {
  app.use(proxy("/auth/facebook", { target: "http://localhost:4000/" }));
  app.use(proxy("/auth/google", { target: "http://localhost:4000/" }));
  app.use(proxy("/auth/local/**", { target: "http://localhost:4000/" }));
  app.use(proxy("/auth/current_user", { target: "http://localhost:4000/" }));
  app.use(proxy("/auth/logout", { target: "http://localhost:4000/" }));
};
