package com.ecommerce.backend.model.dto.response;


import lombok.*;

/**
 * @author Taoufiq
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
@Getter
public class ApiResponse<T> {

    private boolean success;
    private String message;
    private T data;
}

