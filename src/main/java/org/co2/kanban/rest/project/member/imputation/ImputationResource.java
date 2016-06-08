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

    private Iterable<ImputationByDateResource> imputations = new ArrayList<>();
    
    public Iterable<ImputationDetailResource> getDetails() {
        return details;
    }    
    
    public Iterable<ImputationByDateResource> getImputations() {
        return imputations;
    }

    public void setDetails(Iterable<ImputationDetailResource> details) {
        this.details = details;
    }

    public void setImputations(Iterable<ImputationByDateResource> imputations) {
        this.imputations = imputations;
    }
    
    
}
