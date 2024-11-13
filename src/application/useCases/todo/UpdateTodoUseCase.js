const Todo = require('../../models/Todo');

class UpdateTodoUseCase {
    async execute(id, todoData) {
        try {
            const todo = await Todo.findById(id);
            if (!todo) {
                throw new Error('Tarea no encontrada');
            }

            todo.title = todoData.title || todo.title;
            todo.description = todoData.description || todo.description;
            todo.completed = todoData.completed || todo.completed;

            return await todo.save();
        } catch (error) {
            throw new Error(error.message);
        }
    }
}

module.exports = UpdateTodoUseCase; 