import { createSlice } from "@reduxjs/toolkit";

const websocketSlice = createSlice({
  name: "websocket",
  initialState: {
    socket: null,
    connected: false,
    messages: [],
    activeChat: null,
  },
  reducers: {
    setSocket: (state, action) => {
      state.socket = action.payload;
    },
    setConnected: (state, action) => {
      state.connected = action.payload;
    },
    addMessage: (state, action) => {
      state.messages.push(action.payload);
    },
    setActiveChat: (state, action) => {
      state.activeChat = action.payload;
      state.messages = []; // Clear messages when switching chats
    },
    setMessages: (state, action) => {
      state.messages = action.payload;
    },
  },
});

export const {
  setSocket,
  setConnected,
  addMessage,
  setActiveChat,
  setMessages,
} = websocketSlice.actions;
export default websocketSlice.reducer;