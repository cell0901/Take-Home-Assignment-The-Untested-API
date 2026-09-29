const request = require("supertest");

const app = require("../src/app");
const { _reset } = require("../src/services/taskService");

describe("routes", () => {

  beforeEach(() => {
    _reset()
  });

  test("POST /tasks creates task", async () => {
    const res = await request(app).post('/tasks').send({
      title: "todo",
      description: "desc for todo"
    })
    expect(res.status).toBe(201)
    expect(res.body.title).toBe("todo")

  })

  test("POST /tasks should fail on empty title", async () => {
    const res = await request(app).post('/tasks').send({
    })
    expect(res.status).not.toBe(201);
    expect(res.status).toBe(400);
  })

  test("GET /tasks returns all the tasks", async () => {
    await request(app).post('/tasks').send({
      title: "todo 1"
    })
    await request(app).post('/tasks').send({
      title: "todo 2"
    })

    const tasks = await request(app).get('/tasks')

    expect(tasks.status).toBe(200)
    expect(tasks.body.length).toBe(2)
  });

  test("GET /tasks get tasks by query filters", async () => {
    await request(app).post('/tasks').send({
      title: "todo",
    })

    await request(app).post('/tasks').send({
      title: "todo",
      status: "in_progress"
    })

    const tasks = await request(app).get("/tasks?status=todo")

    expect(tasks.body.length).toBe(1)
  });

  test("PUT /tasks/:id updates the task with new data", async () => {
    const task = await request(app).post('/tasks').send({
      title: "todo",
    })

    expect(task.body.status).toBe("todo");
    const data = {
      description: "new description",
      status: "done"
    };
    const res = await request(app).put(`/tasks/${task.body.id}`).send(data)
    expect(res.status).toBe(200);
    expect(res.body.description).toBe(data.description);
    expect(res.body.status).toBe(data.status);
  });

  test("DELETE /tasks/:id should remove task", async () => {
    const task = await request(app).post('/tasks').send({
      title: "todo",
    });

    const res = await request(app).delete(`/tasks/${task.body.id}`)
    expect(res.status).toBe(204);

    const getTasks = await request(app).get('/tasks');
    expect(getTasks.body.length).toBe(0);
  });

  test("DELETE /tasks/:id should fail on wrong Id", async () => {
    await request(app).post('/tasks').send({
      title: "todo",
    });

    const res = await request(app).delete(`/tasks/${'somerandomid'}`)
    expect(res.status).toBe(404);
  });

  test("PATCH /tasks/:id/complete should mark task as done", async () => {
    const task = await request(app).post('/tasks').send({
      title: "todo",
    });

    expect(task.body.status).toBe("todo");

    const res = await request(app).patch(`/tasks/${task.body.id}/complete`)

    expect(res.status).toBe(200)
    expect(res.body.status).toBe("done")
  });

  test("GET /tasks/stats should return all todos status", async () => {
    await request(app).post('/tasks').send({
      title: "todo",
    });
    await request(app).post('/tasks').send({
      title: "todo 2",
      status: "in_progress"
    });

    await request(app).post('/tasks').send({
      title: "todo 2",
      dueDate: (new Date(Date.now() - 60 * 60 * 1000)).toISOString() // 1 hr ago
    });

    const res = await request(app).get("/tasks/stats")

    expect(res.status).toBe(200)
    expect(res.body.todo).toBe(2)
    expect(res.body.in_progress).toBe(1)
    expect(res.body.overdue).toBe(1)
  });
})
