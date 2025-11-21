package com.ecommerce.backend.repository;


import com.ecommerce.backend.model.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProductRepository extends JpaRepository<Product, Long> {}
