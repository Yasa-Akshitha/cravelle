package com.cravelle.delivery;

import com.cravelle.dto.DeliveryStepDTO;
import com.cravelle.dto.OrderResponseDTO;
import com.cravelle.dto.OrderTrackingDTO;
import com.cravelle.entity.DeliveryStatusHistory;
import com.cravelle.entity.Order;
import com.cravelle.entity.OrderStatus;
import com.cravelle.exception.ResourceNotFoundException;
import com.cravelle.repository.DeliveryStatusHistoryRepository;
import com.cravelle.repository.OrderRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.*;

@Service
@Transactional
public class DeliveryTrackingService {

    private final OrderRepository orderRepository;
    private final DeliveryStatusHistoryRepository historyRepository;

    private static final List<OrderStatus> WORKFLOW_STEPS = List.of(
            OrderStatus.ORDER_PLACED,
            OrderStatus.RESTAURANT_CONFIRMED,
            OrderStatus.BEING_PREPARED,
            OrderStatus.READY_FOR_PICKUP,
            OrderStatus.OUT_FOR_DELIVERY,
            OrderStatus.DELIVERED
    );

    public DeliveryTrackingService(OrderRepository orderRepository, DeliveryStatusHistoryRepository historyRepository) {
        this.orderRepository = orderRepository;
        this.historyRepository = historyRepository;
    }

    @Transactional(readOnly = true)
    public OrderTrackingDTO getTrackingInfo(Long orderId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found with ID: " + orderId));

        List<DeliveryStatusHistory> histories = historyRepository.findByOrderIdOrderByTimestampAsc(orderId);
        Map<OrderStatus, DeliveryStatusHistory> historyMap = new HashMap<>();
        for (DeliveryStatusHistory h : histories) {
            historyMap.put(h.getStatus(), h);
        }

        int currentStepIndex = WORKFLOW_STEPS.indexOf(order.getStatus());
        if (currentStepIndex < 0 && order.getStatus() == OrderStatus.CANCELLED) {
            currentStepIndex = -1;
        }

        List<DeliveryStepDTO> timeline = new ArrayList<>();
        for (int i = 0; i < WORKFLOW_STEPS.size(); i++) {
            OrderStatus stepStatus = WORKFLOW_STEPS.get(i);
            DeliveryStatusHistory recorded = historyMap.get(stepStatus);

            boolean isCompleted = (currentStepIndex >= i && currentStepIndex != -1);
            boolean isCurrent = (currentStepIndex == i);

            String label = getStepLabel(stepStatus);
            String description = getStepDescription(stepStatus);
            String note = recorded != null ? recorded.getNote() : null;
            LocalDateTime timestamp = recorded != null ? recorded.getTimestamp() : null;

            timeline.add(new DeliveryStepDTO(stepStatus, label, description, note, timestamp, isCompleted, isCurrent));
        }

        int estimatedMins = Math.max(0, 30 - (currentStepIndex * 6));
        if (order.getStatus() == OrderStatus.DELIVERED) {
            estimatedMins = 0;
        }

        OrderTrackingDTO dto = new OrderTrackingDTO();
        dto.setOrder(OrderResponseDTO.fromEntity(order));
        dto.setCurrentStatus(order.getStatus());
        dto.setCurrentStepIndex(currentStepIndex);
        dto.setTotalSteps(WORKFLOW_STEPS.size());
        dto.setEstimatedDeliveryMinutes(estimatedMins);
        dto.setRiderName(order.getRiderName());
        dto.setRiderPhone(order.getRiderPhone());
        dto.setTimeline(timeline);
        dto.setIsDemoMode(true);
        dto.setDemoNote("Simulated real-time delivery workflow for Cravelle platform demonstration.");

        return dto;
    }

    public OrderTrackingDTO simulateNextStatus(Long orderId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found with ID: " + orderId));

        int currentIndex = WORKFLOW_STEPS.indexOf(order.getStatus());
        if (currentIndex < 0) {
            currentIndex = 0;
        }

        int nextIndex = Math.min(currentIndex + 1, WORKFLOW_STEPS.size() - 1);
        OrderStatus nextStatus = WORKFLOW_STEPS.get(nextIndex);

        order.setStatus(nextStatus);
        order.setUpdatedAt(LocalDateTime.now());
        orderRepository.save(order);

        String note = "Advanced via Cravelle Demo Delivery Simulator to " + nextStatus.name();
        DeliveryStatusHistory history = new DeliveryStatusHistory(order, nextStatus, note);
        historyRepository.save(history);

        return getTrackingInfo(orderId);
    }

    public OrderTrackingDTO updateStatus(Long orderId, OrderStatus status, String note) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found with ID: " + orderId));

        order.setStatus(status);
        order.setUpdatedAt(LocalDateTime.now());
        orderRepository.save(order);

        DeliveryStatusHistory history = new DeliveryStatusHistory(order, status, note != null ? note : "Status updated to " + status.name());
        historyRepository.save(history);

        return getTrackingInfo(orderId);
    }

    private String getStepLabel(OrderStatus status) {
        switch (status) {
            case ORDER_PLACED: return "Order Placed";
            case RESTAURANT_CONFIRMED: return "Restaurant Confirmed";
            case BEING_PREPARED: return "Food Being Prepared";
            case READY_FOR_PICKUP: return "Ready for Pickup";
            case OUT_FOR_DELIVERY: return "Out for Delivery";
            case DELIVERED: return "Delivered";
            default: return status.name();
        }
    }

    private String getStepDescription(OrderStatus status) {
        switch (status) {
            case ORDER_PLACED: return "We have received your order details and notified the restaurant.";
            case RESTAURANT_CONFIRMED: return "Restaurant accepted your order ticket and queued it in the kitchen.";
            case BEING_PREPARED: return "Fresh ingredients are being prepared by the head chef.";
            case READY_FOR_PICKUP: return "Food is boxed and sealed with quality inspection check.";
            case OUT_FOR_DELIVERY: return "Delivery partner is on their way with thermal insulation bag.";
            case DELIVERED: return "Delivered to your doorstep. Have a wonderful meal!";
            default: return "";
        }
    }
}
