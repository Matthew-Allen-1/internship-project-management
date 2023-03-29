const jwt = require('jsonwebtoken');
const express = require("express");
const bcrypt = require('bcrypt');
const router = express.Router();

router.post('/', async function (req, res) {
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

router.delete('/:id', async function (req, res) {
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

module.exports = router;