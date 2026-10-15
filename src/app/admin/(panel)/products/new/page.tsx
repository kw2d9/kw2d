import { requireAdmin } from "@/lib/admin";
import ProductForm from "../ProductForm";

export default async function NewProductPage() {
  await requireAdmin();
  return (
    <>
      <h1 className="mb-6 text-2xl font-bold">New product</h1>
      <ProductForm />
    </>
  );
}
