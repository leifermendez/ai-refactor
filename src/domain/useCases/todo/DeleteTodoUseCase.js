class DeleteTodoUseCase {
    constructor(todoRepository) {
        this.todoRepository = todoRepository;
    }

    async execute(id) {
        if (!id) {
            throw new Error('El ID es requerido');
        }

        try {
            const existingTodo = await this.todoRepository.findById(id);
            if (!existingTodo) {
                throw new Error('Todo no encontrado');
            }

            await this.todoRepository.delete(id);
            return true;
        } catch (error) {
            throw new Error('Error al eliminar el todo');
        }
    }
}

module.exports = DeleteTodoUseCase; 