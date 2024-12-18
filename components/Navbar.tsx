"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  AlertCircle,
  BarChart3,
  BookOpen,
  Calendar,
  GraduationCap,
  LayoutDashboard,
  LogOut,
  School,
  User,
  Users,
} from "lucide-react";

import { cn } from "@/lib/utils";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { Separator } from "@/components/ui/separator";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Nav } from "./nav";
import { signout } from "@/actions/user";
import { ScrollArea } from "./ui/scroll-area";

interface NavbarProps {
  defaultLayout: number[] | undefined;
  defaultCollapsed?: boolean;
  navCollapsedSize: number;
  children: React.ReactNode;
  user: { name: string; email: string } | null;
}

export function Navbar({
  defaultLayout = [18, 82],
  defaultCollapsed = false,
  navCollapsedSize,
  children,
  user,
}: NavbarProps) {
  const [isCollapsed, setIsCollapsed] = React.useState(defaultCollapsed);
  const pathname = usePathname();

  const getNavItemVariant = (href: string) => {
    return pathname.startsWith(href)  ? "default" : "ghost";
  };

  return (
    <TooltipProvider delayDuration={0}>
      <ResizablePanelGroup
        direction="horizontal"
        onLayout={(sizes: number[]) => {
          document.cookie = `react-resizable-panels:layout=${JSON.stringify(
            sizes
          )}`;
        }}
        className="h-screen items-stretch"
      >
        <ResizablePanel
          defaultSize={defaultLayout[0]}
          collapsedSize={navCollapsedSize}
          collapsible={true}
          minSize={15}
          maxSize={18}
          onCollapse={() => {
            setIsCollapsed(true);
           
            // document.cookie = `react-resizable-panels:collapsed=${JSON.stringify(
            //   true
            // )}`;
            
          }}
          onExpand={() => {
            setIsCollapsed(false);
            
            // document.cookie = `react-resizable-panels:collapsed=${JSON.stringify(
            //   false
            // )}`;
          }}
          className={cn(
            "flex flex-col",
            isCollapsed &&
              "min-w-[50px] transition-all duration-300 ease-in-out"
          )}
        >
          <div className="flex h-full flex-col">
            <div
              className={cn(
                "flex h-[52px] items-center",
                isCollapsed
                  ? "h-[52px] justify-center"
                  : "px-2 pl-4 justify-start gap-3"
              )}
            >
              <GraduationCap className="h-9 w-7" />
              {!isCollapsed && (
                <span className="font-extrabold">Elevate</span>
              )}
            </div>
            <Separator />
            <Nav
              isCollapsed={isCollapsed}
              links={[
                {
                  title: "Dashboard",
                  label: "",
                  icon: LayoutDashboard,
                  variant: getNavItemVariant("/dashboard"),
                  href: "/dashboard",
                },
                {
                  title: "Classes",
                  label: "",
                  icon: School,
                  variant: getNavItemVariant("/classes"),
                  href: "/classes",
                },
                {
                  title: "Analytics",
                  label: "",
                  icon: BarChart3,
                  variant: getNavItemVariant("/analytics"),
                  href: "/analytics",
                },
                {
                  title: "LMS",
                  label: "",
                  icon: BookOpen,
                  variant: getNavItemVariant("/lms"),
                  href: "/lms",
                },
                {
                  title: "Attendance",
                  label: "",
                  icon: Calendar,
                  variant: getNavItemVariant("/attendance"),
                  href: "/attendance",
                },
              ]}
            />
            <Separator />
            <Nav
              isCollapsed={isCollapsed}
              links={[
                {
                  title: "Students",
                  label: "",
                  icon: Users,
                  variant: getNavItemVariant("/students"),
                  href: "/students",
                },
                {
                  title: "Notifications",
                  label: "",
                  icon: AlertCircle,
                  variant: getNavItemVariant("/notifications"),
                  href: "/notifications",
                },
              ]}
            />
            <div className="mt-auto mb-4">
              {user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="w-full justify-start">
                      <Avatar className="h-8 w-8 mr-2">
                        <AvatarImage
                          // src="/placeholder.svg?height=32&width=32"
                          alt={user.name}
                        />
                        <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      {!isCollapsed && (
                        <span className="truncate">{user.name}</span>
                      )}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuLabel>My Account</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>
                      <User className="mr-2 h-4 w-4" />
                      <span>Profile</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <form action={signout} className="w-full">
                        <Button
                          type="submit"
                          variant="ghost"
                          className="w-full justify-start"
                        >
                          <LogOut className="mr-2 h-4 w-4" />
                          <span>Log out</span>
                        </Button>
                      </form>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <div className="flex flex-col gap-2 px-2">
                  <Link href="/login" passHref>
                    <Button variant="outline" className="w-full">
                      Login
                    </Button>
                  </Link>
                  <Link href="/register" passHref>
                    <Button variant="outline" className="w-full">
                      Register
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel
          defaultSize={defaultLayout[1]}
          minSize={82}
          className="relative"
        >
          <ScrollArea className={`h-full w-full `}>
            <div className="p-4">{children}</div>
          </ScrollArea>
        </ResizablePanel>
      </ResizablePanelGroup>
    </TooltipProvider>
  );
}
