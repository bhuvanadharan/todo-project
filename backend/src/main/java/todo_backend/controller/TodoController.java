
package todo_backend.controller;

import org.springframework.web.bind.annotation.*;
import todo_backend.model.Todo;
import todo_backend.service.TodoService;

import java.util.List;

@RestController
@CrossOrigin(origins = {
        "http://localhost:5173",
        "https://todo-project-bhuvanadharang-5980.vercel.app"
})
@RequestMapping("/api/todos")
public class TodoController {

    private final TodoService todoService;

    public TodoController(TodoService todoService) {
        this.todoService = todoService;
    }

    @GetMapping
    public List<Todo> getAllTodos() {
        return todoService.getAllTodos();
    }

    @GetMapping("/{id}")
    public Todo getTodoById(@PathVariable Long id) {
        return todoService.getTodoById(id)
                .orElseThrow(() -> new RuntimeException("Todo not found"));
    }

    @PostMapping
    public Todo createTodo(@RequestBody Todo todo) {
        return todoService.createTodo(todo);
    }

    @PutMapping("/{id}")
    public Todo updateTodo(@PathVariable Long id,
                           @RequestBody Todo todo) {
        return todoService.updateTodo(id, todo);
    }

    @DeleteMapping("/{id}")
    public void deleteTodo(@PathVariable Long id) {
        todoService.deleteTodo(id);
    }
}
