import { Suspense } from "react";
import CartPage from "./CartPage";

export const dynamic = 'force-dynamic';

export default function Page() {
  return (
    <Suspense fallback={<div>Chargement du panier...</div>}>
      <CartPage />
    </Suspense>
  );
}
