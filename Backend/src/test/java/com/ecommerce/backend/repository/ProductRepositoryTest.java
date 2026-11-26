package com.ecommerce.backend.repository;

import com.ecommerce.backend.model.entity.Product;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.boot.test.autoconfigure.orm.jpa.TestEntityManager;
import org.springframework.test.context.ActiveProfiles;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;

@DataJpaTest
@ActiveProfiles("test")
class ProductRepositoryTest {

    @Autowired
    private TestEntityManager entityManager;

    @Autowired
    private ProductRepository productRepository;

    @Test
    void findAll_ShouldReturnAllProducts() {
        // Arrange
        Product product1 = new Product();
        product1.setItemName("Product 1");
        product1.setInitialPrice(100.0);

        Product product2 = new Product();
        product2.setItemName("Product 2");
        product2.setInitialPrice(200.0);

        entityManager.persist(product1);
        entityManager.persist(product2);
        entityManager.flush();

        // Act
        List<Product> products = productRepository.findAll();

        // Assert
        assertThat(products).hasSize(2);
        assertThat(products).extracting(Product::getItemName)
                .containsExactlyInAnyOrder("Product 1", "Product 2");
    }

    @Test
    void save_ShouldPersistProduct() {
        // Arrange
        Product product = new Product();
        product.setItemName("New Product");
        product.setInitialPrice(99.99);
        product.setRating(4.5);
        product.setCategories("Electronics");

        // Act
        Product savedProduct = productRepository.save(product);

        // Assert
        assertThat(savedProduct.getId()).isNotNull();
        assertThat(savedProduct.getItemName()).isEqualTo("New Product");
        assertThat(savedProduct.getInitialPrice()).isEqualTo(99.99);

        // Verify it's actually saved in the database
        Product found = entityManager.find(Product.class, savedProduct.getId());
        assertThat(found).isNotNull();
        assertThat(found.getItemName()).isEqualTo("New Product");
    }

    @Test
    void delete_ShouldRemoveProduct() {
        // Arrange
        Product product = new Product();
        product.setItemName("To Delete");
        product.setInitialPrice(50.0);
        entityManager.persist(product);
        entityManager.flush();

        Long productId = product.getId();
        assertThat(productRepository.findById(productId)).isPresent();

        // Act
        productRepository.deleteById(productId);
        entityManager.flush();

        // Assert
        assertThat(productRepository.findById(productId)).isEmpty();
    }
}