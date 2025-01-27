import { Box, Container } from "@mui/material";
import { QRCodeSVG } from "qrcode.react";
import { useEffect, useState, useRef } from "react";
import { io, Socket } from "socket.io-client";

const ParentPage = () => {
  const [_socket, setSocket] = useState<Socket | null>(null);
  const [sessionId, setSessionId] = useState<string>(""); // Default Session ID
  const clientId = localStorage.getItem("clientId") || ""; // Retrieve clientId
  const [guestInfo, setGuestInfo] = useState<{
    Name: string;
    FatherName: string;
    CardNumber: string;
    Address: string;
  } | null>(null);
  
  // Track if register event has been emitted
  const isRegistered = useRef(false);

  // Initialize Socket.IO connection
  useEffect(() => {
    console.log("[ParentPage] Initializing Socket.IO connection...");
    
    // Use a fallback port if `VITE_WS_PORT` is not set
    const socketPort = import.meta.env.VITE_WS_PORT || 3001;
    const newSocket = io(`http://localhost:${socketPort}`);
    
    setSocket(newSocket);

    newSocket.on("connect", () => {
      console.log("sessionId ::", newSocket.id);
      setSessionId(newSocket.id ?? "");

      // Emit register event only once, when the socket first connects
      if (!isRegistered.current) {
        newSocket.emit("register", { clientId });
        isRegistered.current = true; // Mark as registered
      }
    });

    // Handle session ID received from the server
    newSocket.on("session_id", (data: { sessionId: string }) => {
      setSessionId(data.sessionId);
      localStorage.setItem("sessionId", data.sessionId); // Store session ID in localStorage
      console.log(`[ParentPage] Received session ID: ${data.sessionId}`);
    });

    // Handle file upload success
    newSocket.on(
      "file_upload_success",
      (data: {
        filePath: string;
        guestInfo: {
          Name: string;
          FatherName: string;
          CardNumber: string;
          Address: string;
        };
        sessionId: string;
      }) => {
        console.log(`[ParentPage] File uploaded for session ${data.sessionId}:`, data);

        // Update UI with the received guest info
        if (data.sessionId === sessionId) {
          setGuestInfo(data.guestInfo);
        } else {
          console.log("[ParentPage] Session ID mismatch. Ignoring file upload data.");
        }
      }
    );

    // Cleanup Socket.IO connection on component unmount
    return () => {
      console.log("[ParentPage] Cleaning up Socket.IO connection...");
      newSocket.disconnect();
    };
  }, [sessionId, clientId]); // Added clientId to dependencies list

  return (
    <Box>
      <Container
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          alignContent: "center",
          mt: 4,
        }}
      >
        {clientId && (
          <Box sx={{ marginBottom: 2, textAlign: "center" }}>
            <strong>Client ID:</strong> <span>{clientId}</span>
          </Box>
        )}

        {guestInfo ? (
          // Render guest information
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2, textAlign: "left" }}>
            <p>
              <strong>Name:</strong> {guestInfo.Name}
            </p>
            <p>
              <strong>Father's Name:</strong> {guestInfo.FatherName}
            </p>
            <p>
              <strong>Address:</strong> {guestInfo.Address}
            </p>
            <p>
              <strong>Card Number:</strong> {guestInfo.CardNumber}
            </p>
          </Box>
        ) : (
          // Render QR code if no guest info is available
          <Box sx={{ textAlign: "center" }}>
            <h1>QR Scanner</h1>
            {clientId && (
              <QRCodeSVG
                value={`https://qr-scanner-frontend.vercel.app/child-page?clientId=${clientId}`}
                size={250}
              />
            )}
            <p>{`/child-page?clientId=${clientId}`}</p>
          </Box>
        )}
      </Container>
    </Box>
  );
};

export default ParentPage;
