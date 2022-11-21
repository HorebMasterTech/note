const express = require('express');
const {
    Inscription,
    Activation,
    Connexion,
    Deconnexion,
    RefreshToken,
    ForgotPassword,
    ResetPassword,
    GoogleLogin,
    FacebookLogin
} = require('../controllers/authController');
const auth = require('../middleware/auth');

const router = express.Router();

router.post('/inscription', Inscription);
router.post('/activation', Activation);
router.post('/connexion', Connexion);
router.get('/deconnexion', auth, Deconnexion)
router.get('/refresh_token', RefreshToken)
router.post('/mot-de-passe', ForgotPassword);
router.post('/reinitialiser-mot-de-passe', ResetPassword);
router.post('/google_connexion', GoogleLogin)
router.post('/facebook_connexion', FacebookLogin)

module.exports = router;