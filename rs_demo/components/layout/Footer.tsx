import Link from "next/link";
import { Facebook, Instagram, Linkedin, Twitter, Youtube } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t bg-muted/40">
      <div className="container mx-auto px-4 py-12 md:px-6">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          {/* Brand */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-primary">RxWithDrGeorge</h3>
            <p className="text-sm text-muted-foreground">
              Empowering you with expert health insights, digital resources, and professional pharmacy services.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="mb-4 text-sm font-semibold">Quick Links</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/about" className="hover:text-primary">About Dr. George</Link></li>
              <li><Link href="/store" className="hover:text-primary">Digital Store</Link></li>
              <li><Link href="/blog" className="hover:text-primary">Health Blog</Link></li>
              <li><Link href="/media" className="hover:text-primary">Media & Press</Link></li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="mb-4 text-sm font-semibold">Services</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/appointments" className="hover:text-primary">Medication Review</Link></li>
              <li><Link href="/appointments" className="hover:text-primary">Diabetes Consulting</Link></li>
              <li><Link href="/speaking" className="hover:text-primary">Speaking Engagements</Link></li>
            </ul>
          </div>

          {/* Social & Newsletter */}
          <div>
            <h4 className="mb-4 text-sm font-semibold">Connect</h4>
            <div className="flex space-x-4">
              <Link href="#" className="text-muted-foreground hover:text-primary">
                <Twitter className="h-5 w-5" />
                <span className="sr-only">Twitter</span>
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-primary">
                <Instagram className="h-5 w-5" />
                <span className="sr-only">Instagram</span>
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-primary">
                <Linkedin className="h-5 w-5" />
                <span className="sr-only">LinkedIn</span>
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-primary">
                <Youtube className="h-5 w-5" />
                <span className="sr-only">YouTube</span>
              </Link>
            </div>
            <div className="mt-6">
              <h5 className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Subscribe to Newsletter
              </h5>
              <form className="flex gap-2">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="w-full rounded-md border bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                />
                <button
                  type="submit"
                  className="rounded-md bg-primary px-3 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
                >
                  Join
                </button>
              </form>
            </div>
          </div>
        </div>
        <div className="mt-12 border-t pt-8 text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} RxWithDrGeorge. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
