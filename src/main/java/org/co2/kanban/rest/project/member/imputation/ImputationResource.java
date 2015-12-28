/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package org.co2.kanban.rest.project.member.imputation;

import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.List;

/**
 *
 * @author ben
 */
public class ImputationResource {
    
    private final Timestamp date;
    
    private final Float timeSpent;

    private final List<ImputationDetailResource> details = new ArrayList<>();
    
    public ImputationResource(Timestamp date, Float timeSpent) {
        this.date = date;
        this.timeSpent = timeSpent;
    }

    public Timestamp getDate() {
        return date;
    }

    public Float getTimeSpent() {
        return timeSpent;
    }

    public List<ImputationDetailResource> getDetails() {
        return details;
    }    
    
}
