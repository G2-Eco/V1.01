import { Suspense } from "react";
import CartPage from "./CartPage";

export default function Page() {
  return (
    <Suspense fallback={<div>Chargement du panier...</div>}>
      <CartPage />
    </Suspense>
  );
}
