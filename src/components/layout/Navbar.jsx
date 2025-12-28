"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { Menu, X, User, LogOut } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useAuth } from "@/hooks/useAuth";

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { uploader, isAuthenticated, logout } = useAuth();

  return (
    <nav className="sticky top-0 z-50 glass border-b border-white/10 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3">
            <Image
              src="/MainLogo.png"
              alt="IMUII Studio"
              width={32}
              height={32}
              className="w-8 h-8"
              priority
            />
            <span className="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              studio.imuii.id
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            <Link
              href="/"
              className="text-sm font-medium text-foreground hover:text-primary transition-colors"
            >
              Home
            </Link>
            {isAuthenticated && (
              <Link
                href="/my-templates"
                className="text-sm font-medium text-foreground hover:text-primary transition-colors"
              >
                My Templates
              </Link>
            )}
            <Link
              href="/create"
              className="text-sm font-medium text-foreground hover:text-primary transition-colors"
            >
              Create
            </Link>
            <Link
              href="/faq"
              className="text-sm font-medium text-foreground hover:text-primary transition-colors"
            >
              FAQ
            </Link>
          </div>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center gap-3">
            {isAuthenticated ? (
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                    <User size={16} className="text-primary" />
                  </div>
                  <span className="text-sm text-foreground">{uploader?.name || uploader?.username}</span>
                </div>
                <Button variant="ghost" size="sm" onClick={logout}>
                  <LogOut size={16} className="mr-2" />
                  Logout
                </Button>
              </div>
            ) : (
              <>
                <Link href="/login">
                  <Button variant="ghost" size="sm">
                    Login
                  </Button>
                </Link>
                <Link href="/register">
                  <Button variant="accent" size="sm">
                    Register
                  </Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 rounded-lg hover:bg-white/5 transition-colors"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-white/10">
            <div className="flex flex-col gap-3">
              <Link
                href="/"
                className="text-sm font-medium text-foreground hover:text-primary transition-colors py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
              {isAuthenticated && (
                <Link
                  href="/my-templates"
                  className="text-sm font-medium text-foreground hover:text-primary transition-colors py-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  My Templates
                </Link>
              )}
              <Link
                href="/create"
                className="text-sm font-medium text-foreground hover:text-primary transition-colors py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                Create
              </Link>
              <Link
                href="/faq"
                className="text-sm font-medium text-foreground hover:text-primary transition-colors py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                FAQ
              </Link>
              <div className="pt-3 border-t border-white/10 flex flex-col gap-2">
                {isAuthenticated ? (
                  <>
                    <div className="flex items-center gap-2 py-2">
                      <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                        <User size={16} className="text-primary" />
                      </div>
                      <span className="text-sm text-foreground">{uploader?.name || uploader?.username}</span>
                    </div>
                    <Button variant="ghost" size="sm" className="w-full justify-start" onClick={logout}>
                      <LogOut size={16} className="mr-2" />
                      Logout
                    </Button>
                  </>
                ) : (
                  <>
                    <Link href="/login" onClick={() => setIsMenuOpen(false)}>
                      <Button variant="ghost" size="sm" className="w-full">
                        Login
                      </Button>
                    </Link>
                    <Link href="/register" onClick={() => setIsMenuOpen(false)}>
                      <Button variant="accent" size="sm" className="w-full">
                        Register
                      </Button>
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}

