package com.example.heating.dto;

public class HeatingCreateDto {
    private String type;   // GAS, ELECTRIC, …
    private Double power;  // kW
    private Long   flatId;

    public HeatingCreateDto() { }

    public String getType()  { return type;  }
    public void   setType(String t) { this.type = t; }

    public Double getPower() { return power; }
    public void   setPower(Double p) { this.power = p; }

    public Long   getFlatId() { return flatId; }
    public void   setFlatId(Long f) { this.flatId = f; }
}
