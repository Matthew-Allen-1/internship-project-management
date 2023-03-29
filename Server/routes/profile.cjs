const jwt = require('jsonwebtoken');
const express = require("express");
const multer = require('multer');
const bcrypt = require('bcrypt');
const router = express.Router();

const storage = multer.diskStorage({
  destination: './public/avatars',
  filename: (req, file, cb) => {
    cb(null, `${new Date().getTime()}-${file.originalname}`);
  }
})

const upload = multer({
  storage: storage,
});

router.put('/', upload.single('avatar'), async function (req, res) {
  const [scheme, token] = req.headers.authorization.split(' ');
  const user = jwt.verify(token, process.env.JWT_KEY)
  const file = req.file;
  const imageURL = `http://localhost:3000/public/avatars/${file?.filename}`;
  console.log('post updated: ',req.body);

  try {
    const [[dbUser]] = await req.db.query(`SELECT * FROM users WHERE id = :id`, { id: user.userId });
    const dbPassword = `${dbUser.password}`
    const compare = await bcrypt.compare(req.body.password, dbPassword);

    if(compare){
      const [avatar] = await req.db.query(`
      UPDATE users
      SET avatar = :avatar, email = :email, name = :name
      WHERE id = ${user.userId}`, 
      {
        name: req.body.name,
        email: req.body.email,
        avatar: file === undefined ? dbUser.avatar : imageURL
      });
    res.json({Success: true})
    } else{
      res.json(false);
    }
  } catch (error) {
    console.log('error', error);
    res.json({Success: false})
  };
});

module.exports = router;