import { motion } from "framer-motion";
import { Download, FileText, Image, Archive } from "lucide-react";
import { PageHero } from "@/components/hero-section";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { PressAsset } from "@shared/schema";

const pressKitItems = [
  {
    title: "GroupTherapy Logo Pack",
    description: "All logo variations in PNG, SVG, and EPS formats",
    category: "logos",
    fileType: "ZIP",
    fileSize: "2.4 MB",
    icon: Image,
  },
  {
    title: "Brand Guidelines",
    description: "Complete brand guidelines and usage instructions",
    category: "guidelines",
    fileType: "PDF",
    fileSize: "5.1 MB",
    icon: FileText,
  },
  {
    title: "Press Photos - 2024",
    description: "High-resolution promotional photos",
    category: "photos",
    fileType: "ZIP",
    fileSize: "45 MB",
    icon: Image,
  },
  {
    title: "Artist One-Sheets",
    description: "Individual artist press materials",
    category: "artists",
    fileType: "PDF",
    fileSize: "12 MB",
    icon: Archive,
  },
];

const pressReleases = [
  {
    title: "GroupTherapy Announces Summer Festival 2024",
    date: "March 1, 2024",
    excerpt: "GroupTherapy Records is thrilled to announce the return of our flagship summer festival...",
  },
  {
    title: "Luna Wave Signs to GroupTherapy Records",
    date: "February 15, 2024",
    excerpt: "We're excited to welcome Luna Wave to the GroupTherapy family...",
  },
  {
    title: "GroupTherapy Radio Celebrates 1 Million Listeners",
    date: "January 20, 2024",
    excerpt: "Our 24/7 radio station has reached a major milestone...",
  },
];

export default function PressPage() {
  return (
    <div className="min-h-screen">
      <PageHero
        title="Press"
        subtitle="Media resources, press releases, and brand assets"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Tabs defaultValue="kit" className="space-y-8">
          <TabsList>
            <TabsTrigger value="kit" data-testid="tab-press-kit">Press Kit</TabsTrigger>
            <TabsTrigger value="releases" data-testid="tab-press-releases">Press Releases</TabsTrigger>
            <TabsTrigger value="contact" data-testid="tab-press-contact">Media Contact</TabsTrigger>
          </TabsList>

          {/* Press Kit */}
          <TabsContent value="kit" className="space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Card className="bg-primary/5 border-primary/20">
                <CardContent className="p-6">
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                    <div>
                      <h2 className="text-xl font-bold mb-2">Complete Press Kit</h2>
                      <p className="text-muted-foreground">
                        Download everything you need in one package: logos, photos, brand guidelines, and artist materials.
                      </p>
                    </div>
                    <Button size="lg" className="gap-2" data-testid="button-download-all">
                      <Download className="h-5 w-5" />
                      Download All (65 MB)
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <div className="grid md:grid-cols-2 gap-6">
              {pressKitItems.map((item, index) => (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="hover:bg-muted/30 transition-colors" data-testid={`card-press-${item.category}`}>
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-md bg-primary/10 flex items-center justify-center flex-shrink-0">
                          <item.icon className="h-6 w-6 text-primary" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold mb-1">{item.title}</h3>
                          <p className="text-sm text-muted-foreground mb-3">
                            {item.description}
                          </p>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <Badge variant="outline">{item.fileType}</Badge>
                              <span className="text-sm text-muted-foreground">
                                {item.fileSize}
                              </span>
                            </div>
                            <Button variant="ghost" size="sm" className="gap-2">
                              <Download className="h-4 w-4" />
                              Download
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </TabsContent>

          {/* Press Releases */}
          <TabsContent value="releases" className="space-y-6">
            {pressReleases.map((release, index) => (
              <motion.div
                key={release.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="hover:bg-muted/30 transition-colors cursor-pointer" data-testid={`card-release-${index}`}>
                  <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                      <div className="flex-1">
                        <p className="text-sm text-muted-foreground mb-1">
                          {release.date}
                        </p>
                        <h3 className="text-lg font-semibold mb-2">{release.title}</h3>
                        <p className="text-muted-foreground">{release.excerpt}</p>
                      </div>
                      <Button variant="outline" size="sm" className="flex-shrink-0">
                        Read More
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </TabsContent>

          {/* Media Contact */}
          <TabsContent value="contact">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle>Media Contact</CardTitle>
                  <CardDescription>
                    For press inquiries, interview requests, and media accreditation
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="font-semibold mb-2">Press Relations</h3>
                      <p className="text-muted-foreground mb-1">Emma Wilson</p>
                      <p className="text-sm text-muted-foreground mb-1">
                        Head of Communications
                      </p>
                      <a
                        href="mailto:press@grouptherapy.com"
                        className="text-primary hover:underline"
                      >
                        press@grouptherapy.com
                      </a>
                    </div>
                    <div>
                      <h3 className="font-semibold mb-2">General Inquiries</h3>
                      <p className="text-muted-foreground mb-1">GroupTherapy Records</p>
                      <p className="text-sm text-muted-foreground mb-1">
                        London, United Kingdom
                      </p>
                      <a
                        href="mailto:hello@grouptherapy.com"
                        className="text-primary hover:underline"
                      >
                        hello@grouptherapy.com
                      </a>
                    </div>
                  </div>

                  <div className="border-t pt-6">
                    <h3 className="font-semibold mb-4">Response Times</h3>
                    <ul className="space-y-2 text-muted-foreground">
                      <li>
                        Interview requests: 2-3 business days
                      </li>
                      <li>
                        Media accreditation: 5-7 business days before event
                      </li>
                      <li>
                        General press inquiries: 1-2 business days
                      </li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
