/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.cgi.fgdc.bdx.kanban.project.reporting;

/**
 *
 * @author ben
 */
public class CategoryReport {

    private String category;

    private Long nbTask;

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public Long getNbTask() {
        return nbTask;
    }

    public void setNbTask(Long nbTask) {
        this.nbTask = nbTask;
    }
}
