const jwt = require('jsonwebtoken');
const {
    ACTIVE_TOKEN_SECRET,
    ACCESS_TOKEN_SECRET,
    REFRESH_TOKEN_SECRET
  } = process.env

const generateActiveToken = (payload) => {
  return jwt.sign(payload, `${ACTIVE_TOKEN_SECRET}`, {expiresIn: '5m'})
}

const generateAccessToken = (payload) => {
  return jwt.sign(payload, `${ACCESS_TOKEN_SECRET}`, {expiresIn: '15m'})
}

const generateRefreshToken = (payload, res) => {
  const refresh_token = jwt.sign(payload, `${REFRESH_TOKEN_SECRET}`, {expiresIn: '7d'})
  
  res.cookie('refreshtoken', refresh_token, {
    httpOnly: true,
    path: `/api/refresh_token`,
    maxAge: 30*24*60*60*1000 // 30days
  })
  
  return refresh_token;
}

module.exports = {generateActiveToken, generateAccessToken, generateRefreshToken}