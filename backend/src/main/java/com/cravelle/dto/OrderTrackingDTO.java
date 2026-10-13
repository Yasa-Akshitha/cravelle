package com.cravelle.dto;

import com.cravelle.entity.OrderStatus;
import java.util.ArrayList;
import java.util.List;

public class OrderTrackingDTO {
    private OrderResponseDTO order;
    private OrderStatus currentStatus;
    private Integer currentStepIndex;
    private Integer totalSteps = 6;
    private Integer estimatedDeliveryMinutes;
    private String riderName;
    private String riderPhone;
    private List<DeliveryStepDTO> timeline = new ArrayList<>();
    private Boolean isDemoMode = true;
    private String demoNote = "Simulated delivery status workflow for Cravelle demonstration.";

    public OrderTrackingDTO() {}

    public OrderResponseDTO getOrder() { return order; }
    public void setOrder(OrderResponseDTO order) { this.order = order; }

    public OrderStatus getCurrentStatus() { return currentStatus; }
    public void setCurrentStatus(OrderStatus currentStatus) { this.currentStatus = currentStatus; }

    public Integer getCurrentStepIndex() { return currentStepIndex; }
    public void setCurrentStepIndex(Integer currentStepIndex) { this.currentStepIndex = currentStepIndex; }

    public Integer getTotalSteps() { return totalSteps; }
    public void setTotalSteps(Integer totalSteps) { this.totalSteps = totalSteps; }

    public Integer getEstimatedDeliveryMinutes() { return estimatedDeliveryMinutes; }
    public void setEstimatedDeliveryMinutes(Integer estimatedDeliveryMinutes) { this.estimatedDeliveryMinutes = estimatedDeliveryMinutes; }

    public String getRiderName() { return riderName; }
    public void setRiderName(String riderName) { this.riderName = riderName; }

    public String getRiderPhone() { return riderPhone; }
    public void setRiderPhone(String riderPhone) { this.riderPhone = riderPhone; }

    public List<DeliveryStepDTO> getTimeline() { return timeline; }
    public void setTimeline(List<DeliveryStepDTO> timeline) { this.timeline = timeline; }

    public Boolean getIsDemoMode() { return isDemoMode; }
    public void setIsDemoMode(Boolean demoMode) { isDemoMode = demoMode; }

    public String getDemoNote() { return demoNote; }
    public void setDemoNote(String demoNote) { this.demoNote = demoNote; }
}
