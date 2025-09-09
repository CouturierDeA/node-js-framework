import {ITodo} from "../structs/todo/todo";
import {DTOValidator, minMaxLength, required} from "../framework/dto/validators";
import {ApiException} from "../framework/exceptions/exceptions";

@DTOValidator(ApiException.userError)
export class TodoDto implements ITodo {
    constructor(todo: TodoDto) {
        Object.assign(this, todo);
    }
    id: number;
    @required
    @minMaxLength(3, 250)
    title: string
    @minMaxLength(3, 250)
    description: string
}
