import prisma from "./prisma.service";

export const getAllCategories = async () => {
  return await prisma.category.findMany();
};
