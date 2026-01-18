
// import React, { useEffect, useState, useRef } from "react";
// import {
//   Box,
//   Typography,
//   Card,
//   CardContent,
//   TextField,
//   Button,
//   Avatar,
//   AppBar,
//   Toolbar,
//   IconButton,
//   Grid,
//   Divider,
//   useTheme,
// } from "@mui/material";
// import ArrowBackIcon from "@mui/icons-material/ArrowBack";
// import { useNavigate } from "react-router-dom";
// import messagingApi from "../services/messagingApi";

// const POLL_INTERVAL = 3000; // 3 seconds

// const MessagingPage = () => {
//   const navigate = useNavigate();
//   const theme = useTheme();

//   const [conversations, setConversations] = useState([]);
//   const [selectedUser, setSelectedUser] = useState(null);
//   const [messages, setMessages] = useState([]);
//   const [messageText, setMessageText] = useState("");

//   const pollRef = useRef(null);
//   const bottomRef = useRef(null);

//   const loadConversations = async () => {
//     try {
//       const res = await messagingApi.get("conversations/");
//       setConversations(res.data);
//     } catch (err) {
//       console.error("Failed to load conversations", err);
//     }
//   };

//   const loadMessages = async (userId) => {
//     if (!userId) return;
//     try {
//       const res = await messagingApi.get(`chat/?user_id=${userId}`);
//       setMessages(res.data);
//     } catch (err) {
//       console.error("Failed to load messages", err);
//     }
//   };

//   const sendMessage = async () => {
//     if (!messageText.trim() || !selectedUser) return;

//     try {
//       await messagingApi.post("chat/", {
//         receiver: selectedUser.id,
//         content: messageText,
//       });

//       setMessageText("");
//       loadMessages(selectedUser.id);
//       loadConversations();
//     } catch (err) {
//       console.error("Failed to send message", err);
//     }
//   };

//   useEffect(() => {
//     if (!selectedUser) return;

//     loadMessages(selectedUser.id);

//     pollRef.current = setInterval(() => {
//       loadMessages(selectedUser.id);
//     }, POLL_INTERVAL);

//     return () => clearInterval(pollRef.current);
//   }, [selectedUser]);

//   useEffect(() => {
//     loadConversations();
//   }, []);

//   useEffect(() => {
//     bottomRef.current?.scrollIntoView({ behavior: "smooth" });
//   }, [messages]);

//   return (
//     <Box
//       sx={{
//         height: "100vh",
//         display: "flex",
//         flexDirection: "column",
//         bgcolor: theme.palette.background.default,
//       }}
//     >
//       <AppBar position="static" color="primary">
//         <Toolbar>
//           <IconButton edge="start" color="inherit" onClick={() => navigate(-1)}>
//             <ArrowBackIcon />
//           </IconButton>
//           <Typography variant="h6"sx={{ fontWeight: "bold", color: "#14323eff" }}>Messages</Typography>
//         </Toolbar>
//       </AppBar>

//       <Grid container sx={{ flex: 1 }}>
//         <Grid
//           item
//           xs={4}
//           sx={{
//             borderRight: `1px solid ${theme.palette.divider}`,
//             bgcolor: theme.palette.background.paper,
//           }}
//         >
//           <Box sx={{ p: 2 }}>
//             <Typography variant="h6" color="text.primary" sx={{ fontWeight: "bold"}}>
//               Conversations
//             </Typography>
//           </Box>
//           <Divider />

//           {conversations.map((user) => (
//             <Card
//               key={user.id}
//               sx={{
//                 m: 1,
//                 cursor: "pointer",
//                 bgcolor:
//                   selectedUser?.id === user.id
//                     ? theme.palette.primary.light
//                     : theme.palette.background.paper,
//               }}
//               onClick={() => setSelectedUser(user)}
//             >
//               <CardContent sx={{ display: "flex", alignItems: "center" }}>
//                 <Avatar sx={{ mr: 2, bgcolor: theme.palette.primary.main }}>
//                   {user.username?.[0]?.toUpperCase()}
//                 </Avatar>
//                 <Box>
//                   <Typography fontWeight="bold" color="text.primary">
//                     {user.username}
//                   </Typography>
//                   {user.last_message && (
//                     <Typography variant="body2" color="text.secondary">
//                       {user.last_message.content}
//                     </Typography>
//                   )}
//                 </Box>
//               </CardContent>
//             </Card>
//           ))}
//         </Grid>

//         <Grid item xs={8} sx={{ display: "flex", flexDirection: "column" }}>
//           {!selectedUser ? (
//             <Box
//               sx={{
//                 flex: 1,
//                 display: "flex",
//                 alignItems: "center",
//                 justifyContent: "center",
//               }}
//             >
//               <Typography color="text.secondary">
//                 Select a conversation to start chatting
//               </Typography>
//             </Box>
//           ) : (
//             <>
//               <Box
//                 sx={{
//                   p: 2,
//                   borderBottom: `1px solid ${theme.palette.divider}`,
//                   bgcolor: theme.palette.background.paper,
//                 }}
//               >
                
