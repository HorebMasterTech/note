const { PrismaClient } = require('@prisma/client');
const bcrypt = require("bcrypt");
const shortId = require("shortid");
const jwt = require("jsonwebtoken");
const {
    generateActiveToken,
    generateAccessToken,
    generateRefreshToken,
  } = require("../config/generateToken");

const fetch = require('node-fetch');

const nodeMailer = require("nodemailer");
const {OAuth2Client} = require('google-auth-library');
const client = new OAuth2Client(
  `${process.env.GOOGLE_CLIENT_ID}`
)

const prisma = new PrismaClient();

const Inscription = async (req, res) => {
    try {
        const { nom, password, email } = req.body
        const userEmail = await prisma.users.findUnique({
            where: { email: String(req.body.email) }})
        if(userEmail) return res.status(400).json({ error: "L’email que vous avez saisi est déjà utilisé." })

        if (password.length < 6) return res.status(400).json({ error: "Le mot de passe doit contenir au minimum 6 caractères."});
        const passwordHash = await bcrypt.hash(password, 12);

        const newUser = { nom, email, password: passwordHash }

        const activeToken = generateActiveToken({ newUser });
        const url = `${process.env.CLIENT_URL}/activation/${activeToken}`;
        
        const transport = nodeMailer.createTransport({
            host:"smtp-relay.sendinblue.com",
            port: 587,
            secure: false,
            auth: {
              user: "davjosnayo@gmail.com",
              pass: "fy596nAThMc4pQGD",
            },
          });
    
          const mailOptions = {
            from: '"no-reply" <no.reply.horeb@gmail.com>',
            to: email,
            subject: `Validation de votre inscription`,
            html: `
              <html lang="fr">
                  <head>
                      <meta charset="UTF-8" />
                      <meta name="viewport" content="width=device-width" />
                      <style>
                      @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@100;200;300;400;500;600;700;800;900&display=swap');
                      body{font-family: 'Montserrat', sans-serif;background-color: white;}
                      p{opacity: .6;}
                      </style>
                  </head>
                  <body>
                  <div
                  style="
                  background-color: rgba(214, 241, 255, .4);
                      max-width: 700px;
                      margin: auto;
                      height: auto;
                      padding: 50px 20px;
                      font-size: 110%;

                  "
                  >
                  <img style="width: auto;height: 80px" src="https://res.cloudinary.com/dydtnb3p0/image/upload/v1668340027/logo_t3xqqf.png" alt="">Horeb Groupe
                  <p>Hello ${req.body.nom},</p>
                  <p>Merci de cliquer sur ce lien pour activer votre compte</p>

                  <div style="text-align: center;">

                      <a
                      href="${url}"
                      style="
                          background: #122556;
                          text-decoration: none;
                          color: white;
                          padding: 10px 20px;
                          margin: 10px 0;
                          display: inline-block;
                      "
                      >Valide ton email</a>
                  </div>

                  <div>
                      <p>
                      Pense à compléter ton profil pour ne rater aucune information de <strong>Horeb Technologie</strong> <br><br>
                      Bienvenue à toi chez <strong>Horeb technologie - Note</strong>
                      </p>
                  </div>

                  <p>
                      L'équipe <strong>Horeb Technologie</strong><br/>
                      Note.horebmastertech.com
                  </p>
                  <a href="note.horebmastertech.com"></a>
                  </div>
                  </body>
                  </html>
                  `,
          };
          transport
            .sendMail(mailOptions)
            .then((data) => {
              res.json({
                msg: "Un e-mail vous a été envoyé afin de valider votre compte",
              });
            })
            .catch((err) => {
              console.log(err);
            });

    } catch (err) {
        res.status(400).json({ error: err.message });
    }
}

const Activation = async (req, res) => {
    try {
        const { active_token } = req.body;
        const decoded = jwt.verify(active_token, `${process.env.ACTIVE_TOKEN_SECRET}`);

        const { newUser } = decoded;
        if (!newUser) return res.status(400).json({ msg: "Authentification invalide" });

        const user = await prisma.users.findUnique({
            where: { email: String(req.body.email) }})

        if(user) return res.status(400).json({ error: "Ce compte existe déjà." })

        const utilisateur = await prisma.users.create({
            data: {
                nom: newUser.nom,
                email: newUser.email,
                password: newUser.password,
                type: "Inscription",
                rf_token: newUser.rf_token
            }
        });
        res.status(201).json({msg: "Votre compte est maintenant activé."})

    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
}

const Connexion = async (req,  res) => {
    try {
        const { email, password } = req.body;
        const user = await prisma.users.findUnique({ 
            where: { email: String(req.body.email) }})
        
        if(!user) return res.status(400).json({ error: "Cet utilisateur n'existe pas." });
        if(!password) return res.status(400).json({ error: "Merci de saisir un mot de passe." });
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ error: "Le mot de passe n'est pas correcte." });
       loginUser(user, password, res)
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
}

