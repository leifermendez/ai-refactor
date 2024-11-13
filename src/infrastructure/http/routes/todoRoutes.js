const express = require('express');
const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Todo:
 *       type: object
 *       required:
 *         - title
 *       properties:
 *         title:
 *           type: string
 *           description: Título de la tarea
 *         description:
 *           type: string
 *           description: Descripción de la tarea
 *         completed:
 *           type: boolean
 *           description: Estado de la tarea
 *         createdAt:
 *           type: string
 *           format: date
 *           description: Fecha de creación
 */

/**
 * @swagger
 * /api/todos:
 *   get:
 *     summary: Obtiene todas las tareas
 *     tags: [Todos]
 *     responses:
 *       200:
 *         description: Lista de tareas
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Todo'
 */
router.get('/', async (req, res) => {
    try {
        const getAllTodos = new GetAllTodosUseCase();
        const todos = await getAllTodos.execute();
        res.json(todos);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

/**
 * @swagger
 * /api/todos:
 *   post:
 *     summary: Crea una nueva tarea
 *     tags: [Todos]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Todo'
 *     responses:
 *       201:
 *         description: Tarea creada exitosamente
 */
router.post('/', async (req, res) => {
    try {
        const createTodo = new CreateTodoUseCase();
        const newTodo = await createTodo.execute(req.body);
        res.status(201).json(newTodo);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

/**
 * @swagger
 * /api/todos/{id}:
 *   put:
 *     summary: Actualiza una tarea
 *     tags: [Todos]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID de la tarea
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Todo'
 *     responses:
 *       200:
 *         description: Tarea actualizada exitosamente
 */
router.put('/:id', async (req, res) => {
    try {
        const updateTodo = new UpdateTodoUseCase();
        const updatedTodo = await updateTodo.execute(req.params.id, req.body);
        res.json(updatedTodo);
    } catch (error) {
        if (error.message === 'Tarea no encontrada') {
            res.status(404).json({ message: error.message });
        } else {
            res.status(400).json({ message: error.message });
        }
    }
});

/**
 * @swagger
 * /api/todos/{id}:
 *   delete:
 *     summary: Elimina una tarea
 *     tags: [Todos]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID de la tarea
 *     responses:
 *       200:
 *         description: Tarea eliminada exitosamente
 */
router.delete('/:id', async (req, res) => {
    try {
        const deleteTodo = new DeleteTodoUseCase();
        const result = await deleteTodo.execute(req.params.id);
        res.json(result);
    } catch (error) {
        if (error.message === 'Tarea no encontrada') {
            res.status(404).json({ message: error.message });
        } else {
            res.status(500).json({ message: error.message });
        }
    }
});

module.exports = router;
