package com.example.order_service.dto;

public class OrderResponseDTO {
    private Long orderid;
    private Long productid;
    private int quantity;
    private Double totalprice;

    private String pname;
    private double pprice;

    public OrderResponseDTO() {
    }

    public OrderResponseDTO(Long orderid, Long productid, int quantity, Double totalprice, String pname, double pprice) {
        this.orderid = orderid;
        this.productid = productid;
        this.quantity = quantity;
        this.totalprice = totalprice;
        this.pname = pname;
        this.pprice = pprice;
    }

    public Long getOrderid() {
        return orderid;
    }

    public void setOrderid(Long orderid) {
        this.orderid = orderid;
    }

    public Long getProductid() {
        return productid;
    }

    public void setProductid(Long productid) {
        this.productid = productid;
    }

    public int getQuantity() {
        return quantity;
    }

    public void setQuantity(int quantity) {
        this.quantity = quantity;
    }

    public Double getTotalprice() {
        return totalprice;
    }

    public void setTotalprice(Double totalprice) {
        this.totalprice = totalprice;
    }

    public String getPname() {
        return pname;
    }

    public void setPname(String pname) {
        this.pname = pname;
    }

    public double getPprice() {
        return pprice;
    }

    public void setPprice(double pprice) {
        this.pprice = pprice;
    }
}
