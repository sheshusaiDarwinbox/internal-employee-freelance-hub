import { createApp } from "./app";
import connect from "./database/connection";

connect().then(() => {
  const app = createApp();
  app.listen(3000, () => {
    console.log("Server running on port 3000");
  });
});
