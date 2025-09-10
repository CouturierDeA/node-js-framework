import GSX from '../framework/gsx';
import {ITodo} from '../structs/todo/todo';

type TodoFormProps = { todo?: ITodo, action: string, disabled?: boolean, title?: string };

export function TodoForm({todo, action, title = 'Add todo'}: TodoFormProps) {
    return (
        <div>
            <form
                className="todo-form"
                method={'POST'}
                action={action}
            >
                <p>{title}</p>
                <fieldset>
                    <input
                        type="text"
                        name={'title'}
                        value={todo?.title || ''}
                        required
                        placeholder="Enter title"
                        minLength={3}
                        maxLength={250}
                    />
                </fieldset>
                <fieldset>
                    <input
                        type="text"
                        name={'description'}
                        placeholder="Enter description"
                        value={todo?.description || ''}
                        minLength={3}
                        maxLength={250}
                    />
                </fieldset>
                <fieldset>
                    <button type={'submit'}>Submit</button>
                </fieldset>
            </form>
        </div>
    )
}
