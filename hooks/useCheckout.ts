import { useState, useCallback, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createOrder as apiCreateOrder,
  updateOrder as apiUpdateOrder,
  getOrder as apiGetOrder,
} from "@/lib/checkout";
import type { Order, OrderInput } from "@/types/checkout";

export const useCheckout = () => {
  const [order, setOrder] = useState<Order | null>(null);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [isPolling, setIsPolling] = useState(false);

  const { isLoading: isOrderLoading, refetch: refetchOrder } = useQuery({
    queryKey: ["order", order?.orderId, clientSecret],
    queryFn: async () => {
      if (!order?.orderId || !clientSecret) {
        return null;
      }
      const result = await apiGetOrder(order.orderId, clientSecret);
      if (result.success) {
        return result.order;
      }
      return null;
    },
    enabled: !!order?.orderId && !!clientSecret,
    refetchInterval: isPolling ? 1000 : false, // poll every second when polling is active
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
      if (response?.order && response?.clientSecret) {
        setOrder(response.order);
        setClientSecret(response.clientSecret);
      }
    },
  });

  const { mutate: updateOrder, isPending: isUpdatingOrder } = useMutation({
    mutationFn: async (orderInput: Partial<OrderInput>) => {
      if (!order?.orderId || !clientSecret) {
        return null;
      }
      const result = await apiUpdateOrder(
        order.orderId,
        clientSecret,
        orderInput
      );
      if (result.success) {
        return result.order;
      }
      return null;
    },
    onSuccess: (response) => {
      if (response) {
        setOrder(response);
      }
    },
  });

  const startPollingForPayment = useCallback(() => {
    setIsPolling(true);
  }, []);

  useEffect(() => {
    if (isPolling && order?.payment?.status) {
      if (
        order.payment.status === "succeeded" ||
        order.payment.status === "failed"
      ) {
        setIsPolling(false);
      }
    }
  }, [isPolling, order?.payment?.status]);

  const stopPolling = useCallback(() => {
    setIsPolling(false);
  }, []);

  return {
    order,
    createOrder,
    updateOrder,
    isOrderLoading,
    isCreatingOrder,
    isUpdatingOrder,
    isPolling,
    startPollingForPayment,
    stopPolling,
    refetchOrder,
  };
};
