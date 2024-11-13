const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const swaggerUI = require('swagger-ui-express');
const swaggerJsDoc = require('swagger-jsdoc');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Conexión a MongoDB
mongoose.connect('mongodb://localhost:27017/todo-app', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

// Definir el esquema para las tareas
const todoSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String },
    completed: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now }
});

const Todo = mongoose.model('Todo', todoSchema);

// Configuración de Swagger
const swaggerOptions = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'API de Tareas (TODO)',
            version: '1.0.0',
            description: 'API REST para gestionar tareas',
        },
        servers: [
            {
                url: 'http://localhost:3000',
            },
        ],
    },
    apis: ['./src/app.js'],
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerDocs));

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
app.get('/api/todos', async (req, res) => {
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
app.post('/api/todos', async (req, res) => {
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
app.put('/api/todos/:id', async (req, res) => {
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
app.delete('/api/todos/:id', async (req, res) => {
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

// Iniciar el servidor
if (require.main === module) {
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
        console.log(`Servidor corriendo en puerto ${PORT}`);
    });
}

module.exports = app;
