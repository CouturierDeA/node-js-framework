import {ITodo, ITodoPayload} from "../../structs/todo/todo";
import {read, write, watch, unwatch} from "../../json-db/source";
import {Component} from "../../framework/component";
import {ApiException} from "../../framework/exceptions/exceptions";
import {jsonToString, stringToJson} from "../../framework/dto/Serializable";

@Component()
export class TodoRepository {
    src: string = 'todo-list.json'

    async getTodoList(title?: string) {
        const res: ITodo[] = await this.readTodoList();
        return res.filter(todo => {
            if (!title) return true;
            return todo.title?.trim().toLowerCase() === title?.trim().toLowerCase()
        });
    }

    async readTodoList() {
        const data = await read(this.src);
        return stringToJson<ITodo[]>(data);
    }

    async writeTodoList(newTodoList: ITodo[]) {
        await write(this.src, jsonToString(newTodoList));
    }

    async getTodo(id: number) {
        const todoList = await this.getTodoList();
        return todoList?.find(todo => todo.id === id);
    }

    async addTodo(todo: ITodoPayload) {
        const todoList = await this.getTodoList()
        const newTodo: ITodo = {
            ...todo,
            id: this.generateId(todoList),
        }
        const newTodoList = [...todoList, newTodo]
        await this.writeTodoList(newTodoList);
        return newTodo
    }

    async editTodo(todo: ITodo) {
        const todoList = await this.getTodoList();
        const index = todoList.findIndex(todoI => todoI.id === todo.id);
        todoList.splice(index, 1, todo);
        await this.writeTodoList(todoList);
        return todo
    }

    async deleteTodo(id: number) {
        const todoList = await this.getTodoList();
        const newTodoList = todoList.filter(todo => todo.id !== id);
        await this.writeTodoList(newTodoList);
        return todoList.length - newTodoList.length;
    }

    async todoExist(id: number) {
        const todo = await this.getTodo(id);
        return !!todo
    }

    async findTodoWithTitle(title?: string, entityId?: number) {
        const todoList = await this.getTodoList();
        return todoList.find(todo => todo.id !== entityId && todo.title === title)
    }

    private generateId(todoList: ITodo[]) {
        let id = todoList.length;
        let guard = 0;
        do {
            id += 1;
            guard += 1;
            if (guard > todoList.length + 1) {
                throw ApiException.internal('Todo list Id generates to long');
            }
        } while (todoList.some(tI => tI.id === id));
        return id;
    }

    watch(callback: () => void) {
        watch(this.src, callback);
    }

    unwatch(callback: () => void) {
        unwatch(this.src, callback);
    }
}
