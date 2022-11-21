const { PrismaClient } = require('@prisma/client');
const jwt = require('jsonwebtoken');
const prisma = new PrismaClient();

const auth = async (req, res, next) => {
  try {
    const token = req.header("Authorization")
    if(!token) return res.status(400).json({error: "Authentification incorrecte (1)."})

    const decoded = jwt.verify(token, `${process.env.ACCESS_TOKEN_SECRET}`)
    if(!decoded) return res.status(400).json({error: "Authentification incorrecte (2)."})

    const user = await prisma.users.findUnique({ where: {id: String(decoded.id)} })
    
    if(!user) return res.status(400).json({error: "Cet utilisateur n'existe pas."})

    req.user = user;

    next()
  } catch (err) {
    return res.status(500).json({error: err.message})
  }
}

module.exports = auth;