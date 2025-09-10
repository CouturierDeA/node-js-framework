import { Autowired, Component } from '../../framework/component';
import { ITodo, ITodoPayload } from '../../structs/todo/todo';
import { TodoValidationService } from './TodoValidationService';
import { TodoRepository } from './TodoRepository';

@Component()
export class TodoService {
    @Autowired()
    validator: TodoValidationService;

    @Autowired()
    todoRepository: TodoRepository;

    watch(cb: () => void) {
        this.todoRepository.watch(cb);
    }

    async getTodoList(...args: string[]): Promise<ITodo[]> {
        return await this.todoRepository.getTodoList(...args);
    }

    async getTodo(id: number): Promise<ITodo> {
        return await this.todoRepository.getTodo(id);
    }

    async addTodo(todo: ITodoPayload): Promise<ITodo> {
        const { todoRepository, validator } = this;
        await validator.uniqueTitle(todo.title);
        return await todoRepository.addTodo(todo);
    }

    async editTodo(todo: ITodo): Promise<ITodo> {
        const { todoRepository, validator } = this;
        await validator.uniqueTitle(todo.title, todo.id);
        await validator.validateTodo(todo);
        return await todoRepository.editTodo(todo);
    }

    async deleteTodo(id: number): Promise<number> {
        const { todoRepository, validator } = this;
        await validator.checkTodoExist(id);
        await todoRepository.deleteTodo(id);
        return id;
    }
}
