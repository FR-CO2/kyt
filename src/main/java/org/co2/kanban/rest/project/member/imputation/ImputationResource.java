/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package org.co2.kanban.rest.project.member.imputation;

import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;

/**
 *
 * @author ben
 */
public class ImputationResource {


    private Iterable<ImputationDetailResource> details = new ArrayList<>();

    private Map<Long, Float> imputations = new HashMap<>();
    
    public Iterable<ImputationDetailResource> getDetails() {
        return details;
    }    
    
    public Map<Long, Float> getImputations() {
        return imputations;
    }

    public void setDetails(Iterable<ImputationDetailResource> details) {
        this.details = details;
    }

    public void setImputations(Map<Long, Float> imputations) {
        this.imputations = imputations;
    }
    
    
}
