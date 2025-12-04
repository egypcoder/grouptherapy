import { Link } from "wouter";
import { SiSpotify, SiInstagram, SiX, SiYoutube, SiSoundcloud } from "react-icons/si";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const footerLinks = {
  music: [
    { label: "New Releases", href: "/releases" },
    { label: "Artists", href: "/artists" },
    { label: "Playlists", href: "/playlists" },
    { label: "Radio", href: "/radio" },
  ],
  discover: [
    { label: "Events", href: "/events" },
    { label: "Tours", href: "/tours" },
    { label: "Videos", href: "/videos" },
    { label: "News", href: "/news" },
  ],
  company: [
    { label: "About Us", href: "/about" },
    { label: "Contact", href: "/contact" },
    { label: "Press", href: "/press" },
    { label: "Careers", href: "/careers" },
  ],
  legal: [
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Terms of Service", href: "/terms" },
    { label: "Cookie Policy", href: "/cookies" },
  ],
};

const socialLinks = [
  { icon: SiSpotify, href: "#", label: "Spotify", color: "hover:text-[#1DB954]" },
  { icon: SiInstagram, href: "#", label: "Instagram", color: "hover:text-pink-500" },
  { icon: SiX, href: "#", label: "X", color: "hover:text-foreground" },
  { icon: SiYoutube, href: "#", label: "YouTube", color: "hover:text-red-500" },
  { icon: SiSoundcloud, href: "#", label: "SoundCloud", color: "hover:text-orange-500" },
];

export function Footer() {
  return (
    <footer className="bg-card border-t border-border pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        {/* Main Footer */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8 lg:gap-12">
          {/* Brand & Newsletter */}
          <div className="col-span-2">
            <Link href="/" className="inline-block mb-4" data-testid="link-footer-logo">
              <span className="text-xl font-bold tracking-tight">
                GROUP<span className="text-primary">THERAPY</span>
              </span>
            </Link>
            <p className="text-sm text-muted-foreground mb-6 max-w-sm">
              The sound of tomorrow, today. Join us on the journey through electronic music.
            </p>

            {/* Newsletter */}
            <div className="space-y-2">
              <p className="text-sm font-medium">Subscribe to our newsletter</p>
              <div className="flex gap-2">
                <Input
                  type="email"
                  placeholder="Enter your email"
                  className="max-w-[200px]"
                  data-testid="input-newsletter-email"
                />
                <Button size="sm" data-testid="button-newsletter-submit">
                  Subscribe
                </Button>
              </div>
            </div>

            {/* Social Links */}
            <div className="flex items-center gap-2 mt-6">
              {socialLinks.map((social) => (
                <Button
                  key={social.label}
                  size="icon"
                  variant="ghost"
                  className={social.color}
                  asChild
                  data-testid={`link-social-${social.label.toLowerCase()}`}
                >
                  <a href={social.href} target="_blank" rel="noopener noreferrer" aria-label={social.label}>
                    <social.icon className="h-5 w-5" />
                  </a>
                </Button>
              ))}
            </div>
          </div>

          {/* Music Links */}
          <div>
            <h4 className="font-semibold mb-4 text-sm uppercase tracking-wide">Music</h4>
            <ul className="space-y-2">
              {footerLinks.music.map((link) => (
                <li key={link.href}>
                  <Link href={link.href}>
                    <span className="text-sm text-muted-foreground hover:text-foreground transition-colors cursor-pointer">
                      {link.label}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Discover Links */}
          <div>
            <h4 className="font-semibold mb-4 text-sm uppercase tracking-wide">Discover</h4>
            <ul className="space-y-2">
              {footerLinks.discover.map((link) => (
                <li key={link.href}>
                  <Link href={link.href}>
                    <span className="text-sm text-muted-foreground hover:text-foreground transition-colors cursor-pointer">
                      {link.label}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h4 className="font-semibold mb-4 text-sm uppercase tracking-wide">Company</h4>
            <ul className="space-y-2">
              {footerLinks.company.map((link) => (
                <li key={link.href}>
                  <Link href={link.href}>
                    <span className="text-sm text-muted-foreground hover:text-foreground transition-colors cursor-pointer">
                      {link.label}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal Links */}
          <div>
            <h4 className="font-semibold mb-4 text-sm uppercase tracking-wide">Legal</h4>
            <ul className="space-y-2">
              {footerLinks.legal.map((link) => (
                <li key={link.href}>
                  <Link href={link.href}>
                    <span className="text-sm text-muted-foreground hover:text-foreground transition-colors cursor-pointer">
                      {link.label}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-border mt-12 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} GroupTherapy Records. All rights reserved.
          </p>
          <p className="text-sm text-muted-foreground">
            Made with passion for music
          </p>
        </div>
      </div>
    </footer>
  );
}
