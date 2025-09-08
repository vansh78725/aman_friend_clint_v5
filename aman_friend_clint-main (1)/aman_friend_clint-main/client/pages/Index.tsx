import Hero from "@/components/sections/Hero";
import ProductGrid from "@/components/sections/ProductGrid";
import { ClaimProvider } from "@/hooks/useClaim";

export default function Index() {
  return (
    <ClaimProvider>
      <Hero />
      <ProductGrid />
    </ClaimProvider>
  );
}
