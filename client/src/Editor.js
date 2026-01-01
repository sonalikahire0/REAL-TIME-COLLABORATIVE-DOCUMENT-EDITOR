    import React, { useEffect, useState } from "react";
    import { io } from "socket.io-client";
    import { useParams } from "react-router-dom";

    const socket = io("http://localhost:3001");

    export default function Editor() {
    const { id } = useParams();
    const [content, setContent] = useState("");

    useEffect(() => {
        socket.emit("get-document", id);

        socket.on("load-document", (data) => {
        setContent(data);
        });

        socket.on("receive-changes", (data) => {
        setContent(data);
        });

        return () => {
        socket.off("load-document");
        socket.off("receive-changes");
        };
    }, [id]);

    useEffect(() => {
        const timeout = setTimeout(() => {
        socket.emit("save-document", content);
        }, 1000);

        return () => clearTimeout(timeout);
    }, [content]);

    function handleChange(e) {
        const value = e.target.value;
        setContent(value);
        socket.emit("send-changes", value);
    }

    return (
        <div style={{ padding: "20px" }}>
        <h2>📝 Collaborative Document</h2>
        <textarea
            value={content}
            onChange={handleChange}
            style={{
            width: "100%",
            height: "80vh",
            fontSize: "16px",
            padding: "10px"
            }}
        />
        </div>
    );
    }
