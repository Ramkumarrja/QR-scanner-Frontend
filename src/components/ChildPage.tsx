import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";

const ChildPage = () => {
  const ws = useRef<WebSocket | null>(null);
  const [file, setFile] = useState<File | null>(null);

  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get("sessionId") || "";
  console.log("[ChildPage] SessionId:", sessionId);

  // Initialize WebSocket connection
  useEffect(() => {
    console.log("[ChildPage] Initializing WebSocket connection...");

    // Create WebSocket connection
    ws.current = new WebSocket(`ws://localhost:${import.meta.env.VITE_WS_PORT || 3001}`);

    // Handle WebSocket open event
    ws.current.onopen = () => {
      console.log("[ChildPage] WebSocket connection established.");
    };

    // Handle incoming messages from the server
    ws.current.onmessage = (event) => {
      console.log("[ChildPage] Received message from server:", event.data);
    };

    // Handle WebSocket close event
    ws.current.onclose = () => {
      console.log("[ChildPage] WebSocket connection closed.");
    };

    // Handle WebSocket errors
    ws.current.onerror = (error) => {
      console.error("[ChildPage] WebSocket error:", error);
    };

    // Cleanup WebSocket connection on component unmount
    return () => {
      console.log("[ChildPage] Cleaning up WebSocket connection...");
      if (ws.current) {
        ws.current.close();
      }
    };
  }, []);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      console.log("[ChildPage] Selected file:", selectedFile.name);
      setFile(selectedFile);

      // Read the file as a base64 string
      const reader = new FileReader();
      reader.onload = () => {
        if (reader.result && ws.current?.readyState === WebSocket.OPEN) {
          console.log("[ChildPage] Sending file data to server");
          ws.current.send(
            JSON.stringify({
              type: "file_upload",
              sessionId,
              fileData: reader.result, // Send the file data as base64
            })
          );
        }
      };
      reader.readAsDataURL(selectedFile); // Read the file as a base64 string
    }
  };


  return (
    <div style={styles.container}>
      <h2>Upload Your Document</h2>
      <form style={styles.form} >
        <label htmlFor="document" style={styles.label}>
          Select or Take a Photo:
        </label>
        <input
          type="file"
          id="document"
          name="document"
          accept="image/*"
          capture="environment"
          style={styles.input}
          onChange={handleFileChange}
        />
        {file && <p style={styles.fileName}>Selected file: {file.name}</p>}
        {/* <button type="submit" style={styles.button}>
          Submit
        </button> */}
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
  button: {
    padding: "10px 20px",
    fontSize: "16px",
    fontWeight: "bold" as const,
    color: "#fff",
    backgroundColor: "#007bff",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
  },
  fileName: {
    fontSize: "14px",
    color: "#555",
  },
  resultContainer: {
    marginTop: "20px",
    padding: "15px",
    borderRadius: "8px",
    backgroundColor: "#f1f1f1",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
    width: "90%",
    maxWidth: "400px",
  },
  resultList: {
    listStyleType: "none",
    padding: "0",
  },
  resultItem: {
    fontSize: "16px",
    color: "#333",
    marginBottom: "8px",
  },
};



export default ChildPage;


