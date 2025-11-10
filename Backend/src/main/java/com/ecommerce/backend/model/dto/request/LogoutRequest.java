package com.ecommerce.backend.model.dto.request;


import jakarta.validation.constraints.NotBlank;
import lombok.Data;

/**
 * @author Taoufiq
 */
@Data
public class LogoutRequest {

    @NotBlank(message = "Refresh token must not be blank")
    private String refreshToken;
}

