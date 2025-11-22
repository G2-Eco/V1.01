package com.ecommerce.backend.controller;

import com.ecommerce.backend.model.dto.ProductDTO;
import com.ecommerce.backend.service.ProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/api/products")
@RequiredArgsConstructor
@CrossOrigin(origins = "*") // À configurer selon vos besoins
public class ProductController {

    private final ProductService service;

    @PostMapping
    public ResponseEntity<ProductDTO> create(@Valid @RequestBody ProductDTO dto) {
        ProductDTO created = service.create(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProductDTO> getById(@PathVariable Long id) {
        ProductDTO product = service.getById(id);
        return ResponseEntity.ok(product);
    }

    @GetMapping
    public ResponseEntity<List<ProductDTO>> getAll() {
        List<ProductDTO> products = service.getAll();
        return ResponseEntity.ok(products);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ProductDTO> update(
            @PathVariable Long id,
            @Valid @RequestBody ProductDTO dto
    ) {
        ProductDTO updated = service.update(id, dto);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }

    // Recherche par nom (optionnel)
    @GetMapping("/search")
    public ResponseEntity<List<ProductDTO>> searchByName(@RequestParam String name) {
        List<ProductDTO> products = service.searchByName(name);
        return ResponseEntity.ok(products);
    }

    // Recherche par tag
    @GetMapping("/search/tag")
    public ResponseEntity<List<ProductDTO>> searchByTag(@RequestParam String tag) {
        List<ProductDTO> products = service.searchByTag(tag);
        return ResponseEntity.ok(products);
    }
}