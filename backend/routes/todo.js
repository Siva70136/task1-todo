const express = require('express');
const auth = require('../middleware/auth');
const Todo = require('../models/todoModel');

const router = express.Router();

router.post('/',auth, async (req, res) => {
    const { title,status,description} = req.body;
   //console.log(req.body);

    try {
        const newTodo = new Todo({
            user_id: req.user.id,
            title,
            description,
            status,
        });
        

        const todo = await newTodo.save();
        res.json(todo);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

router.get('/', auth, async (req, res) => {
    
    try {
        const todos = await Todo.find({ user_id: req.user.id }).sort({ createdAt: -1 });
        //console.log(todos);
        res.json(todos);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

router.put('/:id', auth, async (req, res) => {
    const { title, status,description } = req.body;
    //console.log(req.params.id);
    const todoFields = {user_id:req.user.id, title, status,description };

    try {
        let todo = await Todo.findById(req.params.id);
        
        if (!todo) {
            return res.status(404).json({ msg: 'todo not found' });
        }

        if (todo.user_id.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'User not authorized' });
        }

        todo = await Todo.findByIdAndUpdate(req.params.id, { $set: todoFields }, { new: true });
        //console.log(todo);
        res.json(todo);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

router.delete('/:id', auth, async (req, res) => {
    try {
        //console.group(req.params.id);
        const todo = await Todo.findById(req.params.id);

        if (!todo) {
            return res.status(404).json({ msg: 'todo not found' });
        }

        if (todo.user_id.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'User not authorized' });
        }
        //console.log(todo);
        await Todo.findByIdAndDelete(req.params.id);


        res.json({ msg: 'todo removed' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});


module.exports = router;