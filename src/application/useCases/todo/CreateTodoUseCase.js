const Todo = require('../../models/Todo');

class CreateTodoUseCase {
    async execute(todoData) {
        try {
            const todo = new Todo({
                title: todoData.title,
                description: todoData.description
            });
            return await todo.save();
        } catch (error) {
            throw new Error(error.message);
        }
    }
}

module.exports = CreateTodoUseCase; 