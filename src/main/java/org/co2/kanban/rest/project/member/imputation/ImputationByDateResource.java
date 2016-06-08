/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package org.co2.kanban.rest.project.member.imputation;

import org.springframework.hateoas.ResourceSupport;

/**
 *
 * @author ben
 */
public class ImputationByDateResource extends ResourceSupport {

    private String imputationDate;

    private Float valImputation;

    private boolean areMissing;

    /**
     * 
     * @param imputationDate
     * @param valImputation
     * @param areMissing 
     */
    public ImputationByDateResource(String imputationDate, Float valImputation, boolean areMissing) {
        this.imputationDate = imputationDate;
        this.valImputation = valImputation;
        this.areMissing = areMissing;
    }

    /**
     * 
     * @return 
     */
    public String getImputationDate() {
        return imputationDate;
    }

    /**
     * 
     * @param imputationDate 
     */
    public void setImputationDate(String imputationDate) {
        this.imputationDate = imputationDate;
    }

    /**
     * 
     * @return 
     */
    public Float getValImputation() {
        return valImputation;
    }

    /**
     * 
     * @param valImputation 
     */
    public void setValImputation(Float valImputation) {
        this.valImputation = valImputation;
    }

    /**
     * 
     * @return 
     */
    public boolean isAreMissing() {
        return areMissing;
    }

    /**
     * 
     * @param areMissing 
     */
    public void setAreMissing(boolean areMissing) {
        this.areMissing = areMissing;
    }

}
