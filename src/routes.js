const express = require('express');
const expressJwt = require('express-jwt/lib');
const config = require('./config');
const userRoutes = require('./modules/user/user.routes');
const authRoutes = require('./modules/auth/auth.routes');
const studentRoutes = require('./modules/student/student.routes');
const subjectRoutes = require('./modules/subject/subject.routes');
const gradeRoutes = require('./modules/grade/grade.routes');
const presenceRoutes = require('./modules/presence/presence.routes');

const router = express.Router(); // eslint-disable-line new-cap

/** GET /health-check - Check service health */
router.get('/health-check', (req, res) => res.send('OK'));

// mount auth routes at /auth
router.use('/auth', authRoutes);

// Validating all the APIs with jwt token.
router.use(expressJwt({ secret: config.jwtSecret }));

// If jwt is valid, storing user data in local session.
router.use((req, res, next) => {
  const authorization = req.header('authorization');
  res.locals.session = JSON.parse(Buffer.from((authorization.split(' ')[1]).split('.')[1], 'base64').toString()); // eslint-disable-line no-param-reassign
  next();
});

// mount user routes at /users
router.use('/users', userRoutes);

// mount student routes at /students
router.use('/students', studentRoutes);

// mount subject routes at /subjects
router.use('/subjects', subjectRoutes);

// mount grade routes at /grades
router.use('/grades', gradeRoutes);

// mount presence routes at /presences
router.use('/presences', presenceRoutes);

module.exports = router;
