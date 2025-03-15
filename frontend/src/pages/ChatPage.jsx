import { useState , useEffect , useRef} from "react";
import { TextInput, Button } from "flowbite-react";
import { HiSearch, HiPaperAirplane } from "react-icons/hi";
import api from "../utils/api";
import { useSelector, useDispatch } from "react-redux";
// import { addMessage as addWebsocketMessage } from "../redux/slices/webSocketSlice";
import {
  setActiveChat,
  addMessage,
  setMessages,
} from "../redux/slices/webSocketSlice";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faCheckDouble, faCheckDouble as faCheckDoubleBlue } from '@fortawesome/free-solid-svg-icons';



const ChatPage = () => {
  const { user } = useSelector((state) => state.auth); // Get user from Redux state
  const  userId  = user?.EID; // Use user.EID as the sender ID
  const [contacts , setContacts] = useState([]); // Initialize contacts state
  const { socket, activeChat, messages } = useSelector(
    (state) => state.websocket);
  const [latestMessages, setLatestMessages] = useState({});
  const readMessages = useRef(new Set());
  const dispatch = useDispatch();
    //for handling the pagination
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const observerTarget = useRef(null);
  const [searchQuery, setSearchQuery] = useState(""); // Initialize searchQuery FIRST

  const getStatusIcon = (status) => {
    switch (status) {
      case "Sent":
        return <FontAwesomeIcon icon={faCheck} />;
      case "Delivered":
        return <FontAwesomeIcon icon={faCheckDouble} />;
      case "Read":
        return <FontAwesomeIcon icon={faCheckDoubleBlue} style={{ color: 'blue' }} />;
      default:
        return null;
    }
  };

  useEffect(() => {
    setContacts([]);
    setPage(1);
    setHasMore(true);
  }, [page,searchQuery]);


  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await api.get(`api/users?page=${page}&search=${searchQuery}`, {
          withCredentials: true,
        });
        if (response.data.docs.length > 0) {
          setContacts((prevContacts) => [...prevContacts, ...response.data.docs]);
        } else {
          setHasMore(false);
        }
        // setContacts(response.data.docs);
        // console.log(response.data.docs);
      } catch (err) {
        console.error("Error fetching users:", err);
      }
    };
    fetchUsers();
  }, [page,searchQuery]);

  // effect for handling the vertical pagination
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setPage((prevPage) => prevPage + 1);
        }
      },
      { threshold: 1 }
    );

    if (observerTarget.current) {
      observer.observe(observerTarget.current);
    }

    return () => {
      if (observerTarget.current) {
        observer.unobserve(observerTarget.current);
      }
    };
  }, [hasMore]);

  const [message, setMessage] = useState("");
  // const [messages, setMessages] = useState([]);

  const filteredContacts = contacts.filter(
    (contact) =>
      contact.fullName &&
      contact.fullName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!message.trim()) return;
  
    if (activeChat) {
      const messageData = {
        MsgID: `msg_${Date.now()}`, // Generate a unique MsgID as a string
        ReceiverID: activeChat.EID,
        Content: message,
        SenderID: userId,
      };
      console.log("Active chat id :",activeChat.EID);
      console.log("User id :",userId);
      console.log("Sending message data:", messageData);

      if (socket) {
        socket.emit("sendMessage", messageData);
        setMessage("");
      } else {
        console.error("Socket not connected.");
      }
    }
  };

  useEffect(() => {
    if (socket && userId) {
      socket.emit("userOnline", userId);

      socket.on("receiveMessage", (message) => {
          dispatch(addMessage(message));
          if (activeChat && activeChat.EID === message.SenderID && message.ReceiverID === userId) {
              socket.emit("messageRead", message.MsgID); // Mark as read
          }
      });

      socket.on("chatHistory", ({ chatHistory, latestMessage }) => {
        dispatch(setMessages(chatHistory));
        if (latestMessage) {
            setLatestMessages((prev) => ({
                ...prev,
                [activeChat?.EID]: latestMessage,
            }));
        }
        chatHistory.forEach((msg) => {
          if (msg.SenderID.EID === activeChat?.EID && msg.ReceiverID === userId && msg.Status === "Delivered" && !readMessages.current.has(msg.MsgID)) {
              socket.emit("messageRead", msg.MsgID);
              readMessages.current.add(msg.MsgID);
          }
      });
      });
        socket.on("updateUserStatus", (data) => {
            console.log("Received updateUserStatus:", data); // Add this log
            setContacts((prevContacts) =>
                prevContacts.map((contact) => {
                    if (contact.EID === data.userID) {
                        console.log("Updating contact:", contact.EID, "to", data.status); //add this log
                        return { ...contact, Online: data.status === "Online" };
                    }
                    return contact;
                })
            );
        })
    
        socket.on("updateMessageStatus", (data) => {
          setMessages((prevMessages) =>
              prevMessages.map((msg) =>
                  msg.MsgID === data.MsgID ? { ...msg, Status: data.Status } : msg
              )
          );
      });
    }
      return () => {
        if (socket) {
            socket.off("receiveMessage");
            socket.off("chatHistory");
            socket.off("updateUserStatus");
            socket.off("updateMessageStatus");
            if (userId) {
                socket.emit("userOffline", userId);
            }
        }
      };
      }, [socket, dispatch, userId, activeChat]);

      useEffect(() => {
        if (activeChat && messages.length > 0) {
            messages.forEach((msg) => {
                if (msg.SenderID.EID === activeChat?.EID && msg.ReceiverID === userId && msg.Status === "Delivered" && !readMessages.current.has(msg.MsgID)) {
                    socket.emit("messageRead", msg.MsgID);
                    readMessages.current.add(msg.MsgID);
                }
            });
        }
    }, [activeChat, messages, socket, userId]);

  useEffect(() => {
    if (activeChat && activeChat.EID && socket && userId) {
      socket.emit("getChatHistory", { user1Id: userId, user2Id: activeChat.EID }); //Emit getChatHistory event
    }
  }, [activeChat, userId, socket]);

  return (
    <div className="h-full flex">
      {/* Contacts Sidebar */}
      <div className="w-1/4 border-r border-gray-200 bg-white flex flex-col h-[calc(100vh-12rem)]">
        <div className="p-4 border-b">
          <TextInput
            icon={HiSearch}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search contacts..."
          />
        </div>
        <div className="flex-1 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']">
          {filteredContacts.map((contact) => (
            <div
              key={contact._id}
              onClick={() => dispatch(setActiveChat(contact))}
              className={`p-4 cursor-pointer rounded-md ${
                activeChat?._EID === contact._id
                  ? "bg-slate-400 hover:bg-slate-500 text-white"
                  : "hover:bg-gray-100"
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center">
                  {contact.fullName.charAt(0)}
                  </div>
                  {contact.Online && (
                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
                  )}
                </div>
                <div>
                  <h3
                    className={`font-medium ${
                      activeChat?.EID === contact._id ? "text-white" : ""
                    }`}
                  >
                    {contact.fullName} 
                  </h3>
                  
                  <p
                    className={`text-sm truncate ${
                      activeChat?.EID === contact._id
                        ? "text-white/70"
                        : "text-gray-500"
                    }`}
                  >
                    {contact.lastMessage}
                  </p>
                </div>
              </div>
            </div>
          ))}
          {hasMore && <div ref={observerTarget}></div>}
        </div>
      </div>

      {/* Chat Window */}
      <div className="flex-1 flex flex-col h-[calc(100vh-12rem)] bg-white">
        {activeChat ? (
          <>
            {/* Chat Header */}
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center">
                  {activeChat.fullName.charAt(0)}
                </div>
                <div>
                  <h2 className="font-medium">{activeChat.fullName}</h2>
                  <p className="text-sm text-gray-500">
                    {activeChat.Online ? "Online" : "Offline"}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex-1 flex flex-col h-[calc(100vh-12rem)] bg-white">
              <div className="flex-1 max-h-[calc(100vh-180px)] overflow-y-auto p-4 space-y-4 bg-gray-50 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']">
                {messages.map((msg) => (
                  <div
                  key={msg.MsgID}
                  className={`flex ${msg.SenderID === userId ? "justify-end" : "justify-start"}`}
                  title={new Date(msg.Timestamp).toLocaleString()}
                  >
                    <div
                      className={`max-w-[70%] rounded-lg p-3 ${
                        msg.SenderID === userId
                          ? "bg-blue-500 text-white"
                          : "bg-white border border-gray-200"
                      }`}
                    >
                      <p>{msg.Content}</p>
                      <div className="flex gap-1">
                      <p className="text-xs mt-1 opacity-70">
                          {new Date(msg.Timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                        <p className="text-xs mt-1 opacity-70">
                          {getStatusIcon(msg.Status)}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t border-gray-200 bg-white">
                <form onSubmit={handleSendMessage} className="p-4">
                  <div className="flex items-center gap-2">
                    <TextInput
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Type a message..."
                      className="flex-1"
                      required
                    />
                    <Button
                      type="submit"
                      className="p-2.5 bg-slate-600 rounded-full"
                    >
                      <HiPaperAirplane className="w-5 h-5 rotate-90" />
                    </Button>
                  </div>
                </form>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center bg-gray-50">
            <p className="text-gray-500">Select a contact to start chatting</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatPage;