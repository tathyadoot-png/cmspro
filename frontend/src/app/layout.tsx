import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import NotificationInitializer from "@/components/NotificationInitializer";
import { NotificationProvider } from "@/context/NotificationContext";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
<NotificationProvider>  
        <AuthProvider>
          <NotificationInitializer /> {/* 🔥 ADD THIS */}
          {children}
        </AuthProvider>
</NotificationProvider>
      </body>
    </html>
  );
}