const jwt = require('jsonwebtoken');
const express = require("express");
const bcrypt = require('bcrypt');
const router = express.Router();

router.post('/register', async function (req, res) {
  try {
    let encodedUser;
    if(Object.values(req.body).indexOf('') > -1){
      throw new Error('missing fields');
    } else if(req.body.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/) == null){
      throw new Error('Invalid Email');
    }
    // Hashes the password and inserts the info into the `user` table
    await bcrypt.hash(req.body.password, 10).then(async hash => {
      try {
        console.log('HASHED PASSWORD', hash);
        const date_created = new Date().getTime().toString();
        const [user] = await req.db.query(`
          INSERT INTO users (name, email, password, date_created)
          VALUES (:name, :email, :password, ${date_created});
        `, {
          name: req.body.name,
          email: req.body.email,
          password: hash
        });

        const [ userInfo ] = await req.db.query(`
        SELECT * FROM users
        WHERE id = ${user.insertId}`)

        console.log('USER', user)

        encodedUser = jwt.sign(
          { 
            userId: user.insertId,
            name: userInfo[0].name,
            email: userInfo[0].email,
            date_created: date_created
          },
          process.env.JWT_KEY
        );

        console.log('ENCODED USER', encodedUser);
      } catch (error) {
        console.log('error', error);
      }
    });

    res.json({ jwt: encodedUser });
  } catch (err) {
    console.log('err', err);
    res.json({ err });
  }
});

// authenticates user when they log in
router.post('/authenticate', async function (req, res) {
  try {
    const { email, password } = req.body;
    const [[user]] = await req.db.query(`SELECT * FROM users WHERE email = :email`, {  email });

    if (!user) res.json('Email not found');
    const dbPassword = `${user.password}`
    const compare = await bcrypt.compare(password, dbPassword);

    if (compare) {
      const payload = {
        userId: user.id,
        name: user.name,
        email: user.email,
        date_created: user.date_created,
      }
      
      const encodedUser = jwt.sign(payload, process.env.JWT_KEY);

      res.json({ jwt: encodedUser });
    } else {
      res.json('Password not found');
    }
    
  } catch (err) {
    console.log('Error in /authenticate', err)
  }
});

module.exports = router;