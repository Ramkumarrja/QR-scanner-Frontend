import { Box, Button } from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
import { v4 as uuidv4 } from "uuid";

const Login = () => {
  const [sessionId, setSessionId] = useState<string>("");
//   const [name, setName] = useState<string | null>("");
//   const [fatherName, setFatherName] = useState<string | null>("");
//   const [cardNumber, setCardNumber] = useState<string | null>("");
//   const [address, setAddress] = useState<string | null>("");
  // Generate or retrieve UUID from localStorage
  const navigate = useNavigate()
  const clientId = localStorage.getItem("clientId") || uuidv4();
  localStorage.setItem("clientId", clientId);

  useEffect(() => {
    console.log("[Login Page] Initializing Socket.IO connection...");
    const newSocket = io(import.meta.env.VITE_WS_PORT);
    // const newSocket = io(
    //   `http://localhost:${import.meta.env.VITE_WS_PORT || 3001}`
    // );

    newSocket.on("connect", () => {
      console.log("sessionId ::", newSocket.id);
      setSessionId(newSocket.id ?? "");
      newSocket.emit("register", { clientId });
    });

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
        clientId: string;
      }) => {
        console.log(
          `[ParentPage] File uploaded by client ${data.clientId}: ${data.filePath}`
        );

        // Check if the sessionId in the message matches the current sessionId
        console.log(
          "[ParentPage] Session ID matches. Updating UI with file information."
        );
        // setImageData(data.filePath); // Display the uploaded image
        // setUploadedFileInfo({
        //   filePath: data.filePath,
        //   sessionId: data.sessionId,
        // });
        console.log("data from the socket ::", data);
        // setName(data?.guestInfo?.Name);
        // setFatherName(data?.guestInfo?.FatherName);
        // setAddress(data?.guestInfo?.Address);
        // setCardNumber(data?.guestInfo?.CardNumber);
      }
    );

    return () => {
      console.log("[Login Page] Cleaning up Socket.IO connection...");
      newSocket.disconnect();
    };
  }, []);
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        alignContent: "center",
      }}
    >
      <h3>SessionId ::{sessionId ?? ""}</h3>
      {/* <p>NAME::{name}</p>
      <p>FATHERNAME::{fatherName}</p>
      <p>ADDRESS ::{address}</p>
      <p>CARDNUMBER ::{cardNumber}</p> */}
      <Button onClick={() => {
        navigate("/parent-page")
      }}>Login</Button>
    </Box>
  );
};

export default Login;
