const { _reset, create, getAll, getByStatus, getStats, update, findById, remove, completeTask, getPaginated } = require("../src/services/taskService")

describe("taskService", () => {

  beforeEach(() => {
    _reset()
  })

  test('creates todo function', () => {
    const title = "first todo";
    let task = create({
      title: title,
      status: "in_progress",
      description: 'something',
    });
    expect(task.status).toBe("in_progress")
    expect(task.title).toBe(title)
    expect(task.description).toBe('something')
  })

  test('getAll returns created todos', () => {
    const title = "first";
    let task = create({
      title,
    })
    const tasks = getAll();
    expect(tasks).toContainEqual(task);
  })

  test('getByStatus returns filtered todos', () => {
    create({
      title: "third todo",
      status: "in_progress"
    });

    const tasks = getByStatus('in_progress');
    tasks.map(t => {
      expect(t.status).toBe('in_progress')
      expect(t.status).not.toBe('todo')
      expect(t.status).not.toBe('done')
    });
  })

  test('getStats returns status count of all todos', () => {
    create({
      title: "todo",
    });
    create({
      title: "todo 2",
    });
    let counts = getStats()
    expect(counts.todo).toBe(2)
    expect(counts.in_progress).toBe(0)
    expect(counts.done).toBe(0)
  })

  test('update function updates the todo', () => {
    const task = create({
      title: "todo"
    })

    const data = {
      description: "updated todo description",
      priority: "high",
    }
    update(task.id, data)
    const foundTask = findById(task.id)
    expect(foundTask.description).toBe("updated todo description");
    expect(foundTask.priority).toBe("high");
  });

  test("remove function removes the task", () => {
    const task = create({
      title: "todo"
    })
    const removed = remove(task.id);
    expect(removed).toBe(true);

    const findTodo = findById(task.id)
    expect(findTodo).toBe(undefined)
  });

  test("completeTask() marks task as done", () => {
    const task = create({
      title: "todo"
    });

    completeTask(task.id)
    const foundTask = findById(task.id)

    expect(foundTask.status).toBe("done")
  });

  test("getPaginated returns only limited todos", () => {
    for (let i = 0; i < 4; i++) {
      create({
        title: Math.random().toString(36).substring(2, 7)
      })
    }
    const todos = getPaginated(0, 3)
    expect(todos.length).toBe(3)

  })


});
