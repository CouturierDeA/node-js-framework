import {ApiException} from "../../framework/exceptions/exceptions";
import {Autowired, Component} from "../../framework/component";
import {TodoRepository} from "./TodoRepository";
import {ITodo} from "../../structs/todo/todo";

@Component()
export class TodoValidationService {
    @Autowired()
    todoRepository: TodoRepository

    async checkTodoExist(id: ITodo['id']) {
        const hasTodo = await this.todoRepository.todoExist(id);
        if (!hasTodo) {
            throw ApiException.userError(`Cant Find todo with id ${id}`)
        }
    }

    async validateTodo(todo: ITodo) {
        await this.checkTodoExist(todo?.id);
    }

    async uniqueTitle(title: string, todoId?: number) {
        const exist = await this.todoRepository.findTodoWithTitle(title, todoId)
        if (!!exist) {
            throw ApiException.userError(`Todo title is not unique ${title}`)
        }
    }
}
