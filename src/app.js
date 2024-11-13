const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const TodoMongooseRepository = require('./infrastructure/database/mongoose/TodoMongooseRepository');
const GetAllTodosUseCase = require('./domain/useCases/todo/GetAllTodosUseCase');
const TodoController = require('./infrastructure/webApi/controllers/TodoController');
const swaggerUI = require('swagger-ui-express');
const swaggerJsDoc = require('swagger-jsdoc');
const CreateTodoUseCase = require('./domain/useCases/todo/CreateTodoUseCase');
const UpdateTodoUseCase = require('./domain/useCases/todo/UpdateTodoUseCase');
const DeleteTodoUseCase = require('./domain/useCases/todo/DeleteTodoUseCase');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Conexión a MongoDB
mongoose.connect('mongodb://localhost:27017/todo-app', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

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
    apis: ['./src/infrastructure/webApi/controllers/*.js'], // Actualizado para apuntar a los controllers
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerDocs));

// Configuración de dependencias
const todoRepository = new TodoMongooseRepository();
const getAllTodosUseCase = new GetAllTodosUseCase(todoRepository);
const createTodoUseCase = new CreateTodoUseCase(todoRepository);
const updateTodoUseCase = new UpdateTodoUseCase(todoRepository);
const deleteTodoUseCase = new DeleteTodoUseCase(todoRepository);
const todoController = new TodoController(
    getAllTodosUseCase,
    createTodoUseCase,
    updateTodoUseCase,
    deleteTodoUseCase
);

// Rutas
app.get('/api/todos', (req, res) => todoController.getAllTodos(req, res));
app.post('/api/todos', (req, res) => todoController.createTodo(req, res));
app.put('/api/todos/:id', (req, res) => todoController.updateTodo(req, res));
app.delete('/api/todos/:id', (req, res) => todoController.deleteTodo(req, res));

// Iniciar el servidor
if (require.main === module) {
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
        console.log(`Servidor corriendo en puerto ${PORT}`);
    });
}

module.exports = app;
