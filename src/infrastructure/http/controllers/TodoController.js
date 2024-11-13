class TodoController {
    constructor(
        createTodoUseCase,
        getAllTodosUseCase,
        updateTodoUseCase,
        deleteTodoUseCase
    ) {
        this.createTodoUseCase = createTodoUseCase;
        this.getAllTodosUseCase = getAllTodosUseCase;
        this.updateTodoUseCase = updateTodoUseCase;
        this.deleteTodoUseCase = deleteTodoUseCase;
    }

    async getAllTodos(req, res) {
        try {
            const todos = await this.getAllTodosUseCase.execute();
            res.json(todos);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    async createTodo(req, res) {
        try {
            const todoData = {
                title: req.body.title,
                description: req.body.description
            };
            const newTodo = await this.createTodoUseCase.execute(todoData);
            res.status(201).json(newTodo);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }

    async updateTodo(req, res) {
        try {
            const todoId = req.params.id;
            const todoData = {
                title: req.body.title,
                description: req.body.description
            };
            const updatedTodo = await this.updateTodoUseCase.execute(todoId, todoData);
            if (!updatedTodo) {
                return res.status(404).json({ message: 'Todo not found' });
            }
            res.json(updatedTodo);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }

    async deleteTodo(req, res) {
        try {
            const todoId = req.params.id;
            const result = await this.deleteTodoUseCase.execute(todoId);
            if (!result) {
                return res.status(404).json({ message: 'Todo not found' });
            }
            res.status(204).send();
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }
}

module.exports = TodoController; 