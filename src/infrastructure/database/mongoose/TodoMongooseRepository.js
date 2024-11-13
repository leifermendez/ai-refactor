const Todo = require('../../../domain/entities/Todo');
const TodoRepository = require('../../../domain/repositories/TodoRepository');
const TodoModel = require('./TodoModel');

class TodoMongooseRepository extends TodoRepository {
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

    async create(todoData) {
        const todo = new TodoModel({
            title: todoData.title,
            description: todoData.description,
            completed: todoData.completed
        });
        const savedTodo = await todo.save();
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

    async update(id, todoData) {
        const updatedTodo = await TodoModel.findByIdAndUpdate(
            id,
            {
                title: todoData.title,
                description: todoData.description,
                completed: todoData.completed
            },
            { new: true } // Retorna el documento actualizado
        );

        if (!updatedTodo) return null;

        return new Todo(
            updatedTodo._id,
            updatedTodo.title,
            updatedTodo.description,
            updatedTodo.completed,
            updatedTodo.createdAt
        );
    }

    async delete(id) {
        const deletedTodo = await TodoModel.findByIdAndDelete(id);
        return !!deletedTodo; // Retorna true si se eliminó correctamente, false si no existía
    }
}

module.exports = TodoMongooseRepository; 