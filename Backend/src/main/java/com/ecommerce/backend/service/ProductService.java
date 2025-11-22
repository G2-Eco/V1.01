package com.ecommerce.backend.service;

import com.ecommerce.backend.exception.ResourceNotFoundException;
import com.ecommerce.backend.model.dto.ProductDTO;
import com.ecommerce.backend.model.entity.Product;
import com.ecommerce.backend.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
@Slf4j
public class ProductService {

    private final ProductRepository repo;

    // Méthode de conversion Entity -> DTO
    private ProductDTO toDTO(Product product) {
        if (product == null) {
            return null;
        }
        ProductDTO dto = new ProductDTO();
        BeanUtils.copyProperties(product, dto);
        return dto;
    }

    // Méthode de conversion DTO -> Entity
    private Product toEntity(ProductDTO dto) {
        if (dto == null) {
            return null;
        }
        Product product = new Product();
        BeanUtils.copyProperties(dto, product);
        return product;
    }

    // CREATE - Créer un nouveau produit
    public ProductDTO create(ProductDTO dto) {
        log.info("Création d'un nouveau produit: {}", dto.getItemName());
        dto.setId(null); // S'assurer que l'ID est null pour une création
        Product product = toEntity(dto);
        Product saved = repo.save(product);
        log.info("Produit créé avec succès, ID: {}", saved.getId());
        return toDTO(saved);
    }

    // READ - Obtenir un produit par ID
    @Transactional(readOnly = true)
    public ProductDTO getById(Long id) {
        log.info("Recherche du produit avec ID: {}", id);
        Product product = repo.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Produit non trouvé avec l'ID: " + id
                ));
        return toDTO(product);
    }

    // READ - Obtenir tous les produits
    @Transactional(readOnly = true)
    public List<ProductDTO> getAll() {
        log.info("Récupération de tous les produits");
        List<Product> products = repo.findAll();
        log.info("Nombre de produits trouvés: {}", products.size());
        return products.stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    // UPDATE - Mettre à jour un produit
    public ProductDTO update(Long id, ProductDTO dto) {
        log.info("Mise à jour du produit avec ID: {}", id);
        Product existing = repo.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Produit non trouvé avec l'ID: " + id
                ));

        // Copier les propriétés en ignorant l'ID
        BeanUtils.copyProperties(dto, existing, "id");

        Product updated = repo.save(existing);
        log.info("Produit mis à jour avec succès");
        return toDTO(updated);
    }

    // DELETE - Supprimer un produit
    public void delete(Long id) {
        log.info("Suppression du produit avec ID: {}", id);
        if (!repo.existsById(id)) {
            throw new ResourceNotFoundException(
                    "Produit non trouvé avec l'ID: " + id
            );
        }
        repo.deleteById(id);
        log.info("Produit supprimé avec succès");
    }

    // SEARCH - Recherche par nom
    @Transactional(readOnly = true)
    public List<ProductDTO> searchByName(String name) {
        log.info("Recherche de produits par nom: {}", name);
        List<Product> products = repo.findByItemNameContainingIgnoreCase(name);
        log.info("Nombre de produits trouvés avec le nom '{}': {}", name, products.size());
        return products.stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    // SEARCH - Recherche par tag
    @Transactional(readOnly = true)
    public List<ProductDTO> searchByTag(String tag) {
        log.info("Recherche de produits par tag: {}", tag);
        List<Product> products = repo.findByTagIgnoreCase(tag);
        log.info("Nombre de produits trouvés avec le tag '{}': {}", tag, products.size());
        return products.stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    // SEARCH - Recherche par catégorie
    @Transactional(readOnly = true)
    public List<ProductDTO> searchByCategory(String category) {
        log.info("Recherche de produits par catégorie: {}", category);
        List<Product> products = repo.findByCategory(category);
        log.info("Nombre de produits trouvés dans la catégorie '{}': {}", category, products.size());
        return products.stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    // SEARCH - Recherche par fourchette de prix
    @Transactional(readOnly = true)
    public List<ProductDTO> searchByPriceRange(Double minPrice, Double maxPrice) {
        log.info("Recherche de produits entre {} et {} €", minPrice, maxPrice);
        List<Product> products = repo.findByInitialPriceBetween(minPrice, maxPrice);
        log.info("Nombre de produits trouvés: {}", products.size());
        return products.stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    // SEARCH - Recherche par note minimale
    @Transactional(readOnly = true)
    public List<ProductDTO> searchByMinRating(Double rating) {
        log.info("Recherche de produits avec note >= {}", rating);
        List<Product> products = repo.findByRatingGreaterThanEqual(rating);
        log.info("Nombre de produits trouvés: {}", products.size());
        return products.stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    // CHECK - Vérifier si un produit existe par nom
    @Transactional(readOnly = true)
    public boolean existsByName(String itemName) {
        log.info("Vérification de l'existence du produit: {}", itemName);
        return repo.existsByItemName(itemName);
    }
}