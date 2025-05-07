
  // Fetch categories for filtering

import { useQuery } from "@tanstack/react-query";
import * as api from "./category.api"

export const categoriesQueryKeys = {
  allCategories:["categories"] as const
}

  export const useCategoriesQuery = ()=> useQuery({
    queryKey: categoriesQueryKeys.allCategories,
    queryFn: () => api.getCategories
  });

