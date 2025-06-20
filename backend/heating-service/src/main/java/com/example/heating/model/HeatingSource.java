package com.example.heating.model;

import jakarta.persistence.*;

@Entity
@Table(name = "heating_sources")
public class HeatingSource {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private HeatingType type;

    @Column(nullable = false)
    private Double power;

    @Column(name = "flat_id", nullable = false)
    private Long flatId;

    // ---------- getters & setters ----------
    public Long getId()              { return id;     }
    public void setId(Long id)       { this.id = id;  }

    public HeatingType getType()               { return type; }
    public void setType(HeatingType type)      { this.type = type; }

    public Double getPower()         { return power;  }
    public void setPower(Double p)   { this.power = p;}

    public Long getFlatId()          { return flatId; }
    public void setFlatId(Long fid)  { this.flatId = fid; }

    // ---------- convenience constructors ----------
    public HeatingSource() {}

    public HeatingSource(HeatingType type,
                         Double power,
                         Long flatId) {
        this.type   = type;
        this.power  = power;
        this.flatId = flatId;
    }
}
