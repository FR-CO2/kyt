/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package org.co2.kanban.rest.project.member.imputation;

import java.sql.Timestamp;
import org.springframework.hateoas.ResourceSupport;

/**
 *
 * @author ben
 */
public class ImputationDateResource extends ResourceSupport {

    private final Timestamp date;

    private Float timeSpent;

    public ImputationDateResource(Timestamp date, Float timeSpent) {
        this.date = date;
        this.timeSpent = timeSpent;
    }

    public Timestamp getDate() {
        return date;
    }

    public Float getTimeSpent() {
        return timeSpent;
    }
    
    public void addTimeSpent(Float timeSpent) {
        this.timeSpent += timeSpent;
    }
}
