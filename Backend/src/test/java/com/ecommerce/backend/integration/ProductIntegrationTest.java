package com.ecommerce.backend.integration;

import com.ecommerce.backend.model.entity.Product;
import com.ecommerce.backend.repository.ProductRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;
import org.springframework.transaction.annotation.Transactional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
@Transactional
class ProductIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private ObjectMapper objectMapper;

    @BeforeEach
    void setUp() {
        productRepository.deleteAll();
    }

    @Test
    @WithMockUser(roles = "ADMIN") // Ajoutez ceci pour les endpoints POST/PUT/DELETE
    void createProduct_ShouldReturnCreatedProduct() throws Exception {
        // Arrange
        Product product = new Product();
        product.setItemName("Test Product");
        product.setInitialPrice(199.99);
        product.setRating(4.5);
        product.setCategories("Electronics");

        // Act & Assert
        MvcResult result = mockMvc.perform(post("/api/v1/products")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(product)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.itemName").value("Test Product"))
                .andExpect(jsonPath("$.initialPrice").value(199.99))
                .andReturn();

        // Verify in database
        assertThat(productRepository.count()).isEqualTo(1);
        Product savedProduct = productRepository.findAll().get(0);
        assertThat(savedProduct.getItemName()).isEqualTo("Test Product");
    }

    @Test
    @WithMockUser(roles = "CLIENT") // Pour les endpoints GET
    void getProductById_ShouldReturnProduct() throws Exception {
        // Arrange
        Product product = new Product();
        product.setItemName("Existing Product");
        product.setInitialPrice(299.99);
        Product savedProduct = productRepository.save(product);

        // Act & Assert
        mockMvc.perform(get("/api/v1/products/" + savedProduct.getId())
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(savedProduct.getId()))
                .andExpect(jsonPath("$.itemName").value("Existing Product"))
                .andExpect(jsonPath("$.initialPrice").value(299.99));
    }

    @Test
    @WithMockUser(roles = "CLIENT")
    void getAllProducts_ShouldReturnProductList() throws Exception {
        // Arrange
        Product product1 = new Product();
        product1.setItemName("Product 1");
        product1.setInitialPrice(100.0);

        Product product2 = new Product();
        product2.setItemName("Product 2");
        product2.setInitialPrice(200.0);

        productRepository.save(product1);
        productRepository.save(product2);

        // Act & Assert
        mockMvc.perform(get("/api/v1/products")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(2))
                .andExpect(jsonPath("$[0].itemName").value("Product 1"))
                .andExpect(jsonPath("$[1].itemName").value("Product 2"));
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    void updateProduct_ShouldUpdateAndReturnProduct() throws Exception {
        // Arrange
        Product originalProduct = new Product();
        originalProduct.setItemName("Original Name");
        originalProduct.setInitialPrice(100.0);
        Product savedProduct = productRepository.save(originalProduct);

        Product updateData = new Product();
        updateData.setItemName("Updated Name");
        updateData.setInitialPrice(150.0);

        // Act & Assert
        mockMvc.perform(put("/api/v1/products/" + savedProduct.getId())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(updateData)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(savedProduct.getId()))
                .andExpect(jsonPath("$.itemName").value("Updated Name"))
                .andExpect(jsonPath("$.initialPrice").value(150.0));

        // Verify update in database
        Product updatedProduct = productRepository.findById(savedProduct.getId()).orElseThrow();
        assertThat(updatedProduct.getItemName()).isEqualTo("Updated Name");
        assertThat(updatedProduct.getInitialPrice()).isEqualTo(150.0);
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    void deleteProduct_ShouldRemoveProduct() throws Exception {
        // Arrange
        Product product = new Product();
        product.setItemName("To Delete");
        product.setInitialPrice(50.0);
        Product savedProduct = productRepository.save(product);

        assertThat(productRepository.count()).isEqualTo(1);

        // Act & Assert
        mockMvc.perform(delete("/api/v1/products/" + savedProduct.getId()))
                .andExpect(status().isOk());

        // Verify deletion
        assertThat(productRepository.count()).isEqualTo(0);
        assertThat(productRepository.findById(savedProduct.getId())).isEmpty();
    }

    @Test
    @WithMockUser(roles = "CLIENT")
    void getNonExistingProduct_ShouldReturnNull() throws Exception {
        // Act & Assert
        mockMvc.perform(get("/api/v1/products/999")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(content().string(""));
    }

    @Test
    void createProduct_WithoutAuthentication_ShouldReturnUnauthorized() throws Exception {
        // Arrange
        Product product = new Product();
        product.setItemName("Unauthorized Product");
        product.setInitialPrice(100.0);

        // Act & Assert
        mockMvc.perform(post("/api/v1/products")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(product)))
                .andExpect(status().isUnauthorized());
    }
}