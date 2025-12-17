package com.ecommerce.backend.service;

import com.ecommerce.backend.model.entity.Product;
import com.ecommerce.backend.repository.ProductRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ProductServiceTest {

    @Mock
    private ProductRepository productRepository;

    @InjectMocks
    private ProductService productService;

    private Product product;

    @BeforeEach
    void setUp() {
        product = new Product();
        product.setId(1L);
        product.setItemName("Laptop");
        product.setRating(4.5);
        product.setInitialPrice(999.99);
        product.setCategories("Electronics");
        product.setTags("gaming,premium");
        product.setMainImage("laptop.jpg");
        product.setSizes("15,17");
        product.setColors("Black,Silver");
    }

    @Test
    void findAll_ShouldReturnAllProducts() {
        // Arrange
        Product product2 = new Product();
        product2.setId(2L);
        product2.setItemName("Mouse");

        List<Product> expectedProducts = Arrays.asList(product, product2);
        when(productRepository.findAll()).thenReturn(expectedProducts);

        // Act
        List<Product> actualProducts = productService.findAll();

        // Assert
        assertEquals(2, actualProducts.size());
        assertEquals("Laptop", actualProducts.get(0).getItemName());
        assertEquals("Mouse", actualProducts.get(1).getItemName());
        verify(productRepository, times(1)).findAll();
    }

    @Test
    void findById_WithExistingId_ShouldReturnProduct() {
        // Arrange
        Long productId = 1L;
        when(productRepository.findById(productId)).thenReturn(Optional.of(product));

        // Act
        Product foundProduct = productService.findById(productId);

        // Assert
        assertNotNull(foundProduct);
        assertEquals(productId, foundProduct.getId());
        assertEquals("Laptop", foundProduct.getItemName());
        verify(productRepository, times(1)).findById(productId);
    }

    @Test
    void findById_WithNonExistingId_ShouldReturnNull() {
        // Arrange
        Long nonExistingId = 999L;
        when(productRepository.findById(nonExistingId)).thenReturn(Optional.empty());

        // Act
        Product foundProduct = productService.findById(nonExistingId);

        // Assert
        assertNull(foundProduct);
        verify(productRepository, times(1)).findById(nonExistingId);
    }

    @Test
    void save_ShouldReturnSavedProduct() {
        // Arrange
        Product newProduct = new Product();
        newProduct.setItemName("New Keyboard");
        newProduct.setInitialPrice(79.99);

        when(productRepository.save(any(Product.class))).thenReturn(product);

        // Act
        Product savedProduct = productService.save(newProduct);

        // Assert
        assertNotNull(savedProduct);
        assertEquals(1L, savedProduct.getId());
        assertEquals("Laptop", savedProduct.getItemName());
        verify(productRepository, times(1)).save(newProduct);
    }

    @Test
    void delete_ShouldCallRepositoryDelete() {
        // Arrange
        Long productId = 1L;
        doNothing().when(productRepository).deleteById(productId);

        // Act
        productService.delete(productId);

        // Assert
        verify(productRepository, times(1)).deleteById(productId);
    }

    @Test
    void save_WithNullProduct_ShouldNotThrowException() {
        // Arrange
        when(productRepository.save(null)).thenThrow(new IllegalArgumentException());

        // Act & Assert
        assertThrows(IllegalArgumentException.class, () -> productService.save(null));
    }
}