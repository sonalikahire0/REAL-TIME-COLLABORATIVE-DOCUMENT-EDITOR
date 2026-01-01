    const express = require("express");
    const http = require("http");
    const mongoose = require("mongoose");
    const cors = require("cors");
    const { Server } = require("socket.io");
    const Document = require("./models/Document");

    const app = express();
    app.use(cors());

    const server = http.createServer(app);
    const io = new Server(server, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"]
    }
    });

    // 👉 MongoDB connection
    mongoose.connect("mongodb+srv://ahiresonali2023_db_user:sonali123@project.ixvn0dd.mongodb.net/collabdocs")
.then(() => console.log("✅ MongoDB connected"))
.catch(err => console.error("❌ MongoDB error:", err));


    io.on("connection", (socket) => {
    socket.on("get-document", async (docId) => {
        const document =
        (await Document.findById(docId)) ||
        (await Document.create({ _id: docId, content: "" }));

        socket.join(docId);
        socket.emit("load-document", document.content);

        socket.on("send-changes", (content) => {
        socket.broadcast.to(docId).emit("receive-changes", content);
        });

        socket.on("save-document", async (content) => {
        await Document.findByIdAndUpdate(docId, { content });
        });
    });
    });

    server.listen(3001, () => {
    console.log("✅ Backend running on http://localhost:3001");
    });