//                 <Typography variant="h6" color="text.primary" sx={{ fontWeight: "bold"}}>
//                   Chat with {selectedUser.username}
//                 </Typography>
//               </Box>

//               <Box sx={{ flex: 1, p: 2, overflowY: "auto" }}>
//                 {messages.map((msg) => {
//                   const isMine = msg.sender !== selectedUser.id;

//                   return (
//                     <Box
//                       key={msg.id}
//                       sx={{
//                         display: "flex",
//                         justifyContent: isMine ? "flex-end" : "flex-start",
//                         mb: 1,
//                       }}
//                     >
//                       <Box
//                         sx={{
//                           maxWidth: "70%",
//                           p: 1.5,
//                           borderRadius: 2,
//                           bgcolor: isMine
//                             ? theme.palette.primary.main
//                             : theme.palette.background.paper,
//                           color: isMine
//                             ? theme.palette.primary.contrastText
//                             : theme.palette.text.primary,
//                         }}
//                       >
//                         <Typography variant="body2">
//                           {msg.content}
//                         </Typography>
//                       </Box>
//                     </Box>
//                   );
//                 })}
//                 <div ref={bottomRef} />
//               </Box>

//               {/* 🔥 ONLY THIS TextField IS DARK MODE */}
//               <Box
//                 sx={{
//                   p: 2,
//                   borderTop: `1px solid ${theme.palette.divider}`,
//                   bgcolor: theme.palette.background.paper,
//                 }}
//               >
                
//                 <Box sx={{ display: "flex", gap: 1 }}>
//                   <TextField
//                     fullWidth
//                     placeholder="Type a message..."
//                     value={messageText}
//                     onChange={(e) => setMessageText(e.target.value)}
//                     sx={{
//                       backgroundColor: "#0F2E35",
//                       borderRadius: 1,

//                       "& .MuiInputBase-input": {
//                         color: "#FFFFFF",
//                       },

//                       "& .MuiInputBase-input::placeholder": {
//                         color: "#B0BEC5",
//                         opacity: 1,
//                       },

//                       "& .MuiOutlinedInput-notchedOutline": {
//                         borderColor: "#1E4D55",
//                       },

//                       "&:hover .MuiOutlinedInput-notchedOutline": {
//                         borderColor: "#4DD0E1",
//                       },

//                       "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
//                         borderColor: "#4DD0E1",
//                       },
//                     }}
//                   />
//                   <Button
//                     variant="contained"
//                     color="primary"
//                     onClick={sendMessage}
//                   >
//                     Send
//                   </Button>
//                 </Box>
//               </Box>
//             </>
//           )}
//         </Grid>
//       </Grid>
//     </Box>
//   );
// };

// export default MessagingPage;


import React, { useEffect, useState, useRef } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  TextField,
  Button,
  Avatar,
  AppBar,
  Toolbar,
 
  Grid,
  Divider,
  useTheme,
} from "@mui/material";
// import ArrowBackIcon from "@mui/icons-material/ArrowBack";
// import { useNavigate } from "react-router-dom";
import messagingApi from "../services/messagingApi";

const POLL_INTERVAL = 3000; // 3 seconds

