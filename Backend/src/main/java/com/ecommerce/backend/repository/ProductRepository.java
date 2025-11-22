package com.ecommerce.backend.repository;

import com.ecommerce.backend.model.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {

    // Recherche par nom (insensible à la casse)
    List<Product> findByItemNameContainingIgnoreCase(String itemName);

    // Recherche par catégorie
    @Query("SELECT p FROM Product p WHERE p.categories LIKE %:category%")
    List<Product> findByCategory(@Param("category") String category);

    // Recherche par fourchette de prix
    List<Product> findByInitialPriceBetween(Double minPrice, Double maxPrice);

    // Recherche par note minimale
    List<Product> findByRatingGreaterThanEqual(Double rating);

    // Vérifier si un produit existe par nom
    boolean existsByItemName(String itemName);

    // Recherche par tags
    @Query("SELECT p FROM Product p WHERE p.tags LIKE %:tag%")
    List<Product> findByTag(@Param("tag") String tag);

    // Recherche par tags (insensible à la casse)
    @Query("SELECT p FROM Product p WHERE LOWER(p.tags) LIKE LOWER(CONCAT('%', :tag, '%'))")
    List<Product> findByTagIgnoreCase(@Param("tag") String tag);
}