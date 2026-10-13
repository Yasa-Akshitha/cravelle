package com.cravelle.dto;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

public class DashboardStatsDTO {

    private long totalRestaurants;
    private long totalDishes;
    private long totalUsers;
    private long totalOrders;
    private BigDecimal totalRevenue = BigDecimal.ZERO;
    private long pendingOrders;
    private long activeSubscribers;
    private List<OrderResponseDTO> recentOrders = new ArrayList<>();

    public DashboardStatsDTO() {}

    public long getTotalRestaurants() { return totalRestaurants; }
    public void setTotalRestaurants(long totalRestaurants) { this.totalRestaurants = totalRestaurants; }

    public long getTotalDishes() { return totalDishes; }
    public void setTotalDishes(long totalDishes) { this.totalDishes = totalDishes; }

    public long getTotalUsers() { return totalUsers; }
    public void setTotalUsers(long totalUsers) { this.totalUsers = totalUsers; }

    public long getTotalOrders() { return totalOrders; }
    public void setTotalOrders(long totalOrders) { this.totalOrders = totalOrders; }

    public BigDecimal getTotalRevenue() { return totalRevenue; }
    public void setTotalRevenue(BigDecimal totalRevenue) { this.totalRevenue = totalRevenue; }

    public long getPendingOrders() { return pendingOrders; }
    public void setPendingOrders(long pendingOrders) { this.pendingOrders = pendingOrders; }

    public long getActiveSubscribers() { return activeSubscribers; }
    public void setActiveSubscribers(long activeSubscribers) { this.activeSubscribers = activeSubscribers; }

    public List<OrderResponseDTO> getRecentOrders() { return recentOrders; }
    public void setRecentOrders(List<OrderResponseDTO> recentOrders) { this.recentOrders = recentOrders; }
}
