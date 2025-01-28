import { useEffect, useState, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import { io, Socket } from "socket.io-client";

const ChildPage = () => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [searchParams] = useSearchParams();
  const [sessionId, setSessionId] = useState<string>("");
  const clientId = searchParams.get("clientId") || "";
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const newSocket = io(import.meta.env.VITE_WS_PORT);
    // const newSocket = io(
    //   `ws://localhost:${import.meta.env.VITE_WS_PORT || 3001}`
    // );
    const handleConnect = () => {
      console.log("sessionId ::", newSocket.id);
      setSessionId(newSocket.id ?? "");
    };
    newSocket.on("connect", handleConnect);

    setSocket(newSocket);
    return () => {
      newSocket.close();
    };
  }, []);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      const reader = new FileReader();
      reader.onload = () => setPreviewUrl(reader.result as string);
      reader.readAsDataURL(selectedFile);
    }
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (socket && clientId && previewUrl) {
      socket.emit("file_upload", { clientId, fileData: previewUrl });
      setFile(null);
      setPreviewUrl(null);
      // Clear input files
      if (fileInputRef.current) fileInputRef.current.value = "";
      if (cameraInputRef.current) cameraInputRef.current.value = "";
    }
  };

  return (
    <div style={styles.container}>
      <h2>sessionId: {sessionId}</h2>
      <h2>Upload Your Document</h2>
      <form style={styles.form} onSubmit={handleSubmit}>
        <div style={styles.buttonGroup}>
          <button
            type="button"
            style={styles.button}
            onClick={() => fileInputRef.current?.click()}
          >
            Choose from Gallery
          </button>
          <button
            type="button"
            style={styles.button}
            onClick={() => cameraInputRef.current?.click()}
          >
            Take Photo
          </button>
        </div>

        {/* Hidden file inputs */}
        <input
          type="file"
          ref={fileInputRef}
          style={{ display: "none" }}
          accept="image/*"
          onChange={handleFileChange}
        />
        <input
          type="file"
          ref={cameraInputRef}
          style={{ display: "none" }}
          accept="image/*"
          capture="environment"
          onChange={handleFileChange}
        />

        {previewUrl && (
          <div style={styles.previewContainer}>
            <img src={previewUrl} alt="Preview" style={styles.previewImage} />
          </div>
        )}
        {file && (
          <>
            <p style={styles.fileName}>
              {cameraInputRef.current?.files?.length
                ? "Photo captured"
                : "Selected file:"}{" "}
              {file.name}
            </p>
            <button type="submit" style={styles.submitButton}>
              Upload Document
            </button>
          </>
        )}
      </form>
    </div>
  );
};

// Styles remain the same
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
  buttonGroup: {
    display: "flex",
    gap: "10px",
    width: "100%",
    flexDirection: "column" as const,
  },
  button: {
    padding: "12px 20px",
    fontSize: "16px",
    backgroundColor: "#007bff",
    color: "white",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    transition: "background-color 0.3s",
    ":hover": {
      backgroundColor: "#0056b3",
    },
  },
  fileName: {
    fontSize: "14px",
    color: "#555",
    textAlign: "center" as const,
  },
  previewContainer: {
    width: "100%",
    margin: "10px 0",
  },
  previewImage: {
    width: "100%",
    height: "auto",
    borderRadius: "4px",
    border: "1px solid #ddd",
  },
  submitButton: {
    padding: "12px 30px",
    fontSize: "16px",
    backgroundColor: "#28a745",
    color: "white",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    transition: "background-color 0.3s",
    ":hover": {
      backgroundColor: "#218838",
    },
  },
};

export default ChildPage;