const Deconnexion = async (req,  res) => {
    if (!req.user)
    return res.status(400).json({ error: "Authentification invalide." });

    try {
      // console.log(req.user);
        res.clearCookie("refreshtoken", { path: `/api/refresh_token` });
        await prisma.users.update({
            where: {id: String(req.user.id)},
            data: {rf_token: ""}
        })
        return res.json({ msg: "Vous êtes maintenant déconnecté." });
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
}

const RefreshToken = async (req,  res) => {
    try {
        const rf_token = req.cookies.refreshtoken;
        if (!rf_token) return res.status(400).json({ error: "Merci de vous connecter maintenant" });

        const decoded = jwt.verify(rf_token, process.env.REFRESH_TOKEN_SECRET);
        if (!decoded.id) return res.status(400).json({ error: "Merci de vous connecter maintenant!" });

        const user = await prisma.users.findUnique({
            where: {id: String(decoded.id)}
        })

        if(!user) return res.status(400).json({ error: "Ce compte n'existe pas." });

        if(!rf_token)return res.status(400).json({ error: "Merci de vous connecter maintenant!" });

        const access_token = generateAccessToken({ id: user.id });
        const refresh_token = generateRefreshToken({ id: user.id }, res);

        await prisma.users.update({
            where: {id: String(user.id)},
            data: { rf_token: refresh_token }
        })

        res.json({access_token, user: { ...user, password: "", passwordResetCode: "" }})

    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
}

const ForgotPassword = async (req,  res) => {
    try {
        const { email } = req.body;
        if (!email) return res.status(400).json({ error: "Veuillez saisir une adresse e-mail valide!" });
        const shortCode = shortId.generate().toUpperCase();

        const userEmail = await prisma.users.findUnique({ 
          where: { email: String(req.body.email) }})
        
          if (!userEmail) return res.status(400).json({ error: "Cet e-mail n'appartient à aucun utilisateur!" });

        const user = await prisma.users.update({
            where: {email: String(req.body.email)},
            data: { passwordResetCode: shortCode }
        })
        if (!user) return res.status(400).json({ error: "Cet e-mail n'appartient à aucun utilisateur." });
      const userName = user.nom;

      const transport = nodeMailer.createTransport({
        host:"smtp-relay.sendinblue.com",
        port: 587,
        secure: false,
        auth: {
          user: "no.reply.horeb@gmail.com",
          pass: "mgf1LS4zjyaP7KXT",
        },
      });

      const mailOptions = {
        from: '"no-reply" <no.reply.horeb@gmail.com>',
        to: email,
        subject: `Régénérez votre mot de passe`,
        html: `
        <html lang="fr">
          <head>
            <meta charset="UTF-8" />
            <meta name="viewport" content="width=device-width" />
            <style>
            @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@100;200;300;400;500;600;700;800;900&display=swap');
            body{font-family: 'Montserrat', sans-serif;background-color: white;}
            p{opacity: .6;}
            </style>
          </head>
            <body>
            <div style="background-color: rgba(214, 241, 255, .4); max-width: 700px; margin: auto; height: auto; padding: 50px 20px; font-size: 110%;">
            <img style="width: auto;height: 80px" src="https://res.cloudinary.com/dydtnb3p0/image/upload/v1668340027/logo_t3xqqf.png" alt="">Horeb Groupe
              <p>Hello ${userName},</p>
              <div style="text-align: center;">
                <p>Veuillez utiliser ce code pour réinitialiser votre mot de passe</p>
                <h2 style="color:rgb(255, 255, 255); width: 150px; display: table; margin: 2rem auto; padding: 10px 20px; background: #122556;">${shortCode}</h2>
              </div>
            <p>L'équipe <strong>Horeb Technologie</strong><br/>note.horebmastertech.com</p>
            <a href="note.horebmastertech.com"></a>
            </div>
            </body>
          </html>
                `,
      };

      transport
        .sendMail(mailOptions)
        .then((data) => {
          res.json({
            msg: "Un e-mail vous a été envoyé afin de réinitialiser votre mot de passe!",
          });
        })
        .catch((err) => {
          console.log(err);
        });
        
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
}

const ResetPassword = async (req, res) => {
    try {
        const { email, code, newPassword } = req.body;
        const userCode = await prisma.users.findUnique({
            where: {email: String(req.body.email)}
        })
        if (userCode.passwordResetCode != code) {
            return res.status(400).json({
                error: "Ce code a déjà été utilisé ou ne correspond à aucun de nos code de réinitialisation.",
            });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 12);

        const user = await prisma.users.updateMany({
            where: { email: String(req.body.email), passwordResetCode: String(req.body.code) },
            data: {password: String(hashedPassword), passwordResetCode: String("")}
        })
        res.json({ msg: "Le mot de passe a bien été réinitialisé" });
    } catch (err) {
      return res.status(400).json({ error: "Erreur..." });
    }
}

const GoogleLogin = async (req, res) => {
    try {
      const { id_token } = req.body;
      
      const verify = await client.verifyIdToken({
          idToken: id_token, 
          audience: process.env.GOOGLE_CLIENT_ID
        });
        
        const { email, email_verified, given_name } = verify.getPayload();
      
      if(!email_verified)
      return res.status(500).json({ error: "L'adresse e-mail n'a pas pu être vérifiée, merci de rééssayer." })
      
      const password = email + "Votre mot de passe google"
      const passwordHash = await bcrypt.hash(password, 12)

      const newEmail = email;
      
      const user = await prisma.users.findUnique({
        where: {email: String(newEmail)}
      })

      const isMatch = await bcrypt.compare(user.password, passwordHash);
        
      if(user) {
        loginUser(user, password, res)
      } else {
        const user = {
          nom: given_name, email, password: passwordHash, type: 'Google'
        }
        registerUser(user, res)
      }

    } catch (err) {
      return res.status(500).json({ error: err.message })
    }
}

const loginUser = async (user, password, res) =>{

    const isMatch = await bcrypt.compare(password, user.password)

    if(!isMatch) {
        let msgError = user.type === 'Inscription' 
      ? "Le mot de passe n'est pas correcte. Merci d'utiliser le formulaire pour vous connecter." 
      : `Le mot de passe n'est pas correcte. Connectez-vous par ${user.type}`

      return res.status(400).json({ error: msgError })
    }

    const access_token = generateAccessToken({id: user.id})
    const refresh_token = generateRefreshToken({id: user.id}, res)

    const newUser = await prisma.users.update({
        where: { id: String(user.id)},
        data: {rf_token:refresh_token}
    })

    res.json({ msg: "Connexion réussit", access_token, newUser: { ...newUser, password: "", passwordResetCode: "" } })
}

const registerUser = async (user, res) => {

    const newUser = user;
  
    const access_token = generateAccessToken({id: newUser.id})
    const refresh_token = generateRefreshToken({id: newUser.id}, res)
  
    newUser.rf_token = refresh_token

    const currentNewUser = await prisma.users.create({
        data: {
            nom: newUser.nom,
            email: newUser.email,
            password: newUser.password,
            type: newUser.type,
            rf_token: newUser.rf_token
        }
    });
  
    res.json({ msg: "Inscription réussit", access_token, currentNewUser: { ...currentNewUser, password: "", passwordResetCode: "" } })
  
}

const FacebookLogin = async(req, res) => {
    try {
      const { accessToken, userID } = req.body

      const URL = `
      https://graph.facebook.com/v3.0/${userID}/?fields=id,first_name,last_name,email&access_token=${accessToken}
      `

      const data = await fetch(URL)
      .then(res => res.json())
      .then(res => { return res })

      const { email, last_name } = data

      const password = email + 'Votre mot de passe facebook'
      const passwordHash = await bcrypt.hash(password, 12)

      const newEmail = email;
      
      const user = await prisma.users.findUnique({
        where: {email: String(newEmail)}
      })

      if(user){
        loginUser(user, password, res)
      }else{
        const user = {nom: last_name, email, password: passwordHash, type: 'Facebook' }
        registerUser(user, res)
      } 
      
    } catch (err) {
      return res.status(500).json({error: err.message})
    }
}

module.exports = {
    Inscription,
    Activation,
    Connexion,
    Deconnexion,
    RefreshToken,
    ForgotPassword,
    ResetPassword,
    GoogleLogin,
    FacebookLogin
}