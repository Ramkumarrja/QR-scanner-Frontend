import { Box, Container, Typography, Card, List, ListItem, ListItemText, useTheme } from "@mui/material";
import { QRCodeSVG } from "qrcode.react";
import { useEffect, useState, useRef } from "react";
import { io, Socket } from "socket.io-client";
import { Person, PersonOutline, Home, CreditCard, Today, CalendarMonth, Male, Female } from "@mui/icons-material";
import { v4 as uuidv4 } from "uuid";

const Login = () => {
  const theme = useTheme();
  const [_socket, setSocket] = useState<Socket | null>(null);
  const [_sessionId, setSessionId] = useState<string>("");
  let clientId = localStorage.getItem("clientId") || (() => {
    const newClientId = uuidv4();
    localStorage.setItem("clientId", newClientId);
    return newClientId;
  })();
  
  const [guestInfo, setGuestInfo] = useState<{
    Name: string;
    FatherName: string;
    CardNumber: string;
    Address: string;
    Age: string;
    DateofBirth: string;
    Gender: string;
  } | null>(null);
  
  const isRegistered = useRef(false);

  useEffect(() => {
    // const newSocket = io(import.meta.env.VITE_WS_PORT)

    const socketPort = import.meta.env.VITE_WS_PORT || 3001;
    const newSocket = io(`http://localhost:${socketPort}`);
    
    setSocket(newSocket);

    const handleConnect = () => {
      console.log("sessionId ::", newSocket.id);
      setSessionId(newSocket.id ?? "");
      if (!isRegistered.current) {
        newSocket.emit("register", { clientId });
        isRegistered.current = true;
      }
    };

    const handleSessionId = (data: { sessionId: string }) => {
      setSessionId(data.sessionId);
      localStorage.setItem("sessionId", data.sessionId);
    };

    const handleFileUpload = (data: {
      filePath: string;
      guestInfo: any;
      sessionId: string;
    }) => {
      console.log("data from the web socket  ::", data)
        setGuestInfo(data.guestInfo);
    };

    newSocket.on("connect", handleConnect);
    newSocket.on("session_id", handleSessionId);
    newSocket.on("file_upload_success", handleFileUpload);

    return () => {
      newSocket.off("connect", handleConnect);
      newSocket.off("session_id", handleSessionId);
      newSocket.off("file_upload_success", handleFileUpload);
      newSocket.disconnect();
    };
  }, [clientId]); // Removed sessionId from dependencies

  return (
    <Box sx={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
      py: 8
    }}>
      <Container maxWidth="md">
        <Card sx={{
          p: 4,
          borderRadius: 4,
          boxShadow: theme.shadows[4],
          background: 'rgba(255, 255, 255, 0.9)',
          backdropFilter: 'blur(10px)'
        }}>
          {clientId && (
            <Typography variant="subtitle1" sx={{ 
              mb: 4,
              textAlign: 'center',
              color: 'text.secondary',
              fontWeight: 500
            }}>
              Client ID: <span style={{ color: theme.palette.primary.main }}>{clientId}</span>
            </Typography>
          )}

          {guestInfo ? (
            <Box sx={{ 
              p: 3,
              background: theme.palette.background.paper,
              borderRadius: 2
            }}>
              <Typography variant="h5" sx={{ 
                mb: 3,
                color: theme.palette.primary.main,
                fontWeight: 600
              }}>
                Guest Information
              </Typography>
              
              <List>
                <InfoItem 
                  icon={<Person />} 
                  primary="Name" 
                  secondary={guestInfo.Name} 
                />
                <InfoItem 
                  icon={guestInfo.Gender === "Male" ? <Male /> : <Female />} 
                  primary="Gender" 
                  secondary={guestInfo.Gender} 
                />
                <InfoItem 
                  icon={<CalendarMonth />} 
                  primary="Age"
                  secondary={guestInfo.Age} 
                />
                <InfoItem 
                  icon={<Today />} 
                  primary="DateofBirth" 
                  secondary={guestInfo.DateofBirth} 
                />
                <InfoItem 
                  icon={<PersonOutline />} 
                  primary="Father's Name" 
                  secondary={guestInfo.FatherName} 
                />
                <InfoItem 
                  icon={<Home />} 
                  primary="Address" 
                  secondary={guestInfo.Address} 
                />
                <InfoItem 
                  icon={<CreditCard />} 
                  primary="Card Number" 
                  secondary={guestInfo.CardNumber} 
                />
              </List>
            </Box>
          ) : (
            <Box sx={{ 
              textAlign: 'center',
              px: 2
            }}>
              <Typography variant="h3" sx={{ 
                mb: 3,
                color: theme.palette.primary.dark,
                fontWeight: 700
              }}>
                Visitor Registration Portal
              </Typography>
              
              {clientId && (
                <>
                  <Card sx={{
                    p: 3,
                    mb: 3,
                    display: 'inline-block',
                    background: theme.palette.background.default,
                    borderRadius: 3
                  }}>
                    <QRCodeSVG
                      value={`https://qr-scanner-frontend.vercel.app/child-page?clientId=${clientId}`}
                      size={250}
                    />
                  </Card>
                  <Typography variant="body1" sx={{ 
                    color: 'text.secondary',
                    maxWidth: 400,
                    mx: 'auto',
                    lineHeight: 1.6
                  }}>
                    Scan this QR code with your mobile device to 
                    register visitor information
                  </Typography>
                </>
              )}
            </Box>
          )}
        </Card>
      </Container>
    </Box>
  );
};

const InfoItem = ({ icon, primary, secondary }: { 
  icon: React.ReactNode;
  primary: string;
  secondary: string;
}) => (
  <ListItem sx={{ px: 0 }}>
    <Box sx={{ 
      minWidth: 40,
      color: 'primary.main',
      display: 'flex',
      justifyContent: 'center'
    }}>
      {icon}
    </Box>
    <ListItemText
      primary={<Typography variant="subtitle1">{primary}</Typography>}
      secondary={<Typography variant="body1" sx={{ color: 'text.primary' }}>{secondary}</Typography>}
    />
  </ListItem>
);

export default Login;