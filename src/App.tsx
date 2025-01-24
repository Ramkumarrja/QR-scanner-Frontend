import { Routes, Route } from "react-router-dom";
import ChildPage from "./components/ChildPage";
import ParentPage from "./components/ParentPage";

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<ParentPage />} />
      <Route path="/child-page" element={<ChildPage />} />
    </Routes>
  );
};

export default App;

// import React, { useEffect, useState } from "react";

// const App: React.FC = () => {
//   const [messages, setMessages] = useState<string[]>([]);
//   const [input, setInput] = useState<string>("");
//   const [clientId, setClientId] = useState<string>(`client-${Date.now()}`);
//   const [ws, setWs] = useState<WebSocket | null>(null);

//   useEffect(() => {
//     const socket = new WebSocket(`ws://localhost:${import.meta.env.VITE_WS_PORT || 3001}`);

//     socket.onopen = () => {
//       console.log("Connected to WebSocket server");

//       // Send registration message to server
//       const registrationMessage = JSON.stringify({
//         type: "register",
//         clientId,
//       });
//       socket.send(registrationMessage);
//       console.log(`Registered with ID: ${clientId}`);
//     };

//     socket.onmessage = (event) => {
//       console.log("Message from server:", event.data);
//       setMessages((prevMessages) => [...prevMessages, event.data]);
//     };

//     socket.onclose = () => {
//       console.log("Disconnected from WebSocket server");
//     };

//     socket.onerror = (error) => {
//       console.error("WebSocket error:", error);
//     };

//     setWs(socket);

//     return () => {
//       socket.close();
//     };
//   }, [clientId]);

//   const sendMessage = () => {
//     if (ws && ws.readyState === WebSocket.OPEN) {
//       const message = JSON.stringify({
//         type: "message",
//         clientId,
//         content: input,
//       });
//       ws.send(message);
//       setMessages((prevMessages) => [...prevMessages, `You: ${input}`]);
//       setInput("");
//     } else {
//       console.error("WebSocket is not open");
//     }
//   };

//   const sendFile = (file: File) => {
//     if (ws && ws.readyState === WebSocket.OPEN) {
//       const reader = new FileReader();
//       reader.onload = () => {
//         if (reader.result) {
//           ws.send(reader.result); // Send the file content as binary data
//           setMessages((prevMessages) => [...prevMessages, `You sent a file: ${file.name}`]);
//         }
//       };
//       reader.readAsArrayBuffer(file); // Read file as binary data
//     } else {
//       console.error("WebSocket is not open");
//     }
//   };

//   return (
//     <div style={{ padding: "20px" }}>
//       <h1>WebSocket Client</h1>
//       <div style={{ marginBottom: "20px" }}>
//         <div style={{ marginBottom: "10px" }}>
//           <strong>Your Client ID: </strong>
//           {clientId}
//         </div>
//         <input
//           type="file"
//           onChange={(e) => {
//             const file = e.target.files?.[0];
//             if (file) {
//               sendFile(file);
//             }
//           }}
//           style={{ marginRight: "10px" }}
//         />
//         <input
//           type="text"
//           value={input}
//           onChange={(e) => setInput(e.target.value)}
//           placeholder="Enter message"
//           style={{ padding: "10px", marginRight: "10px" }}
//         />
//         <button onClick={sendMessage} style={{ padding: "10px 20px" }}>
//           Send
//         </button>
//       </div>
//       <div>
//         <h2>Messages:</h2>
//         <ul>
//           {messages.map((message, index) => (
//             <li key={index}>{message}</li>
//           ))}
//         </ul>
//       </div>
//     </div>
//   );
// };

// export default App;
