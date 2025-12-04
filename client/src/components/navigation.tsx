import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Radio } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { cn } from "@/lib/utils";
import { useRadio } from "@/lib/radio-context";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/releases", label: "Releases" },
  { href: "/artists", label: "Artists" },
  { href: "/events", label: "Events" },
  { href: "/radio", label: "Radio" },
  { href: "/videos", label: "Videos" },
  { href: "/news", label: "News" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export function Navigation() {
  const [location] = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { isPlaying, isLive } = useRadio();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  return (
    <>
      <header
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
          isScrolled
            ? "bg-background/80 backdrop-blur-lg border-b border-border"
            : "bg-transparent"
        )}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center justify-between h-16 lg:h-20">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2" data-testid="link-logo">
              <span className="text-xl lg:text-2xl font-bold tracking-tight font-sans">
                GROUP<span className="text-primary">THERAPY</span>
              </span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-1">
              {navLinks.map((link) => (
                <Link key={link.href} href={link.href}>
                  <Button
                    variant="ghost"
                    className={cn(
                      "text-sm font-medium",
                      location === link.href && "bg-accent text-accent-foreground"
                    )}
                    data-testid={`link-nav-${link.label.toLowerCase()}`}
                  >
                    {link.label}
                    {link.label === "Radio" && isLive && (
                      <span className="ml-1.5 flex h-2 w-2">
                        <span className={cn(
                          "absolute inline-flex h-2 w-2 rounded-full opacity-75",
                          isPlaying ? "animate-ping bg-primary" : "bg-muted-foreground"
                        )} />
                        <span className={cn(
                          "relative inline-flex rounded-full h-2 w-2",
                          isPlaying ? "bg-primary" : "bg-muted-foreground"
                        )} />
                      </span>
                    )}
                  </Button>
                </Link>
              ))}
            </div>

            {/* Right Side */}
            <div className="flex items-center gap-2">
              <Link href="/radio">
                <Button
                  variant={isPlaying ? "default" : "outline"}
                  size="sm"
                  className="hidden sm:flex items-center gap-2"
                  data-testid="button-radio-cta"
                >
                  <Radio className="h-4 w-4" />
                  {isPlaying ? "Live Now" : "Listen Live"}
                </Button>
              </Link>
              <ThemeToggle />
              <Link href="/admin" className="hidden lg:block">
                <Button variant="ghost" size="sm" data-testid="link-admin">
                  Admin
                </Button>
              </Link>

              {/* Mobile Menu Button */}
              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                data-testid="button-mobile-menu"
              >
                {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </Button>
            </div>
          </nav>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 lg:hidden"
          >
            <div
              className="absolute inset-0 bg-background/80 backdrop-blur-lg"
              onClick={() => setIsMobileMenuOpen(false)}
            />
            <motion.nav
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="absolute right-0 top-0 bottom-0 w-72 bg-card border-l border-border p-6 pt-20"
            >
              <div className="flex flex-col gap-2">
                {navLinks.map((link) => (
                  <Link key={link.href} href={link.href}>
                    <Button
                      variant="ghost"
                      className={cn(
                        "w-full justify-start text-lg font-medium",
                        location === link.href && "bg-accent text-accent-foreground"
                      )}
                      data-testid={`link-mobile-${link.label.toLowerCase()}`}
                    >
                      {link.label}
                      {link.label === "Radio" && isLive && (
                        <span className="ml-2 flex h-2 w-2">
                          <span className={cn(
                            "relative inline-flex rounded-full h-2 w-2",
                            isPlaying ? "bg-primary" : "bg-muted-foreground"
                          )} />
                        </span>
                      )}
                    </Button>
                  </Link>
                ))}
                <div className="my-4 border-t border-border" />
                <Link href="/admin">
                  <Button variant="outline" className="w-full" data-testid="link-mobile-admin">
                    Admin Dashboard
                  </Button>
                </Link>
              </div>
            </motion.nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
