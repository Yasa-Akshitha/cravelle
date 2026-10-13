package com.cravelle.dto;

import com.cravelle.entity.DeliveryStatusHistory;
import com.cravelle.entity.OrderStatus;
import java.time.LocalDateTime;

public class DeliveryStepDTO {
    private OrderStatus status;
    private String label;
    private String description;
    private String note;
    private LocalDateTime timestamp;
    private Boolean isCompleted;
    private Boolean isCurrent;

    public DeliveryStepDTO() {}

    public DeliveryStepDTO(OrderStatus status, String label, String description, String note, LocalDateTime timestamp, Boolean isCompleted, Boolean isCurrent) {
        this.status = status;
        this.label = label;
        this.description = description;
        this.note = note;
        this.timestamp = timestamp;
        this.isCompleted = isCompleted;
        this.isCurrent = isCurrent;
    }

    public OrderStatus getStatus() { return status; }
    public void setStatus(OrderStatus status) { this.status = status; }

    public String getLabel() { return label; }
    public void setLabel(String label) { this.label = label; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getNote() { return note; }
    public void setNote(String note) { this.note = note; }

    public LocalDateTime getTimestamp() { return timestamp; }
    public void setTimestamp(LocalDateTime timestamp) { this.timestamp = timestamp; }

    public Boolean getIsCompleted() { return isCompleted; }
    public void setIsCompleted(Boolean completed) { isCompleted = completed; }

    public Boolean getIsCurrent() { return isCurrent; }
    public void setIsCurrent(Boolean current) { isCurrent = current; }
}
