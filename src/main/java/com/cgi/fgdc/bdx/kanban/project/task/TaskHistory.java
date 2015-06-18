/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.cgi.fgdc.bdx.kanban.project.task;

import java.io.Serializable;
import java.sql.Timestamp;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;

/**
 *
 * @author ben
 */
@Entity
public class TaskHistory implements Serializable{
    private static final long serialVersionUID = 4102190049318071547L;

    @Id
    private Long id;

    private Timestamp modification;
    
    private String actor;
    
    @ManyToOne
    @JoinColumn(name = "TASK_PARENT_ID")
    private Task parent;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Task getParent() {
        return parent;
    }

    public void setParent(Task parent) {
        this.parent = parent;
    }

    public Timestamp getModification() {
        return modification;
    }

    public void setModification(Timestamp modification) {
        this.modification = modification;
    }

    public String getActor() {
        return actor;
    }

    public void setActor(String actor) {
        this.actor = actor;
    }

    
}
