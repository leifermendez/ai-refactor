class Todo {
    constructor(id, title, description, completed = false, createdAt = new Date()) {
        this._id = id;
        this.title = title;
        this.description = description;
        this.completed = completed;
        this.createdAt = createdAt;
    }
}

module.exports = Todo; 