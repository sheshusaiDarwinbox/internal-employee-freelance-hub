import { useState } from "react";
import { TextInput, Button } from "flowbite-react";
import { HiSearch, HiPaperAirplane } from "react-icons/hi";

const ChatPage = () => {
  const [contacts, setContacts] = useState([
    { id: 1, name: "John Doe", lastMessage: "Hello!", online: true },
    { id: 2, name: "Jane Smith", lastMessage: "How are you?", online: false },
    { id: 3, name: "Jane Smith", lastMessage: "How are you?", online: false },
    { id: 4, name: "Jane Smith", lastMessage: "How are you?", online: false },
    { id: 5, name: "Jane Smith", lastMessage: "How are you?", online: false },
    { id: 6, name: "Jane Smith", lastMessage: "How are you?", online: false },
    { id: 7, name: "Jane Smith", lastMessage: "How are you?", online: false },
    { id: 8, name: "Jane Smith", lastMessage: "How are you?", online: false },
    { id: 9, name: "Jane Smith", lastMessage: "How are you?", online: false },
    { id: 10, name: "Jane Smith", lastMessage: "How are you?", online: false },
    { id: 11, name: "Jane Smith", lastMessage: "How are you?", online: false },
    { id: 12, name: "Jane Smith", lastMessage: "How are you?", online: false },
    { id: 13, name: "Jane Smith", lastMessage: "How are you?", online: false },
    { id: 14, name: "Jane Smith", lastMessage: "How are you?", online: false },
    { id: 15, name: "Jane Smith", lastMessage: "How are you?", online: false },
    { id: 16, name: "Jane Smith", lastMessage: "How are you?", online: false },
    { id: 17, name: "Jane Smith", lastMessage: "How are you?", online: false },
    { id: 18, name: "Jane Smith", lastMessage: "How are you?", online: false },
    { id: 19, name: "Jane Smith", lastMessage: "How are you?", online: false },
    { id: 21, name: "Jane Smith", lastMessage: "How are you?", online: false },
    { id: 22, name: "Jane Smith", lastMessage: "How are you?", online: false },
    { id: 23, name: "Jane Smith", lastMessage: "How are you?", online: false },
    { id: 24, name: "Jane Smith", lastMessage: "How are you?", online: false },
    { id: 25, name: "Jane Smith", lastMessage: "How are you?", online: false },
    { id: 26, name: "Jane Smith", lastMessage: "How are you?", online: false },
    { id: 27, name: "Jane Smith", lastMessage: "How are you?", online: false },
    { id: 28, name: "Jane Smith", lastMessage: "How are you?", online: false },
    { id: 29, name: "Jane Smith", lastMessage: "How are you?", online: false },
    { id: 30, name: "Jane Smith", lastMessage: "How are you?", online: false },
  ]);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeChat, setActiveChat] = useState(null);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);

  const filteredContacts = contacts.filter((contact) =>
    contact.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    const newMessage = {
      id: Date.now(),
      text: message,
      sender: "me",
      timestamp: new Date().toLocaleTimeString(),
    };

    setMessages([...messages, newMessage]);
    setMessage("");
  };

  return (
    <div className="h-full flex">
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
              key={contact.id}
              onClick={() => setActiveChat(contact)}
              className={`p-4 cursor-pointer ${
                activeChat?.id === contact.id
                  ? "bg-blue-400 hover:bg-blue-500 text-white"
                  : "hover:bg-gray-100"
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center">
                    {contact.name.charAt(0)}
                  </div>
                  {contact.online && (
                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
                  )}
                </div>
                <div>
                  <h3
                    className={`font-medium ${
                      activeChat?.id === contact.id ? "text-white" : ""
                    }`}
                  >
                    {contact.name}
                  </h3>
                  <p
                    className={`text-sm truncate ${
                      activeChat?.id === contact.id
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
        </div>
      </div>

      <div className="flex-1 flex flex-col h-[calc(100vh-12rem)] bg-white">
        {activeChat ? (
          <>
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center">
                  {activeChat.name.charAt(0)}
                </div>
                <div>
                  <h2 className="font-medium">{activeChat.name}</h2>
                  <p className="text-sm text-gray-500">
                    {activeChat.online ? "Online" : "Offline"}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex-1 max-h-[calc(100vh-180px)] overflow-y-auto p-4 space-y-4 bg-gray-50 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${
                    msg.sender === "me" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-[70%] rounded-lg p-3 ${
                      msg.sender === "me"
                        ? "bg-blue-500 text-white"
                        : "bg-white border border-gray-200"
                    }`}
                  >
                    <p>{msg.text}</p>
                    <p className="text-xs mt-1 opacity-70">{msg.timestamp}</p>
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
                    color="blue"
                    className="p-2.5 rounded-full"
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
