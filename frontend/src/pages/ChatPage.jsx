import { useState, useEffect, useRef } from "react";
import { TextInput, Button } from "flowbite-react";
import { HiSearch, HiPaperAirplane } from "react-icons/hi";
import { io } from "socket.io-client";
import api from "../utils/api";
import { useSelector } from "react-redux";

const ChatPage = () => {
  const [contacts, setContacts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeChat, setActiveChat] = useState(null);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const socketRef = useRef(null);
  const messagesEndRef = useRef(null);
  const user = useSelector((state) => state.auth.user);
  const [currentUser] = useState(user);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Fetch messages when active chat changes
  useEffect(() => {
    const fetchMessages = async () => {
      if (!activeChat || !currentUser) return;

      try {
        const [sentResponse, receivedResponse] = await Promise.all([
          api.get(`api/messages/${currentUser.EID}/${activeChat.EID}`, {
            withCredentials: true,
          }),
          api.get(`api/messages/${activeChat.EID}/${currentUser.EID}`, {
            withCredentials: true,
          }),
        ]);

        const allMessages = [
          ...(sentResponse.data || []),
          ...(receivedResponse.data || []),
        ].sort(
          (a, b) =>
            new Date(a.Timestamp).getTime() - new Date(b.Timestamp).getTime()
        );

        setMessages(allMessages);
        scrollToBottom();
      } catch (err) {
        console.error("Error fetching messages:", err);
      }
    };

    fetchMessages();
  }, [activeChat, currentUser]);

  // Socket connection and event handling
  useEffect(() => {
    const socket = io("http://localhost:3000", {
      withCredentials: true,
    });
    socketRef.current = socket;

    socket.on("connect", () => {
      console.log("Connected to socket server");
      socket.emit("register_user");
    });

    socket.on("users_list", (users) => {
      setContacts((prev) =>
        prev.map((contact) => ({
          ...contact,
          online: users.includes(contact.EID),
        }))
      );
    });

    socket.on("receive_message", (msg) => {
      // Update messages if they belong to the active chat
      console.log(msg);
      console.log(activeChat);
      console.log(currentUser);
      if (activeChat && msg.SenderID === activeChat.EID) {
        console.log(msg);
        setMessages((prev) => {
          const messageExists = prev.some(
            (m) =>
              m.SenderID === msg.SenderID &&
              m.ReceiverID === msg.ReceiverID &&
              m.Timestamp === msg.Timestamp &&
              m.Content === msg.Content
          );

          if (!messageExists) {
            return [...prev, msg];
          }
          return prev;
        });
        scrollToBottom();
      }

      // Update contact's last message
      setContacts((prev) =>
        prev.map((contact) => {
          if (contact.EID === msg.SenderID || contact.EID === msg.ReceiverID) {
            return {
              ...contact,
              lastMessage: msg.Content,
            };
          }
          return contact;
        })
      );
    });

    return () => {
      socket.disconnect();
    };
  }, [activeChat, currentUser]);

  // Fetch users
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await api.get(`api/users/users-details`, {
          withCredentials: true,
        });
        setContacts(
          response.data.docs.map((user) => ({
            ...user,
            online: false,
          }))
        );
      } catch (err) {
        console.error("Error fetching users:", err);
      }
    };
    fetchUsers();
  }, []);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!message.trim() || !activeChat || !currentUser || !socketRef.current)
      return;

    const messageData = {
      SenderID: currentUser.EID,
      ReceiverID: activeChat.EID,
      Content: message,
    };

    // Optimistically add the message to the UI
    const newMessage = {
      ...messageData,
      Timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, newMessage]);

    // Update the last message for the active chat
    setContacts((prev) =>
      prev.map((contact) => {
        if (contact.EID === activeChat.EID) {
          return {
            ...contact,
            lastMessage: message,
          };
        }
        return contact;
      })
    );

    // Send the message through socket
    socketRef.current.emit("send_message", messageData);
    setMessage("");
    scrollToBottom();
  };

  const filteredContacts = contacts.filter((contact) => {
    if (contact.fullName)
      return contact.fullName.toLowerCase().includes(searchQuery.toLowerCase());
    return false;
  });

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
              onClick={() => setActiveChat(contact)}
              className={`p-4 cursor-pointer rounded-md ${
                activeChat?._id === contact._id
                  ? "bg-slate-400 hover:bg-slate-500 text-white"
                  : "hover:bg-gray-100"
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center">
                    {contact?.img && (
                      <img
                        src={contact.img}
                        className="rounded-full object-cover w-10 h-10"
                        alt=""
                      />
                    )}
                    {!contact?.img && contact.fullName.charAt(0)}
                  </div>
                  {contact.online && (
                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
                  )}
                </div>
                <div>
                  <h3
                    className={`font-medium ${
                      activeChat?._id === contact._id ? "text-white" : ""
                    }`}
                  >
                    {contact.fullName}
                  </h3>
                  <p
                    className={`text-sm truncate ${
                      activeChat?._id === contact._id
                        ? "text-white/70"
                        : "text-gray-500"
                    }`}
                  >
                    {contact.lastMessage || "No messages yet"}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Chat Window */}
      <div className="flex-1 flex flex-col h-[calc(100vh-12rem)] bg-white">
        {activeChat ? (
          <>
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center">
                  {activeChat?.img && (
                    <img
                      src={activeChat.img}
                      className="rounded-full object-cover w-10 h-10"
                      alt=""
                    />
                  )}
                  {!activeChat?.img && activeChat.fullName.charAt(0)}
                </div>
                <div>
                  <h2 className="font-medium">{activeChat.fullName}</h2>
                  <p className="text-sm text-gray-500">
                    {activeChat.online ? "Online" : "Offline"}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex-1 max-h-[calc(100vh-180px)] overflow-y-auto p-4 space-y-4 bg-gray-50 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']">
              {messages.map((msg, index) => (
                <div
                  key={index}
                  className={`flex ${
                    msg.SenderID === currentUser?.EID
                      ? "justify-end"
                      : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-[70%] rounded-lg p-3 ${
                      msg.SenderID === currentUser?.EID
                        ? "bg-blue-500 text-white"
                        : "bg-white border border-gray-200"
                    }`}
                  >
                    <p>{msg.Content}</p>
                    <p className="text-xs mt-1 opacity-70">
                      {new Date(msg.Timestamp).toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
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
