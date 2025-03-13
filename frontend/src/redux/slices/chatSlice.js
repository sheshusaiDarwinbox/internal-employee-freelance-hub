import { createSlice } from "@reduxjs/toolkit";

const chatSlice = createSlice({
  name: "chat",
  initialState: {
    activeChat: null,
    messages: [],
  },
  reducers: {
    setActiveChat: (state, action) => {
      state.activeChat = action.payload;
      state.messages = []; // Clear messages when switching chats
    },
    addMessage: (state, action) => {
      state.messages.push(action.payload);
    },
    setMessages: (state, action) => {
      state.messages = action.payload;
    }
  },
});

export const { setActiveChat, addMessage, setMessages } = chatSlice.actions;
export default chatSlice.reducer;