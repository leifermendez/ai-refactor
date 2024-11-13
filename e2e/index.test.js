const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const app = require('../src/app');

let mongoServer;

beforeAll(async () => {
    // Ensure any existing connections are closed
    await mongoose.disconnect();

    // Create in-memory MongoDB instance for testing
    mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();

    // Connect with specific options to handle connection management
    await mongoose.connect(mongoUri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });
});

afterAll(async () => {
    // Ensure we close the connection completely
    if (mongoose.connection.readyState !== 0) {
        await mongoose.disconnect();
    }
    if (mongoServer) {
        await mongoServer.stop();
    }
});

beforeEach(async () => {
    // Limpiar la base de datos antes de cada test
    await mongoose.connection.db.dropDatabase();
});

describe('API Todo Tests', () => {
    describe('POST /api/todos', () => {
        it('debería crear una nueva tarea', async () => {
            const res = await request(app)
                .post('/api/todos')
                .send({
                    title: 'Test Todo',
                    description: 'Test Description'
                });

            expect(res.statusCode).toBe(201);
            expect(res.body.title).toBe('Test Todo');
            expect(res.body.description).toBe('Test Description');
            expect(res.body.completed).toBe(false);
        });

        it('debería fallar al crear una tarea sin título', async () => {
            const res = await request(app)
                .post('/api/todos')
                .send({
                    description: 'Test Description'
                });

            expect(res.statusCode).toBe(400);
        });
    });

    describe('GET /api/todos', () => {
        it('debería obtener una lista vacía de tareas', async () => {
            const res = await request(app).get('/api/todos');
            expect(res.statusCode).toBe(200);
            expect(res.body).toEqual([]);
        });

        it('debería obtener todas las tareas creadas', async () => {
            // Crear una tarea primero
            await request(app)
                .post('/api/todos')
                .send({
                    title: 'Test Todo',
                    description: 'Test Description'
                });

            const res = await request(app).get('/api/todos');
            expect(res.statusCode).toBe(200);
            expect(res.body.length).toBe(1);
            expect(res.body[0].title).toBe('Test Todo');
        });
    });

    describe('PUT /api/todos/:id', () => {
        it('debería actualizar una tarea existente', async () => {
            // Crear una tarea primero
            const todo = await request(app)
                .post('/api/todos')
                .send({
                    title: 'Test Todo',
                    description: 'Test Description'
                });

            const res = await request(app)
                .put(`/api/todos/${todo.body._id}`)
                .send({
                    title: 'Updated Todo',
                    completed: true
                });

            expect(res.statusCode).toBe(200);
            expect(res.body.title).toBe('Updated Todo');
            expect(res.body.completed).toBe(true);
        });

        it('debería retornar 404 para una tarea que no existe', async () => {
            const res = await request(app)
                .put('/api/todos/123456789012345678901234')
                .send({
                    title: 'Updated Todo'
                });

            expect(res.statusCode).toBe(404);
        });
    });

    describe('DELETE /api/todos/:id', () => {
        it('debería eliminar una tarea existente', async () => {
            // Crear una tarea primero
            const todo = await request(app)
                .post('/api/todos')
                .send({
                    title: 'Test Todo',
                    description: 'Test Description'
                });

            const res = await request(app)
                .delete(`/api/todos/${todo.body._id}`);

            expect(res.statusCode).toBe(200);

            // Verificar que la tarea fue eliminada
            const checkTodo = await request(app).get('/api/todos');
            expect(checkTodo.body.length).toBe(0);
        });

        it('debería retornar 404 para una tarea que no existe', async () => {
            const res = await request(app)
                .delete('/api/todos/123456789012345678901234');

            expect(res.statusCode).toBe(404);
        });
    });
});
