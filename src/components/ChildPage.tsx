import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { io, Socket } from "socket.io-client";

const ChildPage = () => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [searchParams] = useSearchParams();
  const clientId = searchParams.get("clientId") || "";
  // const clientId = localStorage.getItem("clientId") || "";

  useEffect(() => {
    // Initialize Socket.IO client
    // const newSocket = io(import.meta.env.VITE_WS_PORT);
    const newSocket=  io(`ws://localhost:${import.meta.env.VITE_WS_PORT || 3001}`);
    

    setSocket(newSocket);

    // Cleanup on unmount
    return () => {
      newSocket.close();
    };
  }, []);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    console.log("ClientId ::", clientId)
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);

      // Convert file to Base64 and send to server
      const reader = new FileReader();
      reader.onload = () => {
        if (reader.result && socket) {
          socket.emit("file_upload", {
            clientId,
            fileData: reader.result,
          });
        }
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  useEffect(() => {
    if (socket) {
      // Listen for upload success
      socket.on("file_upload_success", (data) => {
        console.log("[ChildPage] File upload success:", data);
      });

      // Listen for upload errors
      socket.on("upload_error", (error) => {
        console.error("[ChildPage] Upload error:", error);
      });

      // Listen for OCR errors
      socket.on("ocr_error", (error) => {
        console.error("[ChildPage] OCR error:", error);
      });
    }
  }, [socket]);

  return (
    <div style={styles.container}>
      <h2>Upload Your Document</h2>
      <form style={styles.form}>
        <label htmlFor="document" style={styles.label}>
          Select or Take a Photo:
        </label>
        <input
          type="file"
          id="document"
          name="document"
          accept="image/*"
          style={styles.input}
          onChange={handleFileChange}
        />
        {file && <p style={styles.fileName}>Selected file: {file.name}</p>}
      </form>
    </div>
  );
};

const styles = {
  container: {
    display: "flex",
    flexDirection: "column" as const,
    alignItems: "center",
    justifyContent: "center",
    height: "100vh",
    backgroundColor: "#f9f9f9",
  },
  form: {
    display: "flex",
    flexDirection: "column" as const,
    alignItems: "center",
    gap: "15px",
    width: "90%",
    maxWidth: "400px",
    padding: "20px",
    borderRadius: "8px",
    backgroundColor: "#fff",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
  },
  label: {
    fontSize: "16px",
    fontWeight: "bold" as const,
    marginBottom: "10px",
  },
  input: {
    padding: "10px",
    fontSize: "16px",
    borderRadius: "4px",
    border: "1px solid #ccc",
    width: "100%",
  },
  fileName: {
    fontSize: "14px",
    color: "#555",
  },
};

export default ChildPage;
