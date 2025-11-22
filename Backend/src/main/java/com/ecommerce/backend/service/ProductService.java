package com.ecommerce.backend.service;



import com.ecommerce.backend.model.dto.ProductDTO;
import com.ecommerce.backend.model.entity.Product;
import com.ecommerce.backend.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ProductService {

    private final ProductRepository repo;

    private ProductDTO toDTO(Product product) {
        ProductDTO dto = new ProductDTO();
        BeanUtils.copyProperties(product, dto);
        return dto;
    }

    private Product toEntity(ProductDTO dto) {
        Product product = new Product();
        BeanUtils.copyProperties(dto, product);
        return product;
    }

    public ProductDTO create(ProductDTO dto) {
        Product saved = repo.save(toEntity(dto));
        return toDTO(saved);
    }

    public ProductDTO getById(Long id) {
        Product product = repo.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        return toDTO(product);
    }

    public List<ProductDTO> getAll() {
        return repo.findAll().stream()
                .map(this::toDTO)
                .toList();
    }


    public ProductDTO update(Long id, ProductDTO dto) {
        Product existing = repo.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        dto.setId(id);
        BeanUtils.copyProperties(dto, existing);

        Product updated = repo.save(existing);
        return toDTO(updated);
    }

    public void delete(Long id) {
        repo.deleteById(id);
    }
}

