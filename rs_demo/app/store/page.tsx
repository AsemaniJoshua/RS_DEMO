import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Star } from "lucide-react";

const products = [
  {
    id: 1,
    title: "Understanding Drug Safety",
    type: "eBook",
    price: 19.99,
    rating: 4.8,
    image: "/logo.png", // Placeholder
    description: "A comprehensive guide to keeping your family safe from medication errors.",
  },
  {
    id: 2,
    title: "Diabetes Management Masterclass",
    type: "Course",
    price: 49.99,
    rating: 5.0,
    image: "/logo.png", // Placeholder
    description: "Learn how to manage diabetes effectively with diet, exercise, and medication.",
  },
  {
    id: 3,
    title: "Supplement Safety Guide",
    type: "eBook",
    price: 14.99,
    rating: 4.5,
    image: "/logo.png", // Placeholder
    description: "Navigate the world of supplements with confidence and avoid harmful interactions.",
  },
  {
    id: 4,
    title: "Youth & Drug Abuse Prevention",
    type: "Webinar",
    price: 29.99,
    rating: 4.9,
    image: "/logo.png", // Placeholder
    description: "Essential knowledge for parents and educators to prevent drug abuse in youth.",
  },
];

export default function StorePage() {
  return (
    <div className="flex flex-col min-h-screen">
      <section className="bg-muted/30 py-12 md:py-20">
        <div className="container px-4 md:px-6 text-center">
          <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl text-primary mb-4">
            Digital Store
          </h1>
          <p className="max-w-[600px] mx-auto text-muted-foreground md:text-xl">
            Expert resources to help you live a healthier life. eBooks, courses, and guides curated by Dr. George.
          </p>
        </div>
      </section>

      <section className="py-12 md:py-20">
        <div className="container px-4 md:px-6">
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {products.map((product) => (
              <div key={product.id} className="group relative flex flex-col overflow-hidden rounded-lg border bg-background shadow-sm transition-all hover:shadow-md">
                <div className="aspect-square w-full bg-muted relative overflow-hidden">
                   <div className="absolute inset-0 flex items-center justify-center text-muted-foreground bg-muted/50">
                      <Image
                        src={product.image}
                        alt={product.title}
                        fill
                        className="object-cover opacity-20 group-hover:scale-105 transition-transform duration-300"
                      />
                   </div>
                   <div className="absolute top-2 right-2 bg-background/90 backdrop-blur px-2 py-1 rounded text-xs font-semibold">
                     {product.type}
                   </div>
                </div>
                <div className="flex flex-col flex-1 p-4 space-y-2">
                  <div className="flex items-center justify-between">
                     <h3 className="font-bold line-clamp-1 group-hover:text-primary transition-colors">{product.title}</h3>
                  </div>
                  <div className="flex items-center gap-1 text-yellow-500 text-xs">
                    <Star className="h-3 w-3 fill-current" />
                    <span>{product.rating}</span>
                  </div>
                  <p className="text-sm text-muted-foreground line-clamp-2 flex-1">
                    {product.description}
                  </p>
                  <div className="flex items-center justify-between pt-4 mt-auto">
                    <span className="text-lg font-bold text-primary">${product.price}</span>
                    <Button size="sm">
                      <ShoppingCart className="mr-2 h-4 w-4" /> Buy Now
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
