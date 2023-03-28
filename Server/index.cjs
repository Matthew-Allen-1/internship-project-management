const express = require('express');
const cors = require('cors');
const mysql = require('mysql2/promise');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const bodyParser = require('body-parser');

const profileRoute = require('./profile.cjs');

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

app.use("/public", express.static("public"));

app.post('/register', async function (req, res) {
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

// Jwt verification checks to see if there is an authorization header with a valid jwt in it.
app.use(async function verifyJwt(req, res, next) {
  // console.log(req.headers.authorization)
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

app.get('/user', async (req, res) => {
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

// GET request to http://localhost:8080/tasks
app.get('/tasks', async (req, res) => {
  const [scheme, token] = req.headers.authorization.split(' ');
  const user = jwt.verify(token, process.env.JWT_KEY)
  console.log('user: ', user)

  try {
    const [tasks] = await req.db.query(`
    SELECT * FROM task_table
    WHERE task_table.id = ${user.userId} AND archived = 0`
  );

  const [groups] = await req.db.query(`
    SELECT * FROM group_table
    WHERE group_table.id = ${user.userId}
    ORDER BY title`
  );

    res.json({ tasks, groups, name: user.name });
  } catch (err) {
    console.log(err);
    res.json({ err });
  }
});

app.get('/archived-tasks', async (req, res) => {
  const [scheme, token] = req.headers.authorization.split(' ');
  const user = jwt.verify(token, process.env.JWT_KEY)
  console.log('user: ', user)

  try {
    const [tasks] = await req.db.query(`
    SELECT * FROM task_table
    WHERE task_table.id = ${user.userId} AND archived = 1`
  );

  const [groups] = await req.db.query(`
    SELECT * FROM group_table
    WHERE group_table.id = ${user.userId}
    ORDER BY title`
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
  console.log('group added: ', req.body)

  try{
    const [group] = await req.db.query(`
      INSERT INTO group_table (group_id, title, active_sidebar, selected, id)
      VALUES (:group_id, :title, :active_sidebar, :selected, ${user.userId})`,
      {
        group_id: req.body.group_id,
        title: req.body.title,
        active_sidebar: req.body.activeSidebar,
        selected: req.body.selected,
      }
    );
    res.json({Success: true, group_title: req.body.title, group_id: req.body.group_id})

  } catch (error){
    console.log('error', error)
    res.json({Success: false})
  }
})

app.post('/update-task', async function (req, res) {
  const [scheme, token] = req.headers.authorization.split(' ');
  const user = jwt.verify(token, process.env.JWT_KEY)
  console.log('group updated: ', req.body)

  try{
    if(req.body.type === 'groupSelect'){
      const [task] = await req.db.query(`
        UPDATE task_table
        SET group_id = :group_id, group_title = :group_title
        WHERE task_id = :task_id`,
        {
          group_id: req.body.group_id,
          group_title: req.body.group_title,
          task_id: req.body.task_id,
        }
      );
    } else if (req.body.type === 'title'){
      const [task] = await req.db.query(`
        UPDATE task_table
        SET title = :title
        WHERE task_id = :task_id`,
        {
          title: req.body.title,
          task_id: req.body.task_id,
        }
      );
    } else if (req.body.type === 'start_time'){
      const [task] = await req.db.query(`
        UPDATE task_table
        SET start_time = :start_time
        WHERE task_id = :task_id`,
        {
          start_time: req.body.start_time,
          task_id: req.body.task_id,
        }
      );
    }else if (req.body.type === 'end_time'){
      const [task] = await req.db.query(`
        UPDATE task_table
        SET end_time = :end_time
        WHERE task_id = :task_id`,
        {
          end_time: req.body.end_time,
          task_id: req.body.task_id,
        }
      );
    } else if (req.body.type === 'date'){
      const [task] = await req.db.query(`
        UPDATE task_table
        SET date = :date
        WHERE task_id = :task_id`,
        {
          date: req.body.date,
          task_id: req.body.task_id,
        }
      );
    } else if (req.body.type === 'archive'){
      const [task] = await req.db.query(`
        UPDATE task_table
        SET archived = :archived
        WHERE task_id = :task_id`,
        {
          archived: req.body.archived,
          task_id: req.body.task_id,
        }
      );
    }
    res.json({Success: true})

  } catch (error){
    console.log('error', error)
    res.json({Success: false})
  }
})

app.post('/add-task', async function (req, res) {
  const [scheme, token] = req.headers.authorization.split(' ');
  const user = jwt.verify(token, process.env.JWT_KEY)
  console.log('task added: ',req.body);

  try {

    const [task] = await req.db.query(`
      INSERT INTO task_table (task_id, title, start_time, end_time, date, archived, group_title, group_id, id)
      VALUES (:task_id, :title, :start_time, :end_time, :date, :archived, :group_title, :group_id, ${user.userId})`, 
      {
      task_id: req.body.task_id,
      title: req.body.title,
      start_time: req.body.start_time,
      end_time: req.body.end_time,
      date: req.body.date,
      archived: req.body.archived,
      group_title: req.body.group_title,
      group_id: req.body.group_id,
      }
    );
    res.json({Success: true})

  } catch (error) {
    console.log('error', error);
    res.json({Success: false})
  };
});

app.delete('/delete-task/:id', async function (req, res) {
  const [scheme, token] = req.headers.authorization.split(' ');
  const user = jwt.verify(token, process.env.JWT_KEY)
  const task_id = req.params.id;
  console.log('deleted task: ', task_id, user.userId);
  try{
    const [task] = await req.db.query(`
      DELETE FROM task_table 
      WHERE task_table.task_id = '${task_id}' AND task_table.id = ${user.userId}`,{hello: 'hello'}
    );
    res.json({Success: true })

  } catch (error){
    console.log('error', error)
    res.json({Success: false})
  }
});

app.delete('/delete-group/:id', async function (req, res) {
  const [scheme, token] = req.headers.authorization.split(' ');
  const user = jwt.verify(token, process.env.JWT_KEY)
  const group_id = req.params.id;
  console.log('deleted group: ', group_id, user.userId);
  try{
    const [group] = await req.db.query(`
      DELETE FROM group_table 
      WHERE group_table.group_id = '${group_id}' AND group_table.id = ${user.userId}`,{hello: 'hello'}
    );
    res.json({Success: true })

  } catch (error){
    console.log('error', error)
    res.json({Success: false})
  }
});

app.use("/profile", profileRoute);

// Start the Express server
app.listen(port, () => {
  console.log(`server started at http://localhost:${port}`);
});
