const Todo = require("../../../domain/entities/Todo");

class GetAllTodosUseCase {
    async execute() {
        try {
            return await Todo.find();
        } catch (error) {
            throw new Error(error.message);
        }
    }
}

module.exports = GetAllTodosUseCase; 