import express from 'express';
import _ from 'lodash';

// import publisherRoutes from './events/publisher.route';
// import subscriberRoutes from './events/subscriber.route';
// import uploadRoutes from './upload.route';
// import userRoutes from './user.route';
import authRoutes from './auth.route';
import swaggerRoutes from './swagger.route';
import appRoutes from './app.route';
import bookRoutes from './book.route';

const router = express.Router();

const defaultRoutes = [
  {
    path: '/auth',
    route: authRoutes,
  },
  // {
  //   path: '/users',
  //   route: userRoutes,
  // },
  {
    path: '/book',
    route: bookRoutes,
  },
  // {
  //   path: '/upload',
  //   route: uploadRoutes,
  // },
  // {
  //   path: '/publisher',
  //   route: publisherRoutes,
  // },
  // {
  //   path: '/subscriber',
  //   route: subscriberRoutes,
  // },
];

const devRoutes = [
  {
    path: '/app',
    route: appRoutes,
  },
  {
    path: '/docs',
    route: swaggerRoutes,
  },
];

_.forEach(defaultRoutes, (route) => {
  router.use(route.path, route.route);
});

if (process.env.NODE_ENV === 'development') {
  _.forEach(devRoutes, (route) => {
    router.use(route.path, route.route);
  });
}

export default router;
