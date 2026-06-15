export function notFoundHandler(request, response) {
  response.status(404).json({
    success: false,
    error: {
      message: `Rota ${request.method} ${request.originalUrl} nao encontrada.`,
      statusCode: 404,
    },
  });
}
