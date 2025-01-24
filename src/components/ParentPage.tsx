import { Box, Container } from "@mui/material";
import { QRCodeSVG } from "qrcode.react";
import { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";

const ParentPage = () => {
  const [_socket, setSocket] = useState<Socket | null>(null);
  const [sessionId, setSessionId] = useState<string>(""); // Default Session ID
  // const [imageData, setImageData] = useState<string | null>(null);
  const [_receivedMessage, setReceivedMessage] = useState<string>("");
  const [_uploadedFileInfo, _setUploadedFileInfo] = useState<{
    filePath: string;
    sessionId: string;
  } | null>(null);
  const [name, setName] = useState<string | null>("");
  const [fatherName, setFatherName] = useState<string | null>("");
  const [cardNumber, setCardNumber] = useState<string | null>("");
  const [address, setAddress] = useState<string | null>("");

  // Initialize Socket.IO connection
  useEffect(() => {
    console.log("[ParentPage] Initializing Socket.IO connection...");
    const newSocket = io(import.meta.env.VITE_WS_PORT);
    // const newSocket = io(`http://localhost:${import.meta.env.VITE_WS_PORT || 3001}`);
    setSocket(newSocket);

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
        console.log(
          `[ParentPage] File uploaded by client ${data.sessionId}: ${data.filePath}`
        );

        // Check if the sessionId in the message matches the current sessionId
        if (data.sessionId === localStorage.getItem("sessionId")) {
          console.log("[ParentPage] Session ID matches. Updating UI with file information.");
          // setImageData(data.filePath); // Display the uploaded image
          // setUploadedFileInfo({
          //   filePath: data.filePath,
          //   sessionId: data.sessionId,
          // });
          console.log("data from the socket ::", data)
          setName(data?.guestInfo?.Name);
          setFatherName(data?.guestInfo?.FatherName);
          setAddress(data?.guestInfo?.Address);
          setCardNumber(data?.guestInfo?.CardNumber);
        } else {
          console.log("[ParentPage] Session ID does not match. Ignoring message.");
        }
      }
    );

    // Handle generic messages
    newSocket.on("message", (message: string) => {
      console.log(`[ParentPage] Received message: ${message}`);
      setReceivedMessage(message);
    });

    // Cleanup Socket.IO connection on component unmount
    return () => {
      console.log("[ParentPage] Cleaning up Socket.IO connection...");
      newSocket.disconnect();
    };
  }, []);

  return (
    <Box>
      <Container
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          alignContent: "center",
        }}
      >
        {sessionId && (
          <Box sx={{ marginBottom: 2, textAlign: "center" }}>
            <strong>Session ID:</strong> <span>{sessionId}</span>
          </Box>
        )}

        {name ? (
          // Render this when guestInfo is truthy
          <div>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 5 }}>
              <p>NAME::{name}</p>
              <p>FATHERNAME::{fatherName}</p>
              <p>ADDRESS ::{address}</p>
              <p>CARDNUMBER ::{cardNumber}</p>
            </Box>
          </div>
        ) : (
          // Render this when guestInfo is falsy
          <div>
            <h1>QR Scanner</h1>
            <QRCodeSVG
              value={`https://qr-scanner-frontend.vercel.app/child-page?sessionId=${sessionId}`}
              size={250}
            />
            <p>{`/child-page?sessionId=${sessionId}`}</p>
          </div>
        )}
      </Container>
    </Box>
  );
};

export default ParentPage;
