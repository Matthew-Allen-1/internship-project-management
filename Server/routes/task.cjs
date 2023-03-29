const jwt = require('jsonwebtoken');
const express = require("express");
const bcrypt = require('bcrypt');
const router = express.Router();

router.get('/', async (req, res) => {
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

router.put('/', async function (req, res) {
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

router.post('/', async function (req, res) {
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

router.delete('/:id', async function (req, res) {
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

router.get('/archive', async (req, res) => {
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

module.exports = router;