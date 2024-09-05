function log(req, res, next) {
  console.log("logging...");
  next();
}

export default log;