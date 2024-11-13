class UpdateTodoUseCase {
    constructor(todoRepository) {
        this.todoRepository = todoRepository;
    }

    async execute(id, todoData) {
        if (!id) {
            throw new Error('El ID es requerido');
        }

        try {
            const existingTodo = await this.todoRepository.findById(id);
            if (!existingTodo) {
                throw new Error('Todo no encontrado');
            }

            return await this.todoRepository.update(id, {
                title: todoData.title,
                description: todoData.description,
                completed: todoData.completed
            });
        } catch (error) {
            throw new Error('Error al actualizar el todo');
        }
    }
}

module.exports = UpdateTodoUseCase; 