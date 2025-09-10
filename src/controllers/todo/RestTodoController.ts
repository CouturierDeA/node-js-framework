import { Autowired, Created } from '../../framework/component/';
import {
    Controller,
    GetMapping,
    PostMapping,
    DeleteMapping,
    PathVariable,
    RequestBody,
    QueryParam,
    PutMapping,
    PatchMapping,
    Response,
    RequestMiddleware,
} from '../../framework/controller/controller';

import { TodoService } from '../../components/todo/TodoService';
import { ServerEvents } from '../../components/common/ServerEvents';
import { TodoDto } from '../../dto/TodoDto';
import { ResponseEntity } from '../../framework/entities/ResponseEntity';

@Controller({
    url: '/todo/api',
})
export class RestTodoController {
    @RequestMiddleware('/**', '*')
    serveHeaders(@Response() res: ResponseEntity) {
        res.addHeaders({
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Request-Method': '*',
            'Access-Control-Allow-Methods':
                'GET, OPTIONS, HEAD, POST, PUT, PATCH, DELETE',
            'Access-Control-Allow-Headers': '*',
        });
    }

    async todoUpdateEvent() {
        return this.se.emitData('todo-list-updated');
    }

    @Created()
    async watchDataSource() {
        this.todoService.watch(this.todoUpdateEvent);
    }

    @Autowired()
    se: ServerEvents;

    @Autowired()
    todoService: TodoService;

    @GetMapping('/todo')
    async apiGetTodoList(@QueryParam() title: string) {
        return (await this.todoService.getTodoList(title)) || [];
    }

    @GetMapping('/get-todo/{todoId}')
    async apiGetTodo(@PathVariable() todoId: number) {
        return await this.todoService.getTodo(todoId);
    }

    @PutMapping('/todo')
    @PostMapping('/todo')
    async apiAddTodo(@RequestBody() todo: TodoDto) {
        return await this.todoService.addTodo(todo);
    }

    @PatchMapping('/todo/{todoId}')
    async apiPatchTodo(@RequestBody() todo: TodoDto) {
        return await this.todoService.editTodo(todo);
    }

    @DeleteMapping('/todo/{todoId}')
    async apiDeleteTodo(@PathVariable() todoId: number) {
        await this.todoService.deleteTodo(todoId);
    }

    @GetMapping('/subscribe-todo-list')
    async apiSubscribeTodoList(@Response() response: ResponseEntity) {
        return await this.se.init(response);
    }
}
