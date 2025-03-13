import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  setSocket,
  setConnected,
  addMessage,
} from "../redux/slices/webSocketSlice";
import { io } from "socket.io-client";

const WebSocketComponent = () => {
  const dispatch = useDispatch();
  const { connected } = useSelector((state) => state.websocket);

    // Remove duplicate definition of handleSendMessage

  useEffect(() => {
    const sckt = io("http://localhost:3000", {});

    sckt.on("connect", () => {
      console.log("Connected to server with socket ID:", sckt.id); // Log socket ID
      dispatch(setConnected(true));
      dispatch(setSocket(sckt));
    });

    sckt.on("result", (result) => {
      console.log("Received result from server:", result); // Log received result
      const message = JSON.parse(result.data);
      console.log("Message from server:", message);
      dispatch(addMessage(message));
    });
    sckt.on("close", () => {
      console.log("WebSocket disconnected");
      dispatch(setConnected(false));
    });

    const handleSendMessage = (message) => {
      if (sckt && message) {
        // Emit the message to the server
        sckt.emit("user_input", message);
        console.log("Message sent:", message);
      }
    };

    handleSendMessage("message from the client");

    // Cleanup on unmount
    return () => {
      sckt.close();
    };
  }, [dispatch]);

  return (
    <div>
      <h2>
        WebSocket Connection Status: {connected ? "Connected" : "Disconnected"}
      </h2>
    </div>
  );
};

export default WebSocketComponent;
