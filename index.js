const express = require('express');
const app = express();
const pool = require('./db');

//This is how we receive a data from clients
app.use(express.json()) //req.body

//ROUTES//

//get all todos
app.get('/todos', async(req, res) => {
    try {
      const allTodo = await pool.query("SELECT * FROM todo");
      console.log(allTodo);
      res.json(allTodo.rows);
    } catch (err) {
        console.error(err.message);
    }
})

//get a todo
app.get('/todos/:id', async(req, res) => {
    const { id } = req.params;
    try {
      const todo = await pool.query("SELECT * FROM todo WHERE todo_id = $1", [id]);
      res.json(todo.rows[0]);  
    } catch (err) {
        console.error(err.message);
    }
})

//create a todo
app.post('/todos', async(req, res) => {
    try {
       const { description } = req.body;
       const newTodo = await pool.query(
           "INSERT INTO todo (description) VALUES ($1) RETURNING *",
            [description]
            );
            res.json(newTodo.rows[0]);
    } catch (err) {
        console.error(err.message);
        
    }
})


//update a todo
app.put('/todos/:id', async(req, res) => {
    try {
      const { id } = req.params; //Where
      const { description } = req.body;  //Set
      const setTodo = await pool.query("UPDATE todo SET description =$1 WHERE todo_id = $2", [description, id]);
      res.json("Todo was updated");
    } catch (err) {
        console.error(err.message);
    }
})

//delete a todo
app.delete('/todo/:id', async(req, res) => {
    try {
      const {id} = req.params;
      const deleteTodo = await pool.query("SELECT * FROM todo WHERE todo_id = $1", [id]);
      res.json("todo was deleted successfully");  
    } catch (err) {
        console.error(err.message);
    }
})

//Create a Server
app.listen(3000, () => {
    console.log('Server is Listening on Port 3000');
});