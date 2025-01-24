import { Box, Container } from "@mui/material";
import { QRCodeSVG } from "qrcode.react";
import { useEffect, useRef, useState } from "react";

const ParentPage = () => {
  const ws = useRef<WebSocket | null>(null);
  const [sessionId, setSessionId] = useState<string>(""); // Default Session ID
  const [imageData, setImageData] = useState<string | null>(null);
  const [_receivedMessage, setReceivedMessage] = useState<string>("");
  const [_uploadedFileInfo, setUploadedFileInfo] = useState<{
    filePath: string;
    sessionId: string;
  } | null>(null);
  const [name, setName] = useState<string | null>("");
  const [fatherName, setfatherName] = useState<string | null>("");
  const [cardNumber, setCardNumber] = useState<string | null>("");
  const [address, setAddress] = useState<string | null>("");

  // Initialize WebSocket connection
  useEffect(() => {
    console.log("[ParentPage] Initializing WebSocket connection...");

    // Create WebSocket connection
    ws.current = new WebSocket(
      `ws://localhost:${import.meta.env.VITE_WS_PORT || 3001}`
    );

    // Handle WebSocket open event
    ws.current.onopen = () => {
      console.log("[ParentPage] WebSocket connection established.");
    };

    // Handle incoming messages from the server
    ws.current.onmessage = (event) => {
      const data = JSON.parse(event.data);

      if (data.type === "session_id") {
        // Set the session ID received from the server
        setSessionId(data.sessionId);
        localStorage.setItem("sessionId", data.sessionId); // Store session ID in localStorage
        console.log(`[ParentPage] Received session ID: ${data.sessionId}`);
      }

      if (data.type === "file_upload_success") {
        // Handle file upload success
        console.log(
          `[ParentPage] File uploaded by client ${data.sessionId}: ${data.filePath}`
        );

        console.log("guestInformation ::", data.guestInfo)

        // console.log("server sending the sessionid ::", data.sessionId)
        // console.log("client sessionid ::", localStorage.getItem("sessionId"))
        // console.log("after seting the session id ::", sessionId)
        // console.log("client sessionid ::", sessionId===data.sessionId)

        // Check if the sessionId in the message matches the current sessionId
        if (data.sessionId === localStorage.getItem("sessionId")) {
          console.log(
            "[ParentPage] Session ID matches. Updating UI with file information."
          );
          setImageData(data.filePath); // Display the uploaded image
          setUploadedFileInfo({
            filePath: data.filePath,
            sessionId: data.sessionId,
          });
          setName(data?.guestInfo?.Name)
          setfatherName(data?.guestInfo?.FatherName)
          setAddress(data?.guestInfo?.Address)
          setCardNumber(data?.guestInfo?.CardNumber)
        } else {
          console.log(
            "[ParentPage] Session ID does not match. Ignoring message."
          );
        }
      }

      if (data.type === "message") {
        // Handle received message
        console.log(`[ParentPage] Received message: ${data.message}`);
        setReceivedMessage(data.message);
      }
    };

    // Handle WebSocket close event
    ws.current.onclose = () => {
      console.log("[ParentPage] WebSocket connection closed.");
    };

    // Handle WebSocket errors
    ws.current.onerror = (error) => {
      console.error("[ParentPage] WebSocket error:", error);
    };

    // Cleanup WebSocket connection on component unmount
    return () => {
      console.log("[ParentPage] Cleaning up WebSocket connection...");
      if (ws.current) {
        ws.current.close();
      }
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
        {name ? (
          // Render this when guestInfo is truthy
          <div>
            <Box sx={{display: "flex", flexDirection: "column", gap: 5}}>
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
              value={`/child-page?sessionId=${sessionId}`}
              size={250}
            />
            <p>{`/child-page?sessionId=${sessionId}`}</p>
            {imageData && (
              <Box>
                <strong>Uploaded Image:</strong>
                <img
                  src={imageData}
                  alt="Uploaded"
                  style={{ maxWidth: "100%", height: "auto" }}
                />
              </Box>
            )}
          </div>
        )}
      </Container>
    </Box>
  );
};

export default ParentPage;