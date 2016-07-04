/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package org.co2.kanban.rest.project.task;

/**
 *
 * @author granels
 */
public class TaskListFilter {

    private Long idState;
    private Long idSwimlane;
    private Long idCategory;
    private Long idAssignee;
    private Boolean deleted;

    public Long getIdState() {
        return idState;
    }

    public void setIdState(Long idState) {
        this.idState = idState;
    }

    public Long getIdSwimlane() {
        return idSwimlane;
    }

    public void setIdSwimlane(Long idSwimlane) {
        this.idSwimlane = idSwimlane;
    }

    public Long getIdCategory() {
        return idCategory;
    }

    public void setIdCategory(Long idCategory) {
        this.idCategory = idCategory;
    }

    public Long getIdAssignee() {
        return idAssignee;
    }

    public void setIdAssignee(Long idAssignee) {
        this.idAssignee = idAssignee;
    }

    public Boolean isDeleted() {
        return deleted;
    }

    public void setDeleted(boolean deleted) {
        this.deleted = deleted;
    }

}