const MessagingPage = () => {
  // const navigate = useNavigate();
  const theme = useTheme();

  const [conversations, setConversations] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [messageText, setMessageText] = useState("");

  const pollRef = useRef(null);
  const bottomRef = useRef(null);

  const loadConversations = async () => {
    try {
      const res = await messagingApi.get("conversations/");
      setConversations(res.data);
    } catch (err) {
      console.error("Failed to load conversations", err);
    }
  };

  const loadMessages = async (userId) => {
    if (!userId) return;
    try {
      const res = await messagingApi.get(`chat/?user_id=${userId}`);
      setMessages(res.data);
    } catch (err) {
      console.error("Failed to load messages", err);
    }
  };

  const sendMessage = async () => {
    if (!messageText.trim() || !selectedUser) return;

    try {
      await messagingApi.post("chat/", {
        receiver: selectedUser.id,
        content: messageText,
      });

      setMessageText("");
      loadMessages(selectedUser.id);
      loadConversations();
    } catch (err) {
      console.error("Failed to send message", err);
    }
  };

  useEffect(() => {
    if (!selectedUser) return;

    loadMessages(selectedUser.id);

    pollRef.current = setInterval(() => {
      loadMessages(selectedUser.id);
    }, POLL_INTERVAL);

    return () => clearInterval(pollRef.current);
  }, [selectedUser]);

  useEffect(() => {
    loadConversations();
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <Box
      sx={{
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        bgcolor: theme.palette.background.default,
      }}
    >
      <AppBar position="static" color="primary">
        <Toolbar>
          {/* <IconButton edge="start" color="inherit" onClick={() => navigate(-1)}>
            <ArrowBackIcon />
          </IconButton> */}
          
          <Typography
                variant="h5"
                sx={{ fontWeight: 800, letterSpacing: 1, color: "#14323eff" }}
                >
                Messages
          </Typography>
        </Toolbar>
      </AppBar>

      <Grid container sx={{ flex: 1, minHeight: 0 }}>
        <Grid
          item
          xs={4}
          sx={{
            borderRight: `1px solid ${theme.palette.divider}`,
            bgcolor: theme.palette.background.paper,
            display: "flex",
            flexDirection: "column",
            minHeight: 0,
          }}
        >
          <Box sx={{ p: 2 }}>
            <Typography variant="h6" color="text.primary" sx={{ fontWeight: "bold" }}>
              Conversations
            </Typography>
          </Box>
          <Divider />

          <Box sx={{ flex: 1, overflowY: "auto" }}>
            {conversations.map((user) => (
              <Card
                key={user.id}
                sx={{
                  m: 1,
                  cursor: "pointer",
                  bgcolor:
                    selectedUser?.id === user.id
                      ? theme.palette.primary.light
                      : theme.palette.background.paper,
                }}
                onClick={() => setSelectedUser(user)}
              >
                <CardContent sx={{ display: "flex", alignItems: "center" }}>
                  <Avatar sx={{ mr: 2, bgcolor: theme.palette.primary.main }}>
                    {user.username?.[0]?.toUpperCase()}
                  </Avatar>
                  <Box>
                    <Typography fontWeight="bold" color="text.primary">
                      {user.username}
                    </Typography>
                    {user.last_message && (
                      <Typography variant="body2" color="text.secondary">
                        {user.last_message.content}
                      </Typography>
                    )}
                  </Box>
                </CardContent>
              </Card>
            ))}
          </Box>
        </Grid>

        <Grid
          item
          xs={8}
          sx={{
            display: "flex",
            flexDirection: "column",
            minHeight: 0,
          }}
        >
          {!selectedUser ? (
            <Box
              sx={{
                flex: 1,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Typography color="text.secondary">
                Select a conversation to start chatting
              </Typography>
            </Box>
          ) : (
            <>
              <Box
                sx={{
                  p: 2,
                  borderBottom: `1px solid ${theme.palette.divider}`,
                  bgcolor: theme.palette.background.paper,
                }}
              >
                <Typography variant="h6" color="text.primary" sx={{ fontWeight: "bold" }}>
                  Chat with {selectedUser.username}
                </Typography>
              </Box>

              {/* ⚡ Chat messages box */}
              <Box
                sx={{
                  flex: 1,
                  p: 2,
                  overflowY: "auto",
                  bgcolor: theme.palette.background.default,
                }}
              >
                {messages.map((msg) => {
                  const isMine = msg.sender !== selectedUser.id;

                  return (
                    <Box
                      key={msg.id}
                      sx={{
                        display: "flex",
                        justifyContent: isMine ? "flex-end" : "flex-start",
                        mb: 1,
                      }}
                    >
                      <Box
                        sx={{
                          maxWidth: "70%",
                          p: 1.5,
                          borderRadius: 2,
                          bgcolor: isMine
                            ? theme.palette.primary.main
                            : theme.palette.background.paper,
                          color: isMine
                            ? theme.palette.primary.contrastText
                            : theme.palette.text.primary,
                        }}
                      >
                        <Typography variant="body2">{msg.content}</Typography>
                      </Box>
                    </Box>
                  );
                })}
                <div ref={bottomRef} />
              </Box>

              {/* 🔥 Input box */}
              <Box
                sx={{
                  p: 2,
                  borderTop: `1px solid ${theme.palette.divider}`,
                  bgcolor: theme.palette.background.paper,
                }}
              >
                <Box sx={{ display: "flex", gap: 1 }}>
                  <TextField
                    fullWidth
                    placeholder="Type a message..."
                    value={messageText}
                    onChange={(e) => setMessageText(e.target.value)}
                    sx={{
                      backgroundColor: "#0F2E35",
                      borderRadius: 1,
                      "& .MuiInputBase-input": { color: "#FFFFFF" },
                      "& .MuiInputBase-input::placeholder": { color: "#B0BEC5", opacity: 1 },
                      "& .MuiOutlinedInput-notchedOutline": { borderColor: "#1E4D55" },
                      "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: "#4DD0E1" },
                      "&.Mui-focused .MuiOutlinedInput-notchedOutline": { borderColor: "#4DD0E1" },
                    }}
                  />
                  <Button variant="contained" color="primary" onClick={sendMessage}>
                    Send
                  </Button>
                </Box>
              </Box>
            </>
          )}
        </Grid>
      </Grid>
    </Box>
  );
};

export default MessagingPage;
