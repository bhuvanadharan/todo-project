package todo_backend.service;

import org.springframework.stereotype.Service;
import todo_backend.model.Todo;
import todo_backend.repository.TodoRepository;

import java.util.List;
import java.util.Optional;

@Service
public class TodoService {

    private final TodoRepository todoRepository;

    public TodoService(TodoRepository todoRepository) {
        this.todoRepository = todoRepository;
    }

    // Create
    public Todo createTodo(Todo todo) {
        return todoRepository.save(todo);
    }

    // Read all
    public List<Todo> getAllTodos() {
        return todoRepository.findAll();
    }

    // Read one
    public Optional<Todo> getTodoById(Long id) {
        return todoRepository.findById(id);
    }

    // Update
    public Todo updateTodo(Long id, Todo updatedTodo) {
        Todo existingTodo = todoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Todo not found"));

        existingTodo.setTitle(updatedTodo.getTitle());
        existingTodo.setDescription(updatedTodo.getDescription());
        existingTodo.setCompleted(updatedTodo.isCompleted());

        return todoRepository.save(existingTodo);
    }

    // Delete
    public void deleteTodo(Long id) {
        todoRepository.deleteById(id);
    }
}