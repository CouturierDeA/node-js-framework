import TSX from '../framework/tsx';
import { ITodo } from '../structs/todo/todo';

export function TodoItem({ todo }: { todo: ITodo }, content?: typeof TSX) {
    return (
        <>
            <h3>{content || <a href={`/todo/${todo.id}`}>{todo.title}</a>}</h3>
            <p>{todo.description}</p>
        </>
    );
}

export function TodoList({
    todoList,
    todoSlot,
}: {
    todoList: ITodo[];
    todoSlot?: typeof TodoItem;
}) {
    return (
        <ul class="todo-list">
            {todoList.map((todo) => (
                <li class="todo-li" data-id={todo.id}>
                    {todoSlot ? todoSlot({ todo }) : <TodoItem todo={todo} />}
                    <a href={`/todo/edit/${todo.id}`}>Edit</a>
                </li>
            ))}
        </ul>
    );
}
