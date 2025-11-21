package com.ecommerce.backend.model.entity;


import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
@Table(name = "products")
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String itemName;

    @Column(columnDefinition = "TEXT")
    private String tags;

    private String mainImage;

    private Double rating;

    @Column(columnDefinition = "TEXT")
    private String sizes;

    @Column(columnDefinition = "TEXT")
    private String colors;

    @Column(columnDefinition = "TEXT")
    private String otherAttributes;

    @Column(columnDefinition = "TEXT")
    private String customerReviews;

    @Column(columnDefinition = "TEXT")
    private String ingredients;

    private Double initialPrice;

    @Column(columnDefinition = "TEXT")
    private String ingredientsFull;

    @Column(columnDefinition = "TEXT")
    private String categories;
}

