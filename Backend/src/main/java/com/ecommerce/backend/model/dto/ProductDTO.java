package com.ecommerce.backend.model.dto;



import lombok.Data;

@Data
public class ProductDTO {

    private Long id;
    private String itemName;
    private String tags;
    private String mainImage;
    private Double rating;
    private String sizes;
    private String colors;
    private String otherAttributes;
    private String customerReviews;
    private String ingredients;
    private Double initialPrice;
    private String ingredientsFull;
    private String categories;
}

