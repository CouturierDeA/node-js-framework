import { TodoService } from "../../components/todo/TodoService";
import {
    Controller,
    GetMapping,
    PathVariable,
    PostMapping,
    FormBody,
} from "../../framework/controller/controller";
import { Autowired } from "../../framework/component/";
import GSX from '../../framework/gsx';
import {ErrorPage, GoTo, TodoPage} from '../../templates/default';
import { TodoItem, TodoList } from '../../templates/todo-list';
import { TodoForm } from '../../templates/todo-form';
import {TodoDto} from '../../dto/TodoDto';
import { ITodo } from '../../structs/todo/todo';

@Controller({
    url: '/todo',
})
export class ViewTodoController {
    @Autowired()
    todoService: TodoService

    @GetMapping('')
    async todoListPageView() {
        const todoList = await this.todoService.getTodoList() || [];
        return (
            <TodoPage title={'Todo Page'}>
                <TodoList todoList={todoList}/>
                <GoTo to={'/todo/add'}>Add New</GoTo>
            </TodoPage>
        )
    }

    @GetMapping('{todoId}')
    async getTodoPage(
        @PathVariable() todoId: number,
    ) {
        try {
            const todo = await this.todoService.getTodo(todoId);
            return (
                <TodoPage title={todo.title}>
                    <TodoItem todo={todo}>{todo.title}</TodoItem>
                    <a href={`/todo/edit/${todo.id}`}>Edit</a>
                    <GoTo to={'/todo'}/>
                </TodoPage>
            )
        } catch (e: unknown) {
            return (
                <ErrorPage title={`Get Todo ${todoId} error`}>
                    <GoTo to={'/todo'}/>
                </ErrorPage>
            )
        }
    }

    @GetMapping('/edit/{todoId}')
    async getEditTodoPage(
        @PathVariable() todoId: number,
    ) {
        try {
            const todo = await this.todoService.getTodo(todoId);
            return this.getTodoEditForm(todo);
        } catch (e: unknown) {
            return (
                <ErrorPage title={`Get Todo ${todoId} error`}>
                    <GoTo to={`/edit/${todoId}`}>{ this.getErrorMessage(e) }</GoTo>
                </ErrorPage>
            )
        }
    }

    @PostMapping('/edit/{todoId}')
    async postEditTodoPage(
        @PathVariable() todoId: number,
        @FormBody() todo: TodoDto,
    ) {
        try {
            const newTodo = await this.todoService.editTodo({ ...todo, id: todoId });
            const message = `Successfully updated ${todoId}`;
            return this.getTodoEditForm(newTodo, message)
        } catch (e: unknown) {
            return this.getTodoEditForm(todo, this.getErrorMessage(e))
        }
    }

    @GetMapping('/add')
    async getAddTodo() {
        return this.getTodoAddForm();
    }

    @PostMapping('/add')
    async postAddTodo(
        @FormBody() todo: TodoDto,
    ) {
       try {
           const newTodo =  await this.todoService.addTodo(todo);
           const message = `Successfully added ${newTodo.id}`;
           return this.getTodoEditForm(newTodo, message)
       } catch (e: unknown) {
           return this.getTodoAddForm(todo, this.getErrorMessage(e))
       }
    }

    getTodoEditForm<T extends ITodo>(todo: T,  message?: string) {
        return (
            <TodoPage title={todo.title}>
                <TodoForm
                    title="Edit todo"
                    todo={todo}
                    action={`/todo/edit/${todo.id}`}
                />
                { message && <div>{ message }</div> }
                <GoTo to={'/todo'}/>
            </TodoPage>
        )
    }

    getTodoAddForm<T extends ITodo>(todo?: T, message?: string) {
        return (
            <TodoPage title={'Add new todo'}>
                <TodoForm todo={todo} action={`/todo/add`}/>
                { message && <div>{ message }</div> }
                <GoTo to={'/todo'}/>
            </TodoPage>
        )
    }

    protected getErrorMessage(e: unknown) {
        return (e as Error)?.message || 'Unknown error';
    }
}
