package com.ecommerce.backend.model.dto.request;

import lombok.Data;

@Data
public class AdminUpdateUserRequest {
    private String email;
    private String firstName;
    private String lastName;
    private String password; // plain text from frontend, will be encoded
    private String role;
    private Boolean enabled;
    private Boolean locked;
}
