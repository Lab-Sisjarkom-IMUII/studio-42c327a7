"use client";

import Link from "next/link";
import Image from "next/image";
import { Github, Twitter, Mail } from "lucide-react";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-white/10 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <Image
                src="/MainLogo.png"
                alt="IMUII Studio"
                width={32}
                height={32}
                className="w-8 h-8"
              />
              <span className="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                studio.imuii.id
              </span>
            </div>
            <p className="text-sm text-zinc-400 max-w-md">
              Platform untuk berbagi dan menemukan template portfolio dan CV terbaik untuk <a href="https://imuii.id" target="_blank" rel="noopener noreferrer" className="text-primary hover:text-primary/80">imuii.id</a>.
              Buat, upload, dan gunakan template berkualitas tinggi untuk kebutuhan portfolio Anda.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-semibold text-foreground mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/"
                  className="text-sm text-zinc-400 hover:text-primary transition-colors"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href="/create"
                  className="text-sm text-zinc-400 hover:text-primary transition-colors"
                >
                  Create Template
                </Link>
              </li>
              <li>
                <Link
                  href="/faq"
                  className="text-sm text-zinc-400 hover:text-primary transition-colors"
                >
                  FAQ
                </Link>
              </li>
            </ul>
          </div>

          {/* Social */}
          <div>
            <h3 className="text-sm font-semibold text-foreground mb-4">Connect</h3>
            <div className="flex gap-3">
              <a
                href="#"
                className="p-2 rounded-lg bg-black/40 hover:bg-primary/20 text-zinc-400 hover:text-primary transition-colors"
                aria-label="GitHub"
              >
                <Github size={18} />
              </a>
              <a
                href="#"
                className="p-2 rounded-lg bg-black/40 hover:bg-primary/20 text-zinc-400 hover:text-primary transition-colors"
                aria-label="Twitter"
              >
                <Twitter size={18} />
              </a>
              <a
                href="#"
                className="p-2 rounded-lg bg-black/40 hover:bg-primary/20 text-zinc-400 hover:text-primary transition-colors"
                aria-label="Email"
              >
                <Mail size={18} />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-white/10">
          <p className="text-sm text-zinc-400 text-center">
            © {currentYear} studio.imuii.id. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

