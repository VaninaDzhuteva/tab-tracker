const AuthenticationController = require('./controllers/AuthenticationController');
const SongsController = require('./controllers/SongsController');
const isAuthenticated = require('./policies/isAuthenticated');
const AuthenticationControllerPolicy = require('./policies/AuthenticationControllerPolicy');
const upload = require('./middleware/upload');

module.exports = (app) => {
  app.post('/register',
    AuthenticationControllerPolicy.register,
    AuthenticationController.register);

  app.post('/login',
    AuthenticationController.login);

  app.get('/songs', isAuthenticated, SongsController.index);
  app.post('/songs', isAuthenticated, upload.single('pdf'), SongsController.create);
  app.get('/songs/:id', isAuthenticated,  SongsController.show);
  app.put('/songs/:id', isAuthenticated, upload.single('pdf'), SongsController.update);
  app.delete('/songs/:id', isAuthenticated, SongsController.remove);
  app.patch('/songs/:id/favorite', isAuthenticated, SongsController.toggleFavorite);
  app.patch('/songs/:id/practice', isAuthenticated, SongsController.practiceNow)
}