class GetAllTodosUseCase {
    constructor(todoRepository) {
        this.todoRepository = todoRepository;
    }

    async execute() {
        try {
            return await this.todoRepository.findAll();
        } catch (error) {
            throw new Error('Error al obtener todos los todos');
        }
    }
}

module.exports = GetAllTodosUseCase; 