import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setSocket, setConnected } from "../redux/slices/webSocketSlice";
import { io } from "socket.io-client";

const WebSocketComponent = () => {
  const dispatch = useDispatch();
  // const { connected } = useSelector((state) => state.websocket);
  const user = useSelector((state) => state.auth.user);

  useEffect(() => {
    const sckt = io("http://localhost:3000", {
      withCredentials: true,
    });

    sckt.on("connect", () => {
      dispatch(setConnected(true));
      dispatch(setSocket(sckt));
    });

    sckt.on("close", () => {
      console.log("WebSocket disconnected");
      dispatch(setConnected(false));
    });

    sckt.emit("register_user", user.EID);

    const handleSendMessage = (message) => {
      if (sckt && message) {
        sckt.emit("user_input", message);
        console.log("Message sent:", message);
      }
    };

    handleSendMessage("message from the client");

    return () => {
      sckt.close();
    };
  }, [dispatch, user.EID]);

  return (
    <div>
      <h2>
        {/* WebSocket Connection Status: {connected ? "Connected" : "Disconnected"} */}
      </h2>
    </div>
  );
};

export default WebSocketComponent;
