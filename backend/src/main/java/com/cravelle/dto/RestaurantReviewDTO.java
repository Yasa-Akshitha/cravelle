package com.cravelle.dto;

import com.cravelle.entity.RestaurantReview;
import java.time.LocalDateTime;

public class RestaurantReviewDTO {
    private Long id;
    private String userName;
    private Integer rating;
    private String comment;
    private LocalDateTime createdAt;

    public RestaurantReviewDTO() {}

    public static RestaurantReviewDTO fromEntity(RestaurantReview review) {
        RestaurantReviewDTO dto = new RestaurantReviewDTO();
        dto.setId(review.getId());
        dto.setUserName(review.getUser() != null ? review.getUser().getName() : "Anonymous Foodie");
        dto.setRating(review.getRating());
        dto.setComment(review.getComment());
        dto.setCreatedAt(review.getCreatedAt());
        return dto;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getUserName() { return userName; }
    public void setUserName(String userName) { this.userName = userName; }

    public Integer getRating() { return rating; }
    public void setRating(Integer rating) { this.rating = rating; }

    public String getComment() { return comment; }
    public void setComment(String comment) { this.comment = comment; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
