const eventSource = new EventSource('/todo/api/subscribe-todo-list');

eventSource.addEventListener('todo-list-updated', (event) => {
    console.log('todo-list-updated');
    location.reload();
});
