import type { CreateOrderResponse, Order, OrderInput } from "@/types/checkout";
import type { Weapon } from "@/types/weapon";

export const apiKey = process.env.NEXT_PUBLIC_CROSSMINT_API_KEY ?? "";
export const collectionId =
  process.env.NEXT_PUBLIC_CROSSMINT_COLLECTION_ID ?? "";

if (!apiKey) {
  throw new Error("NEXT_PUBLIC_CROSSMINT_API_KEY is not set");
}

if (!collectionId) {
  throw new Error("NEXT_PUBLIC_CROSSMINT_COLLECTION_ID is not set");
}

export const WEAPONS: Weapon[] = [
  {
    id: "gods-sword",
    name: "God's sword",
    price: "0.53",
    icon: "/sword.svg",
  },
  {
    id: "elves-axe-silver",
    name: "Elves axe - Silver",
    price: "0.53",
    icon: "/axe.svg",
  },
  {
    id: "magic-potion",
    name: "Magic potion",
    price: "0.53",
    icon: "/elixir.svg",
  },
];

const crossmintBaseUrl = apiKey.includes("staging")
  ? "https://staging.crossmint.com/api/2022-06-09"
  : "https://www.crossmint.com/api/2022-06-09";

export const createOrder = async (orderInput: OrderInput) => {
  try {
    const response = await fetch(`${crossmintBaseUrl}/orders`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
      },
      body: JSON.stringify(orderInput),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message);
    }

    const order = (await response.json()) as CreateOrderResponse;
    return {
      success: true,
      order,
    };
  } catch (error) {
    console.error(error);

    return {
      success: false,
      error: error,
    };
  }
};

export const updateOrder = async (
  orderId: string,
  clientSecret: string,
  orderInput: Partial<OrderInput>
) => {
  try {
    const response = await fetch(`${crossmintBaseUrl}/orders/${orderId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        Authorization: clientSecret,
      },
      body: JSON.stringify(orderInput),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message);
    }

    const order = (await response.json()) as Order;
    return {
      success: true,
      order,
    };
  } catch (error) {
    console.error(error);

    return {
      success: false,
      error: error,
    };
  }
};

export const getOrder = async (orderId: string, clientSecret: string) => {
  try {
    const response = await fetch(`${crossmintBaseUrl}/orders/${orderId}`, {
      headers: {
        "x-api-key": apiKey,
        Authorization: clientSecret,
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message);
    }

    const order = (await response.json()) as Order;
    return {
      success: true,
      order,
    };
  } catch (error) {
    console.error(error);

    return {
      success: false,
      error: error,
    };
  }
};

// validate emails are always tricky, this is a simple regex that should work for most cases
export const isValidEmail = (email: string) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email);
};
