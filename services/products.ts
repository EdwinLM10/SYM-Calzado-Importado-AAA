import { collection, addDoc, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import type { Product } from "../types";

const COLLECTION_NAME = "products";

export async function saveProduct(product: Omit<Product, "id">) {
  await addDoc(collection(db, "products"), product);
}

export async function getProducts(): Promise<Product[]> {
  const snapshot = await getDocs(collection(db, "products"));
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...(doc.data() as Omit<Product, "id">),
  }));
}

