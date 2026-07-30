import "dotenv/config";
import './config/env';
import express, {Request, Response, NextFunction} from "express";
import { createServer } from "http";
import cors from "cors";
import { prisma } from "./config/database"
import helmet from "helmet";
import morgan from "morgan";
import { errorMiddleware } from "./middleware/error.middleware";
import { initSocket } from "./config/socket";
import authRouter from "./modules/auth/auth.router";
import accountsRouter from './modules/accounts/accounts.router';
import transactionsRouter from "./modules/transactions/transactions.router"
import foldersRouter from "./modules/folders/folders.router";
import transfersRouter from "./modules/transfers/transfers.router";
import userRouter from "./modules/users/users.router"; 


const app = express();
const httpServer = createServer(app);
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

// middlewares
app.use(helmet()); //  to protect from XSS or clickjacking
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  ...(process.env.FRONTEND_URL ? [process.env.FRONTEND_URL.trim().replace(/\/$/, '')] : []),
];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    const cleanOrigin = origin.replace(/\/$/, '');
    if (
      allowedOrigins.includes(cleanOrigin) ||
      cleanOrigin.endsWith('.vercel.app')
    ) {
      return callback(null, true);
    }
    return callback(null, true);
  },
  credentials: true,
})); // to allow frontend enter into the backend 
app.use(morgan("dev")); // logger
app.use(express.json()); // to use json

// root route
app.get("/", (req: Request, res: Response) => {
  res.json({ status: "ok", message: "Financial Management API is running" });
});

// routers
app.use("/api/auth", authRouter);
app.use("/api/accounts", accountsRouter);
app.use("/api/transactions", transactionsRouter);
app.use("/api/folders", foldersRouter);
app.use("/api/transfers", transfersRouter);
app.use("/api/users", userRouter);

app.get("/health", async(req: Request, res: Response)=>{
  try{
    await prisma.$queryRaw`SELECT 1`; //$queryRaw tells prisma to stop writing sql yourself and write my code instead
    res.json({status:"ok",database:"connected"});
  }catch(error){
    res.status(500).json({status:"bad",database:"not connected"});
  }
});


app.use(errorMiddleware); // error handler
initSocket(httpServer); 


httpServer.listen(PORT, '0.0.0.0', () =>{
  console.log(`🚀 Server running on port ${PORT}`);
});