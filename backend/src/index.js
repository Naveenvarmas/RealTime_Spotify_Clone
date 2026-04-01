import dns from "node:dns/promises";
dns.setServers(["8.8.8.8", "1.1.1.1"]); // Use Google and Cloudflare DNS

import express from "express"
import {clerkMiddleware} from "@clerk/express"
import dotenv from "dotenv"
import cors from "cors"
import fileUpload from "express-fileupload"
import userRoutes from "./routes/user.routes.js"
import authRoutes from "./routes/auth.route.js"
import adminRoutes from "./routes/admin.route.js"
import songRoutes from "./routes/song.route.js"
import albumRoutes from "./routes/album.route.js"
import statRoutes from "./routes/stat.route.js"
import { connectDB } from "./lib/db.js"
import path from "node:path";
import { createServer } from "node:http";
import cron from "node-cron"
import fs from "fs"
import { initializeSocket } from "./lib/socket.js";
dotenv.config();

const __dirname=path.resolve();
const app=express();
const PORT=process.env.PORT;

const httpServer = createServer(app);
initializeSocket(httpServer);

app.use(cors({
  origin:"http://localhost:3000",
  credentials:true
}))

app.use(express.json());
app.use(clerkMiddleware()); // this will add auth to req obj (req.auth.userId)
app.use(fileUpload({
  useTempFiles:true,
  tempFileDir:path.join(__dirname,"tmp"),
  createParentPath:true, // folder not created it will create automatically
  limits:{
    fileSize:10*1024*1024 //10mb
  }
}));


// cron jobs
// delete those files in every 1 hour
const tempDir= path.join(process.cwd(),"tmp");
cron.schedule("0 * * * *",()=>{
  if(fs.existsSync(tempDir)) {
    fs.readdir(tempDir,(err,files)=>{
      if(err){
        console.log("error",err);
        return;
      }
      for(const file of files){
        fs.unlink(path.join(tempDir,file),(err) => {});
      }
    });
  }
});



app.use("/api/users",userRoutes);
app.use("/api/auth",authRoutes);
app.use("/api/admin",adminRoutes);
app.use("/api/songs",songRoutes);
app.use("/api/albums",albumRoutes);
app.use("/api/stats",statRoutes);

if(process.env.NODE_ENV === "production"){
  app.use(express.static(path.join(__dirname,"../frontend/dist")))
  app.get("*",(req,res)=>{
    res.sendFile(path.resolve(__dirname,"../frontend/dist/index.html"))
  })
}

// err handler
app.use((err,req,res,next)=>{
  console.log("full error",err)
  res.status(500).json({message:process.env.NODE_ENV === "production" ? "Internal Server Error" : err.message});
})

httpServer.listen(PORT,()=>{
  console.log("server is running on port : "+PORT);
  connectDB();
})