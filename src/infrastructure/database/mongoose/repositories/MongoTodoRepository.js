const ITodoRepository = require('../../../../domain/repositories/ITodoRepository');
const TodoModel = require('../models/TodoModel');
const Todo = require('../../../../domain/entities/Todo');

class MongoTodoRepository extends ITodoRepository {
    async findAll() {
        const todos = await TodoModel.find();
        return todos.map(todo => new Todo(
            todo._id,
            todo.title,
            todo.description,
            todo.completed,
            todo.createdAt
        ));
    }

    async save(todo) {
        const todoModel = new TodoModel({
            title: todo.title,
            description: todo.description,
            completed: todo.completed
        });
        const savedTodo = await todoModel.save();
        return new Todo(
            savedTodo._id,
            savedTodo.title,
            savedTodo.description,
            savedTodo.completed,
            savedTodo.createdAt
        );
    }

    async findById(id) {
        const todo = await TodoModel.findById(id);
        if (!todo) return null;

        return new Todo(
            todo._id,
            todo.title,
            todo.description,
            todo.completed,
            todo.createdAt
        );
    }

    async delete(id) {
        const deletedTodo = await TodoModel.findByIdAndDelete(id);
        if (!deletedTodo) return false;
        return true;
    }

}

module.exports = MongoTodoRepository; 