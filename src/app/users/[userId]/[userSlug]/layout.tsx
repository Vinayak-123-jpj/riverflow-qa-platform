import { avatars } from "@/models/client/config";
import { users } from "@/models/server/config";
import { UserPrefs } from "@/store/Auth";
import convertDateToRelativeTime from "@/utils/relativeTime";
import { Badge } from "@/components/ui/badge";
import React from "react";
import EditButton from "./EditButton";
import Navbar from "./Navbar";
import { Clock, User } from "lucide-react";

const Layout = async ({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { userId: string; userSlug: string };
}) => {
  const user = await users.get<UserPrefs>(params.userId);

  return (
    <div className="container relative mx-auto max-w-5xl space-y-8 px-4 pb-20 pt-28">
      <div className="absolute inset-x-0 top-0 h-64 bg-hero-gradient pointer-events-none" />

      <div className="relative flex flex-col gap-6 rounded-2xl border border-border bg-card/60 p-6 backdrop-blur-sm sm:flex-row">
        <img
          src={avatars.getInitials(user.name, 112, 112).href}
          alt={user.name}
          className="h-24 w-24 shrink-0 rounded-2xl object-cover ring-2 ring-border sm:h-28 sm:w-28"
        />
        <div className="flex w-full flex-col items-start justify-between gap-4 sm:flex-row">
          <div className="space-y-1.5">
            <h1 className="text-2xl font-bold text-foreground sm:text-3xl">
              {user.name}
            </h1>
            <p className="text-sm text-muted-foreground">{user.email}</p>
            <div className="flex flex-wrap items-center gap-3 pt-1 text-xs text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <User className="h-3.5 w-3.5" />
                Joined {convertDateToRelativeTime(new Date(user.$createdAt))}
              </span>
              <span className="flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5" />
                Active {convertDateToRelativeTime(new Date(user.$updatedAt))}
              </span>
              <Badge variant="reputation">
                {user.prefs.reputation} reputation
              </Badge>
            </div>
          </div>
          <EditButton />
        </div>
      </div>

      <div className="relative flex flex-col gap-6 sm:flex-row">
        <Navbar />
        <div className="w-full min-w-0">{children}</div>
      </div>
    </div>
  );
};

export default Layout;
