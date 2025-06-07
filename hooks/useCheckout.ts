import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createOrder as apiCreateOrder,
  updateOrder as apiUpdateOrder,
  getOrder as apiGetOrder,
} from "@/lib/checkout";
import type { OrderInput } from "@/types/checkout";

export const useCheckout = () => {
  const [orderId, setOrderId] = useState<string | null>(null);
  const [clientSecret, setClientSecret] = useState<string | null>(null);

  const { data: order, isLoading: isOrderLoading } = useQuery({
    queryKey: ["order", orderId, clientSecret],
    queryFn: async () => {
      if (!orderId || !clientSecret) {
        return null;
      }
      const result = await apiGetOrder(orderId, clientSecret);
      if (result.success) {
        return result.order;
      }
      return null;
    },
    enabled: !!orderId && !!clientSecret,
  });

  const { mutate: createOrder, isPending: isCreatingOrder } = useMutation({
    mutationFn: async (orderInput: OrderInput) => {
      const result = await apiCreateOrder(orderInput);
      if (result.success && result.order) {
        return result.order;
      }
      return null;
    },
    onSuccess: (response) => {
      if (response?.order?.orderId && response?.clientSecret) {
        setOrderId(response.order.orderId);
        setClientSecret(response.clientSecret);
      }
    },
  });

  const { mutate: updateOrder, isPending: isUpdatingOrder } = useMutation({
    mutationFn: async (orderInput: Partial<OrderInput>) => {
      if (!orderId || !clientSecret) {
        return null;
      }
      const result = await apiUpdateOrder(orderId, clientSecret, orderInput);
      if (result.success) {
        return result.order;
      }
      return null;
    },
  });

  return {
    order,
    createOrder,
    updateOrder,
    isOrderLoading,
    isCreatingOrder,
    isUpdatingOrder,
  };
};
