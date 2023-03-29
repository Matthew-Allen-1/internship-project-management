const jwt = require('jsonwebtoken');
const express = require("express");
const router = express.Router();

router.get('/', async (req, res) => {
  const [scheme, token] = req.headers.authorization.split(' ');
  const user = jwt.verify(token, process.env.JWT_KEY)
  console.log('user: ', user)
  try {
    const [userInfo] = await req.db.query(`
    SELECT id, name, email, date_created, avatar FROM users
    WHERE id = ${user.userId}`
    ); 
    res.json({ user, userInfo });
  } catch (err) {
    console.log(err);
    res.json({ err });
  }
});

module.exports = router;