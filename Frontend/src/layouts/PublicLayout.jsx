import { Outlet } from "react-router"; 
import Navbar from "@/components/layout/Navbar"; // ⚠️ Verify this path matches your project!

const PublicLayout = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      {/* You can add <Footer /> here too if you have one */}
    </div>
  );
};

export default PublicLayout;