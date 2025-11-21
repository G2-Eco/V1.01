package com.ecommerce.backend.service;


import com.ecommerce.backend.model.entity.Product;
import com.ecommerce.backend.repository.ProductRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ProductService {

    private final ProductRepository repo;

    public ProductService(ProductRepository repo) {
        this.repo = repo;
    }

    public List<Product> findAll() { return repo.findAll(); }

    public Product findById(Long id) { return repo.findById(id).orElse(null); }

    public Product save(Product product) { return repo.save(product); }

    public void delete(Long id) { repo.deleteById(id); }
}
