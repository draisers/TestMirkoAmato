import request from "supertest";
require("chai").should();
import { app } from "../app";
import { Course } from "../models/Courses";

const baseCourse = "/v1/courses";
const newCategory = "category-1"

const course = {
    name: "name-1",
    category: "category-1",
    duration: 120,
    cost: 100,
    maxSubscribers: 30
}

const newCourse = {
    name: "name-1",
    category: "category-1",
    duration: 120,
    cost: 100,
}

describe("create course", () => {
    let id: string;
    after(async () => {
      await Course.findByIdAndDelete(id);
    });
    it("Failed test 400", async () => {
      const { status } = await request(app).post(baseCourse).send(newCourse);
      status.should.be.equal(400);
    });
    it("Success test 201", async () => {
      const { status, body } = await request(app)
        .post(baseCourse)
        .send(course)
      status.should.be.equal(201);
      body.should.have.property("_id");
      body.should.have.property("name").equal(course.name);
      body.should.have.property("category").equal(course.category);
      body.should.have.property("duration").equal(course.duration);
      body.should.have.property("cost").equal(course.cost);
      body.should.have.property("maxSubscribers").equal(course.maxSubscribers);
      id = body._id;
    });
});

describe("Delete product", () => {
    let id: string;
    before(async () => {
      const p = await Course.create(course);
      id = p._id.toString();
    });
    it("Test error 404", async () => {
        const newID = "1" + id.substring(1);
        const { status } = await request(app)
        .delete(`${baseCourse}/${newID}`)
        .send({ ...course, category: newCategory })
        status.should.be.equal(404);
    });
    it("Test success 200", async () => {
        const { status } = await request(app)
        .delete(`${baseCourse}/${id}`)
        status.should.be.equal(200);
    });
});

describe(":id", () => {
    let id: string;
    before(async () => {
      const p = await Course.create(course);
      id = p._id.toString();
    });
    after(async () => {
      await Course.findByIdAndDelete(id);
    });
    it("Test success 200", async () => {
      const { status, body } = await request(app).get(`${baseCourse}/${id}`);
      status.should.be.equal(200);
      body.should.have.property("_id").equal(id);
      body.should.have.property("name").equal(course.name);
      body.should.have.property("category").equal(course.category);
      body.should.have.property("duration").equal(course.duration);
      body.should.have.property("cost").equal(course.cost);
      body.should.have.property("maxSubscribers").equal(course.maxSubscribers);
    });
    it("Test error 404", async () => {
      const fakeId = "1" + id.substring(1);
      const { status } = await request(app).get(`${baseCourse}/${fakeId}`);
      status.should.be.equal(404);
    });
});

describe("Get products", () => {
    let ids: string[] = [];
    const courses = [
      {
        name: "name-1",
        category: "category-1",
        duration: 120,
        cost: 100,
        maxSubscribers: 30
      },
      {
        name: "name-2",
        category: "category-2",
        duration: 1210,
        cost: 5100,
        maxSubscribers: 3330
      }
    ];
    before(async () => {
      const response = await Promise.all([
        Course.create(courses[0]),
        Course.create(courses[1])
      ]);
      ids = response.map((item) => item._id.toString());
    });
    after(async () => {
      await Promise.all([
        Course.findByIdAndDelete(ids[0]),
        Course.findByIdAndDelete(ids[1])
      ]);
    });

    it("Test success 200", async () => {
      const { status, body } = await request(app).get(baseCourse);
      status.should.be.equal(200);
      body.should.have.property("length").equal(courses.length);
    });

    it("Test success 200 with query", async () => {
      const { status, body } = await request(app).get(
        `${baseCourse}?category=${newCategory}`
      );
      status.should.be.equal(200);
      body.should.have.property("length").equal(1);
    });
});