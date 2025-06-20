package com.example.flat.dto;

public class HeatingSourceDto {

    private Long   id;
    private String type;
    private Double power;
    private Long   flatId;

    public HeatingSourceDto() { }

    public Long   getId()     { return id;     }
    public String getType()   { return type;   }
    public Double getPower()  { return power;  }
    public Long   getFlatId() { return flatId; }

    public void setId   (Long id)        { this.id   = id; }
    public void setType (String type)    { this.type = type; }
    public void setPower(Double power)   { this.power = power; }
    public void setFlatId(Long flatId)   { this.flatId = flatId; }
}
