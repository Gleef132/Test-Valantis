'use server'

import { getBrands } from "./actions/getBrands";
import HomePage from "@/components/screens/Home/Home";

import cl from "./page.module.scss";

export default async function Home() {

  const brands = await getBrands();

  return (
    <main className={cl.main}>
      <HomePage brands={brands} />
    </main>
  );
}