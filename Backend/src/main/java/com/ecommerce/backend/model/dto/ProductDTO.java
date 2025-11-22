package com.ecommerce.backend.model.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import jakarta.validation.constraints.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProductDTO {

    private Long id;

    @NotBlank(message = "Le nom du produit est obligatoire")
    @Size(min = 2, max = 200, message = "Le nom doit contenir entre 2 et 200 caractères")
    private String itemName;

    private String tags;

    private String mainImage;

    @Min(value = 0, message = "La note doit être supérieure ou égale à 0")
    @Max(value = 5, message = "La note doit être inférieure ou égale à 5")
    private Double rating;

    private String sizes;

    private String colors;

    private String otherAttributes;

    private String customerReviews;

    private String ingredients;

    @NotNull(message = "Le prix est obligatoire")
    @DecimalMin(value = "0.0", inclusive = false, message = "Le prix doit être supérieur à 0")
    private Double initialPrice;

    private String ingredientsFull;

    private String categories;
}