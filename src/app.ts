import express from "express";
export const app = express();
import mongoose from "mongoose";
import course from "./routes/course";

app.use(express.json());

app.use("/v1/courses", course);

app.listen(process.env.PORT || 3000, async () => {
  console.log(`Server is running ${process.env.PORT || 3000}`);
  await mongoose.connect(`mongodb://127.0.0.1:27017/${process.env.DB}`);
});

export default app;