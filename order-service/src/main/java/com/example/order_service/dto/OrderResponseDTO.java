package com.example.order_service.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class OrderResponseDTO {
    private Long orderid;
    private Long productid;
    private int quantity;
    private Double totalprice;

    private String pname;
    private double pprice;
}
