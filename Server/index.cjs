const express = require('express');
const cors = require('cors');
const mysql = require('mysql2/promise');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const bodyParser = require('body-parser');

// Allows us to access the .env
require('dotenv').config();

const app = express();
const port = process.env.PORT; // default port to listen

const corsOptions = {
   origin: '*', 
   credentials: true,  // access-control-allow-credentials:true
   optionSuccessStatus: 200,
};

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

app.use(cors(corsOptions));

// Makes Express parse the JSON body of any requests and adds the body to the req object
app.use(bodyParser.json());

app.use(async (req, res, next) => {
  try {
    // Connecting to our SQL db. req gets modified and is available down the line in other middleware and endpoint functions
    req.db = await pool.getConnection();
    req.db.connection.config.namedPlaceholders = true;

    // Traditional mode ensures not null is respected for unsupplied fields, ensures valid JavaScript dates, etc.
    await req.db.query('SET SESSION sql_mode = "TRADITIONAL"');
    await req.db.query(`SET time_zone = '-8:00'`);

    // Moves the request on down the line to the n ext middleware functions and/or the endpoint it's headed for
    await next();

    // After the endpoint has been reached and resolved, disconnects from the database
    req.db.release();
  } catch (err) {
    // If anything downstream throw an error, we must release the connection allocated for the request
    console.log(err)
    // If an error occurs, disconnects from the database
    if (req.db) req.db.release();
    throw err;
  }
});

app.post('/register', async function (req, res) {
  try {
    let encodedUser;
    if(Object.values(req.body).indexOf('') > -1){
      throw new Error('missing fields');
    } //else if(registerForm.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/) == null){
      //throw new Error('Invalid Email');
    //}
    // Hashes the password and inserts the info into the `user` table
    await bcrypt.hash(req.body.password, 10).then(async hash => {
      try {
        console.log('HASHED PASSWORD', hash);

        const [user] = await req.db.query(`
          INSERT INTO users (name, email, password)
          VALUES (:name, :email, :password);
        `, {
          name: req.body.name,
          email: req.body.email,
          password: hash
        });

        console.log('USER', user)

        encodedUser = jwt.sign(
          { 
            userId: user.insertId,
            name: user.name,
            email: user.email
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
app.post('/authenticate', async function (req, res) {
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

app.get('/user', async (req, res) => {
  res.json({auth: true})
});

// Jwt verification checks to see if there is an authorization header with a valid jwt in it.
app.use(async function verifyJwt(req, res, next) {
  console.log(req.headers.authorization)
  if (!req.headers.authorization) {
    res.json('Invalid authorization, no authorization headers');
  }

  const [scheme, token] = req.headers.authorization.split(' ');

  if (scheme !== 'Bearer') {
    res.json('Invalid authorization, invalid authorization scheme');
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_KEY);
    req.user = payload;
  } catch (err) {
    console.log(err);
    if (
      err.message && 
      (err.message.toUpperCase() === 'INVALID TOKEN' || 
      err.message.toUpperCase() === 'JWT EXPIRED')
    ) {

      req.status = err.status || 500;
      req.body = err.message;
      req.app.emit('jwt-error', err, req);
    } else {

      throw((err.status || 500), err.message);
    }
  }

  await next();
});

// GET request to http://localhost:8080/tasks
app.get('/tasks', async (req, res) => {
  const [scheme, token] = req.headers.authorization.split(' ');
  const user = jwt.verify(token, process.env.JWT_KEY)
  console.log(user)

  try {

    // const [tasks] = await req.db.query(`
    //   SELECT task_data FROM tasks
    //   WHERE tasks.user_id = ${user.userId}`
    // );

    // const [groups] = await req.db.query(`
    //   SELECT group_data FROM tasks
    //   WHERE tasks.user_id = ${user.userId}`
    // );

    const [tasks] = await req.db.query(`
    SELECT * FROM task_table
    WHERE task_table.id = ${user.userId}`
  );

  const [groups] = await req.db.query(`
    SELECT * FROM group_table
    WHERE group_table.id = ${user.userId}`
  );

    res.json({ tasks, groups, name: user.name });
  } catch (err) {
    console.log(err);
    res.json({ err });
  }
});

app.post('/add-group', async function (req, res) {
  const [scheme, token] = req.headers.authorization.split(' ');
  const user = jwt.verify(token, process.env.JWT_KEY)
  console.log(req.body)

  try{
    const [group] = await req.db.query(`
      INSERT INTO group_table (group_id, title, active_sidebar, selected, id)
      VALUES (:group_id, :title, :active_sidebar, :selected, ${user.userId})`,
      {
        group_id: req.body.id,
        title: req.body.title,
        active_sidebar: req.body.activeSidebar,
        selected: req.body.selected,
      }
    );
    res.json({Success: true, title: req.body.title})

  } catch (error){
    res.json({Success: false})
    console.timeLog('error', error)
  }
})

// POST request to http://localhost:8080/add-task ends here
app.post('/add-task', async function (req, res) {
  const [scheme, token] = req.headers.authorization.split(' ');
  const user = jwt.verify(token, process.env.JWT_KEY)
  console.log(req.body);

  try {

    const [task] = await req.db.query(`
      INSERT INTO task_table (task_id, title, start_time, end_time, date, dropdown_active, group_title, group_id, id)
      VALUES (:task_id, :title, :start_time, :end_time, :date, :dropdown_active, :group_title, :group_id, ${user.userId})`, 
      {
      task_id: req.body.id,
      title: req.body.title,
      start_time: req.body.startTime,
      end_time: req.body.endTime,
      date: req.body.date,
      dropdown_active: req.body.dropdownActive,
      group_title: req.body.groupTitle,
      group_id: req.body.groupId,
      }
    );
    res.json({Success: true})

  } catch (error) {
    res.json({Success: false})
    console.log('error', error);
  };
});

app.delete('/delete-tasks', async function (req, res) {
  const [scheme, token] = req.headers.authorization.split(' ');
  const user = jwt.verify(token, process.env.JWT_KEY)
});

// Start the Express server
app.listen(port, () => {
  console.log(`server started at http://localhost:${port}`);
});


  // const [tasks] = await req.db.query(`
  // SELECT messages.* FROM messages,  
  // (
  //   SELECT from_user_id, max(date_time) AS date_time FROM messages GROUP BY from_user_id
  // ) last_message 
  // WHERE messages.from_user_id = last_message.from_user_id 
  // AND messages.date_time = last_message.date_time`);