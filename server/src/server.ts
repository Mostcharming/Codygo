import express, { Application, Request, Response, NextFunction } from 'express';
import http from 'http';
import mongoose from 'mongoose';
import { config } from './config/config';
import hotelBRoutes from './routes/HotelBrand';
import hotelRoutes from './routes/Hotel';

const app: Application = express();

mongoose
  .connect(config.mongo.url, {
    retryWrites: true,
    w: 'majority',
  })
  .then(() => {
    console.log('DB connection succesful');
    StartServer();
  })
  .catch((error) => {
    console.log(error);
  });

const StartServer = () => {
  app.use((req: Request, res: Response, next: NextFunction) => {
    console.log(
      `Incoming -> Method: [${req.method}] - Url: [${req.url}] IP:[${req.socket.remoteAddress}]`
    );

    res.on('finish', () => {
      console.log(
        `Incoming -> Method: [${req.method}] - Url: [${req.url}] IP:[${req.socket.remoteAddress}] - status: [${res.statusCode}]`
      );
    });

    next();
  });

  app.use(express.urlencoded({ extended: true }));
  app.use(express.json());

  app.use((req: Request, res: Response, next: NextFunction) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header(
      'Access-Control-Allow-Headers',
      'Origin, X-Requested-With, Content-Type, Accept, Authorization'
    );

    if (req.method === 'OPTIONS') {
      res.header(
        'Allow-Control-Allow-Methods',
        'PUT, POST, PATCH, DELETE, GET'
      );
      return res.status(200).json({});
    } else {
    }
    next();
  });

  app.use('/api/hotel', hotelRoutes);
  app.use('/api/hotelBrand', hotelBRoutes);

  app.get('/ping', (_req: Request, res: Response, _next: NextFunction) =>
    res.status(200).json({ message: 'pong' })
  );

  app.use((_req: Request, res: Response, _next: NextFunction) => {
    const error = new Error('not found');
    console.log(error);

    return res.status(404).json({ message: error.message });
  });

  http.createServer(app).listen(config.server.port, () => {
    console.log(`Server running on port ${config.server.port}`);
  });
};
