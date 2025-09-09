import {App} from "./framework/app";

import {CommonController} from "./controllers/common/CommonController";
import {RestTodoController} from "./controllers/todo/RestTodoController";
import {ViewTodoController} from "./controllers/todo/ViewTodoController";

import {TodoRepository} from "./components/todo/TodoRepository";
import {TodoService} from "./components/todo/TodoService";
import {ServerEvents} from "./components/common/ServerEvents";
import {TodoValidationService} from "./components/todo/TodoValidationService";

export const init = async () => {
    const app = new App()
        .useComponents([
            TodoRepository,
            TodoValidationService,
            TodoService,
            ServerEvents
        ])
        .useControllers([
            RestTodoController,
            ViewTodoController,
            CommonController
        ])
    return await app.init();
}
