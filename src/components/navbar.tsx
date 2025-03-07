import Link from "next/link";
import { createClient } from "../../supabase/server";
import { Button } from "./ui/button";
import { MessageSquare, UserCircle } from "lucide-react";
import UserProfile from "./user-profile";

export default async function Navbar() {
  const supabase = createClient();

  const {
    data: { user },
  } = await (await supabase).auth.getUser();

  return (
    <nav className="w-full bg-card">
      <div className="nav-container container-xl">
        <div className="flex items-center">
          <Link
            href="/"
            prefetch
            className="text-xl font-bold flex items-center"
          >
            <MessageSquare className="h-6 w-6 mr-2 feature-icon" />
            <span>RAGify</span>
          </Link>
          <div className="hidden md:flex ml-10 space-x-8">
            <Link href="#" className="nav-link">
              Features
            </Link>
            <Link href="#" className="nav-link">
              Solutions
            </Link>
            <Link href="#pricing" className="nav-link">
              Pricing
            </Link>
            <Link href="#" className="nav-link">
              Resources
            </Link>
          </div>
        </div>
        <div className="flex gap-4 items-center">
          {user ? (
            <>
              <Link href="/dashboard">
                <Button variant="default" size="sm">
                  Dashboard
                </Button>
              </Link>
              <UserProfile />
            </>
          ) : (
            <>
              <Link href="/sign-in" className="nav-link px-3 py-2">
                Sign In
              </Link>
              <Link
                href="/sign-up"
                className="primary-button text-sm px-4 py-2"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
