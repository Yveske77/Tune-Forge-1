import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { User, LogOut, Settings, Bot } from "lucide-react";

interface UserMenuProps {
  onOpenAgentPanel?: () => void;
}

export function UserMenu({ onOpenAgentPanel }: UserMenuProps) {
  const { user, logout, isLoggingOut } = useAuth();

  if (!user) return null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="h-8 gap-2 text-white/70 hover:text-white hover:bg-white/10" data-testid="button-user-menu">
          {user.profileImageUrl ? (
            <img src={user.profileImageUrl} alt="" className="w-6 h-6 rounded-full" />
          ) : (
            <User className="w-4 h-4" />
          )}
          <span className="text-sm font-mono">{user.firstName || user.email || "User"}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56 bg-card border-white/10">
        <DropdownMenuLabel className="text-white/50 text-xs font-mono">
          {user.email}
        </DropdownMenuLabel>
        <DropdownMenuSeparator className="bg-white/10" />
        {onOpenAgentPanel && (
          <DropdownMenuItem onClick={onOpenAgentPanel} className="cursor-pointer" data-testid="button-open-agent">
            <Bot className="w-4 h-4 mr-2" />
            AI Assistant
          </DropdownMenuItem>
        )}
        <DropdownMenuItem className="cursor-pointer" data-testid="button-settings">
          <Settings className="w-4 h-4 mr-2" />
          Settings
        </DropdownMenuItem>
        <DropdownMenuSeparator className="bg-white/10" />
        <DropdownMenuItem 
          onClick={() => logout()} 
          disabled={isLoggingOut}
          className="cursor-pointer text-red-400 focus:text-red-400"
          data-testid="button-logout"
        >
          <LogOut className="w-4 h-4 mr-2" />
          {isLoggingOut ? "Signing out..." : "Sign out"}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
