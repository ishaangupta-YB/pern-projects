import express from "express";
import { PrismaClient } from "@prisma/client";
import verifyToken from "../middleware/verifyToken";

const router = express.Router();
const prisma = new PrismaClient();

router.get("/", verifyToken, async (req, res) => {
  try {
    const userId = req.body.userId; 
    const todos = await prisma.todo.findMany({
      where: {
        userId,
      },select:{
        id: true,
        title: true,
        description: true,
        completed: true,
        createdAt: true,
      }
    });
    console.log(todos)
    res.status(200).json({ todos });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

router.post("/", verifyToken, async (req, res) => {
  const { title,description } = req.body;
  const userId = req.body.userId;

  try {
    const todo = await prisma.todo.create({
      data: {
        title,
        description,
        userId,
      },
    });

    res.status(201).json({ todo });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

router.put("/:id", verifyToken, async (req, res) => {
  const { id } = req.params;
  const { title,description, completed } = req.body;
  const userId = req.body.userId;
  
  const data: { [key: string]: any } = {}; 
  if (title !== undefined) data.title = title;
  if (description !== undefined) data.description = description;
  if (completed !== undefined) data.completed = completed;


  try {
    const todo = await prisma.todo.updateMany({
      where: {
        id: Number(id),
        userId, 
      },
      data,
    }); 

    if (todo.count === 0) {
      return res.status(404).json({ error: "Todo not found" });
    }

    res.status(200).json({ message: "Todo updated successfully" });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

router.delete("/:id", verifyToken, async (req, res) => {
  const { id } = req.params;
  const userId = req.body.userId;

  try {
    const todo = await prisma.todo.deleteMany({
      where: {
        id: Number(id),
        userId,
      },
    });

    if (todo.count === 0) {
      return res.status(404).json({ error: "Todo not found" });
    }

    res.status(200).json({ message: "Todo deleted successfully" });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

export default router;
