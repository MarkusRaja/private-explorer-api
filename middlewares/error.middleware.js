module.exports = (error, req, res, next) => {
  console.error(error?.message, error);

  return res.status(500).json({
    code: 500,
    status: 'INTERNAL_SERVER_ERROR',
    errors: {
      message: 'Something went wrong. Please try again later.'
    },
  });
};
