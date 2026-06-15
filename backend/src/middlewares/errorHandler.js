export function errorHandler(error, _request, response, _next) {
  const statusCode = error.statusCode || 500;

  response.status(statusCode).json({
    success: false,
    error: {
      message: error.message || 'Erro interno do servidor.',
      statusCode,
    },
  });
}
