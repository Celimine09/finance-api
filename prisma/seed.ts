import { PrismaClient, TransactionType } from "@prisma/client";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";

const connectionString = process.env.DATABASE_URL;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("Creating default categories...");

  const defaultCategories = [
    { name: "Salary", color: "#10B981", type: TransactionType.INCOME },
    { name: "Business", color: "#F59E0B", type: TransactionType.INCOME },
    { name: "Investment", color: "#06B6D4", type: TransactionType.INCOME },
    { name: "Gift", color: "#D946EF", type: TransactionType.INCOME },

    { name: "Food & Drinks", color: "#F97316", type: TransactionType.EXPENSE },
    { name: "Transportation", color: "#6366F1", type: TransactionType.EXPENSE },
    {
      name: "Housing & Bills",
      color: "#EF4444",
      type: TransactionType.EXPENSE,
    },
    { name: "Shopping", color: "#EC4899", type: TransactionType.EXPENSE },
    { name: "Health", color: "#14B8A6", type: TransactionType.EXPENSE },
    { name: "Entertainment", color: "#8B5CF6", type: TransactionType.EXPENSE },
    { name: "Education", color: "#3B82F6", type: TransactionType.EXPENSE },
    { name: "Travel", color: "#EAB308", type: TransactionType.EXPENSE },
    { name: "Family", color: "#F43F5E", type: TransactionType.EXPENSE },
  ];

  for (const cat of defaultCategories) {
    await prisma.category.create({
      data: {
        name: cat.name,
        color: cat.color,
        type: cat.type,
      },
    });
  }
  console.log("Created default categories successfully!");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
