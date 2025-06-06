import type { CreateOrderResponse, Order, OrderInput } from "@/types/checkout";

const apiKey = process.env.NEXT_PUBLIC_CROSSMINT_API_KEY ?? "";

if (!apiKey) {
  throw new Error("NEXT_PUBLIC_CROSSMINT_API_KEY is not set");
}

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
        Authorization: `Bearer ${clientSecret}`,
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
        Authorization: `Bearer ${clientSecret}`,
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
