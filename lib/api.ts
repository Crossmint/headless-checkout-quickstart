import type { CreateOrderResponse, Order } from "@/types/api";

export const apiKey = process.env.NEXT_PUBLIC_CROSSMINT_API_KEY ?? "";
export const collectionId =
  process.env.NEXT_PUBLIC_CROSSMINT_COLLECTION_ID ?? "";

if (!apiKey) {
  throw new Error("NEXT_PUBLIC_CROSSMINT_API_KEY is not set");
}

if (!collectionId) {
  throw new Error("NEXT_PUBLIC_CROSSMINT_COLLECTION_ID is not set");
}

const crossmintBaseUrl = apiKey.includes("staging")
  ? "https://staging.crossmint.com/api/2022-06-09"
  : "https://www.crossmint.com/api/2022-06-09";

export const createOrder = async (orderInput: Partial<Order>) => {
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
  orderInput: Partial<Order>
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

export const pollOrder = async (orderId: string, clientSecret: string) => {
  try {
    let order = await getOrder(orderId, clientSecret);

    while (true) {
      if (!order.success || !order.order) {
        break;
      }

      const isCompleted =
        order.order.payment.status === "completed" &&
        order.order.phase === "completed";

      const isFailed = order.order.payment.status === "failed";

      if (isCompleted || isFailed) {
        break;
      }

      await new Promise((resolve) => setTimeout(resolve, 1000));

      order = await getOrder(orderId, clientSecret);
    }

    return {
      success: order.success,
      order: order.order,
      error: order.error,
    };
  } catch (error) {
    console.error(error);

    return {
      success: false,
      error: error,
    };
  }
};
