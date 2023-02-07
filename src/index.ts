import 'colors';
import path from 'path';

import * as dotenv from 'dotenv';
dotenv.config();
/**
 * {
  path: path.join(process.cwd(), '.env'),
}
 */
import connectDB from './db/connectDB';
// import passport from './lib/passport/google';
require('./lib/passport/google');
import express from 'express';
import morgan from 'morgan';
import fileUpload from 'express-fileupload';
import cookieParser from 'cookie-parser';

// Security middlewares
import cors from 'cors';
import mongoSanitize from 'express-mongo-sanitize';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
// @ts-ignore
import xss from 'xss-clean';
import hpp from 'hpp';
import errorHandler from './middleware/errorHandler';
import notFound from './middleware/notFound';

import BUSINESS_ROUTES from './routes';

import os from 'os';
import cluster from 'cluster';
import { cookies, expressSession } from './lib/jwt';
import passport from 'passport';

const app = express();

app.set('trust proxy', true);
app.use(mongoSanitize());
app.use(cookieParser());

app.use(helmet());
app.use(expressSession());
// app.use(cookies());
app.use(passport.initialize());
app.use(passport.session());

app.use(xss());
app.use(hpp());
app.use(
  cors({
    origin: 'http://localhost:3000',
    credentials: true,
    methods: ['POST', 'GET', 'DELETE', 'PUT', 'PATCH'],
  })
);
const limiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 mins
  max: 100,
});
// app.use(limiter);

app.use(express.json());
app.use(express.text());
app.use(morgan('dev'));
app.use(
  fileUpload({
    createParentPath: true,
    useTempFiles: true,
    tempFileDir: path.join(__dirname, '../', 'tmp'),
  })
);

app.use(
  '/image',
  express.static(path.join(__dirname, '../', '/public/uploads/image'))
);

app.use(express.static(path.join(__dirname, '../', 'public')));

app.use(BUSINESS_ROUTES);

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 4000;

const numOfCpu = os.cpus().length;
// const noOfCluster = numOfCpu == 1 ? 4 : numOfCpu;
const noOfCluster = numOfCpu;

const clusterise = () => {
  // Kickstart app
  if (cluster.isPrimary) for (let i = 0; i < noOfCluster; i++) cluster.fork();
  else
    connectDB()
      .then(() => {
        app.listen(PORT);
      })
      .catch(() => {});

  cluster
    .on('fork', function (worker) {
      console.log(
        `):- New Instance with no ${worker.id} with pid ${worker.process.pid} forked.`
          .blue.bold
      );
    })
    .on('exit', function (worker) {
      console.log(
        `):- Instance with id ${worker.process.pid} died.`.red.underline.bold
      );
      cluster.fork();
    })
    .on('listening', function (worker, { port, address }) {
      console.log(
        `):- Instance of wid -> ${worker.id} & pid -> ${worker.process.pid} listening on http://localhost:${PORT}`
          .yellow.bold
      );
    });
};
const runApp = () => {
  connectDB()
    .then(() => {
      app.listen(PORT, async () => {
        // const resMongo = await connectDB();
        // console.log({ resMongo });
        console.log(
          `):- App Instance with pid ${process.pid} Listening on http://localhost:${PORT}`
            .yellow.bold
        );
      });
    })
    .catch(() => {});
};
// clusterise();
runApp();
