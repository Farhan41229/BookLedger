import { config } from "dotenv";
import { app } from "./app.js";

config({ path: "./config/config.env" });

const port = process.env.PORT || 4000;

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

// Export for Vercel serverless
export default app;





