package com.example.order_service.controller;

import com.example.order_service.dto.OrderResponseDTO;
import com.example.order_service.dto.ProductDTO;
import com.example.order_service.entity.Order;
import com.example.order_service.repository.OrderRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

import java.util.List;

@RestController
@RequestMapping("/orders")
public class OrderController {
    @Autowired
    private OrderRepo orderRepo;
    @Autowired
    private WebClient.Builder webClientBuilder;

    // create a place order meth
    @PostMapping("/placeorder")
    public Mono<ResponseEntity<OrderResponseDTO>> placeOrder(@RequestBody Order order){

        //fetch prod details from prod service
        return webClientBuilder.build().get().uri("http://localhost:8081/products/{id}", order.getProductid()).retrieve().bodyToMono(ProductDTO.class).map(ProductDTO ->{
            OrderResponseDTO responseDTO=new OrderResponseDTO();

            responseDTO.setProductid(order.getProductid());
            responseDTO.setQuantity(order.getQuantity());
            responseDTO.setPname(ProductDTO.getName());
            responseDTO.setPprice(ProductDTO.getPrice());
            responseDTO.setTotalprice(order.getQuantity()*ProductDTO.getPrice());
            //save order
            orderRepo.save(order);
            responseDTO.setOrderid(order.getId());
            return ResponseEntity.ok(responseDTO);
        });

    }
    @GetMapping
    public List<Order> getallorders(){
        return orderRepo.findAll();
    }
}
