import { createApp } from "./app";
import connect from "./database/connection";
import { setAdmin } from "./utils/adminSetup.util";
import { initializeCounters } from "./utils/counterManager.util";

connect().then(() => {
  const app = createApp();
  app.listen(3000, () => {
    console.log("Server running on port 3000");
    setAdmin();
    initializeCounters();
  });
});
