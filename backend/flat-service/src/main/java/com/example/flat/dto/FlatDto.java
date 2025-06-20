package com.example.flat.dto;

import com.example.flat.model.Flat;
import java.util.List;

public class FlatDto {

    private Flat                       flat;
    private List<HeatingSourceDto>     heatingSources;

    public FlatDto() { }

    public FlatDto(Flat flat, List<HeatingSourceDto> heatingSources) {
        this.flat            = flat;
        this.heatingSources  = heatingSources;
    }

    public Flat getFlat() { return flat; }
    public void setFlat(Flat f) { this.flat = f; }

    public List<HeatingSourceDto> getHeatingSources() { return heatingSources; }
    public void setHeatingSources(List<HeatingSourceDto> list) {
        this.heatingSources = list;
    }
}
