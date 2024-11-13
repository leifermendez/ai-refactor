const Todo = require('../../models/Todo');

class DeleteTodoUseCase {
    async execute(id) {
        try {
            const todo = await Todo.findById(id);
            if (!todo) {
                throw new Error('Tarea no encontrada');
            }
            await todo.deleteOne();
            return { message: 'Tarea eliminada' };
        } catch (error) {
            throw new Error(error.message);
        }
    }
}

module.exports = DeleteTodoUseCase; 