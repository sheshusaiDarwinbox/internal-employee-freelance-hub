import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  setSocket,
  setConnected,
  addMessage,
} from "../redux/slices/webSocketSlice";
import { io } from "socket.io-client";

const WebSocketComponent = () => {
  const dispatch = useDispatch();
  const { socket, connected } = useSelector((state) => state.websocket);

  useEffect(() => {
    const sckt = io("http://localhost:4000", {});

    sckt.on("connect", () => {
      //   console.log("Connected to server with socket ID:", sckt.id);
      dispatch(setConnected(true));
      dispatch(setSocket(sckt));
    });

    sckt.on("result", (result) => {
      console.log("Received result from server:", result);
      const message = JSON.parse(result.data);
      console.log("Message from server:", message);
      dispatch(addMessage(message));
    });
    sckt.on("close", () => {
      console.log("WebSocket disconnected");
      dispatch(setConnected(false));
    });

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
