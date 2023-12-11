import Category, { getCategoryList } from "@/lib/categories";
import { Divide } from "lucide-react";
import Link from "next/link";
import React from "react";

const CategorySelectPage = () => {
  const categories = Category;
  return (
    <div>
      <h1 className="text-4xl font-bold">Categories:</h1>
      {Object.entries(Category).map(([key, value]) => {
        return (
          <div key={key}>
            <Link
              href={`/category/${value}`}
              className="text-lg hover:underline"
            >
              {key}
            </Link>
          </div>
        );
      })}
    </div>
  );
};

export default CategorySelectPage;
