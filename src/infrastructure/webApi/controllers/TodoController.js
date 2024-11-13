/**
 * @swagger
 * components:
 *   schemas:
 *     Todo:
 *       type: object
 *       required:
 *         - title
 *       properties:
 *         id:
 *           type: string
 *           description: Auto-generated ID of the todo
 *         title:
 *           type: string
 *           description: Title of the todo
 *         completed:
 *           type: boolean
 *           description: Completion status of the todo
 */

/**
 * @swagger
 * /api/todos:
 *   get:
 *     summary: Returns all todos
 *     tags: [Todos]
 *     responses:
 *       200:
 *         description: List of todos
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Todo'
 */

/**
 * @swagger
 * /api/todos:
 *   post:
 *     summary: Create a new todo
 *     tags: [Todos]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *             properties:
 *               title:
 *                 type: string
 *               completed:
 *                 type: boolean
 *     responses:
 *       201:
 *         description: Todo created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Todo'
 */

/**
 * @swagger
 * /api/todos/{id}:
 *   put:
 *     summary: Update a todo by ID
 *     tags: [Todos]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Todo ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               completed:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Todo updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Todo'
 *       404:
 *         description: Todo not found
 */

/**
 * @swagger
 * /api/todos/{id}:
 *   delete:
 *     summary: Delete a todo by ID
 *     tags: [Todos]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Todo ID
 *     responses:
 *       200:
 *         description: Todo deleted successfully
 *       404:
 *         description: Todo not found
 */

class TodoController {
    constructor(getAllTodosUseCase, createTodoUseCase, updateTodoUseCase, deleteTodoUseCase) {
        this.getAllTodosUseCase = getAllTodosUseCase;
        this.createTodoUseCase = createTodoUseCase;
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
                description: req.body.description,
                completed: req.body.completed
            };

            const updatedTodo = await this.updateTodoUseCase.execute(todoId, todoData);
            if (!updatedTodo) {
                return res.status(404).json({ message: 'Tarea no encontrada' });
            }
            res.json(updatedTodo);
        } catch (error) {
            res.status(404).json({ message: error.message });
        }
    }

    async deleteTodo(req, res) {
        try {
            const todoId = req.params.id;
            const result = await this.deleteTodoUseCase.execute(todoId);
            if (!result) {
                return res.status(404).json({ message: 'Tarea no encontrada' });
            }
            res.json({ message: 'Tarea eliminada' });
        } catch (error) {
            res.status(404).json({ message: error.message });
        }
    }
}

module.exports = TodoController; 