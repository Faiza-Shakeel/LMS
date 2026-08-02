import prisma from "../config/prisma.js";

export const testConnection = async (req, res) => {
  try {
    await prisma.$connect();

    res.json({
      success: true,
      message: "Database connected successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};