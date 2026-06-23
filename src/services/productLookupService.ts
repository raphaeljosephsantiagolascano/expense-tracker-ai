export type ProductLookupResult = {
  barcode: string;
  name: string;
  brand?: string;
  image?: string;
};

type OpenFoodFactsProduct = {
  product_name?: string;
  product_name_en?: string;
  brands?: string;
  image_url?: string;
  image_front_url?: string;
};

type OpenFoodFactsResponse = {
  status: number;
  product?: OpenFoodFactsProduct;
};

export async function lookupProductByBarcode(
  barcode: string,
): Promise<ProductLookupResult | null> {
  const response = await fetch(
    `https://world.openfoodfacts.org/api/v0/product/${encodeURIComponent(
      barcode,
    )}.json`,
  );

  if (!response.ok) {
    throw new Error("Product lookup failed.");
  }

  const data = (await response.json()) as OpenFoodFactsResponse;

  if (data.status !== 1 || !data.product) {
    return null;
  }

  const name =
    data.product.product_name ||
    data.product.product_name_en ||
    data.product.brands ||
    "";

  if (!name) {
    return null;
  }

  return {
    barcode,
    name,
    brand: data.product.brands,
    image: data.product.image_front_url || data.product.image_url,
  };
}
