const hello = (req, res, next) => {
  return res.status(200).json({
    status: 200,
    message: 'Hello World!',
  });
};

module.exports = {
  hello
};
