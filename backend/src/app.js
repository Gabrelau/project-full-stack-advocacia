import cors from 'cors';
import express from 'express';

import atendimentosRoutes from './routes/atendimentos.routes.js';
import dashboardRoutes from './routes/dashboard.routes.js';
import { errorHandler } from './middlewares/errorHandler.js';
import { notFoundHandler } from './middlewares/notFoundHandler.js';

const app = express();

app.use(cors({
  origin: process.env.FRONTEND_URL || '*',
}));
app.use(express.json());

app.get('/api/health', (_request, response) => {
  response.json({
    success: true,
    data: {
      status: 'ok',
      service: 'advocacia-backend',
    },
  });
});

app.use('/api/atendimentos', atendimentosRoutes);
app.use('/api/dashboard', dashboardRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

export default app;
