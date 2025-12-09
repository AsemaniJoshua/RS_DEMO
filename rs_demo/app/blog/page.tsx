import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ArrowRight, Calendar, User } from "lucide-react";

const posts = [
  {
    id: 1,
    title: "5 Common Medication Errors and How to Avoid Them",
    excerpt: "Medication errors are more common than you think. Learn the top 5 mistakes patients make and how to stay safe.",
    category: "Drug Safety",
    date: "Dec 12, 2024",
    author: "Dr. George",
    image: "/logo.png",
  },
  {
    id: 2,
    title: "The Truth About Supplements: What You Need to Know",
    excerpt: "Not all supplements are created equal. Discover which ones are actually beneficial and which ones to avoid.",
    category: "Supplements",
    date: "Dec 10, 2024",
    author: "Dr. George",
    image: "/logo.png",
  },
  {
    id: 3,
    title: "Managing Diabetes: Beyond Insulin",
    excerpt: "Lifestyle changes play a crucial role in diabetes management. Explore dietary and exercise tips for better control.",
    category: "Diabetes",
    date: "Dec 05, 2024",
    author: "Dr. George",
    image: "/logo.png",
  },
  {
    id: 4,
    title: "Talking to Your Kids About Drug Abuse",
    excerpt: "Early conversations are key. Here is a guide on how to approach the sensitive topic of drug abuse with your children.",
    category: "Youth Drug Abuse",
    date: "Nov 28, 2024",
    author: "Dr. George",
    image: "/logo.png",
  },
];

export default function BlogPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <section className="bg-muted/30 py-12 md:py-20">
        <div className="container px-4 md:px-6 text-center">
          <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl text-primary mb-4">
            Health Insights
          </h1>
          <p className="max-w-[600px] mx-auto text-muted-foreground md:text-xl">
            Stay informed with the latest articles on drug safety, wellness, and disease management.
          </p>
        </div>
      </section>

      <section className="py-12 md:py-20">
        <div className="container px-4 md:px-6">
          <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <article key={post.id} className="flex flex-col space-y-4 group">
                <div className="aspect-video w-full relative overflow-hidden rounded-lg bg-muted border shadow-sm">
                   <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
                      <Image
                        src={post.image}
                        alt={post.title}
                        fill
                        className="object-cover opacity-20 group-hover:scale-105 transition-transform duration-300"
                      />
                   </div>
                   <div className="absolute top-4 left-4 bg-primary text-primary-foreground px-3 py-1 rounded-full text-xs font-medium">
                     {post.category}
                   </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      <span>{post.date}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <User className="h-3 w-3" />
                      <span>{post.author}</span>
                    </div>
                  </div>
                  <h2 className="text-xl font-bold group-hover:text-primary transition-colors">
                    <Link href={`/blog/${post.id}`}>{post.title}</Link>
                  </h2>
                  <p className="text-muted-foreground line-clamp-3">
                    {post.excerpt}
                  </p>
                  <Link href={`/blog/${post.id}`} className="inline-flex items-center text-sm font-medium text-primary hover:underline">
                    Read Article <ArrowRight className="ml-1 h-4 w-4" />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
