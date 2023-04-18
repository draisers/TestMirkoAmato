import express, { Request, Response } from "express";
import { body, query, param } from "express-validator";
import { Course } from "../models/Courses";
const router = express.Router();
import { checkErrors } from "./utils";

router.post("/",
    body("name").exists().isString(),
    body("category").exists().isString(),
    body("duration").exists().isNumeric(),
    body("cost").exists().isNumeric(),
    body("maxSubscribers").exists().isNumeric(),
    checkErrors,
    async (req: Request, res: Response) => {
      const { name, category, duration, cost, maxSubscribers } = req.body;
      const product = new Course({ name, category, duration, cost, maxSubscribers });
      const productSaved = await product.save();
      res.status(201).json(productSaved);
    }
);

router.delete("/:id",
    param("id").isMongoId(),
    checkErrors,
    async (req: Request, res: Response) => {
      const { id } = req.params;
      const course = await Course.findById(id);
      if (!course) {
        return res.status(404).json({ message: "Course not found" });
      }
      await Course.findByIdAndDelete(id);
      res.json({ message: "The course was successfully deleted" });
    }
);

router.get("/",
    query("name").optional().isString(),
    query("category").optional().isString(),
    query("duration").optional().isNumeric(),
    query("cost").optional().isNumeric(),
    query("maxSubscribers").optional().isNumeric(),
    checkErrors,
    async (req: Request, res: Response) => {
      const courses = await Course.find({ ...req.query });
      res.status(200).json(courses);
    }
);

router.get("/:id", param("id").isMongoId(), checkErrors, async (req: Request, res: Response) => {
    const { id } = req.params;
    const course = await Course.findById(id);
    !course ? res.status(404).json({ message: "Course not found" }) : res.json(course);
});

export default router;

