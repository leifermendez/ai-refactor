class CreateTodoUseCase {
    constructor(todoRepository) {
        this.todoRepository = todoRepository;
    }

    async execute(todoData) {
        if (!todoData.title) {
            throw new Error('El título es requerido');
        }

        try {
            return await this.todoRepository.create({
                _id: todoData.id,
                title: todoData.title,
                description: todoData.description,
                completed: todoData.completed || false
            });
        } catch (error) {
            throw new Error('Error al crear el todo');
        }
    }
}

module.exports = CreateTodoUseCase; 