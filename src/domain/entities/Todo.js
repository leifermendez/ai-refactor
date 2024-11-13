class Todo {
    constructor(id, title, description, completed, createdAt) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.completed = completed;
        this.createdAt = createdAt;
    }

    markAsCompleted() {
        this.completed = true;
    }

    update(title, description, completed) {
        if (title) this.title = title;
        if (description) this.description = description;
        if (completed !== undefined) this.completed = completed;
    }
}

module.exports = Todo; 