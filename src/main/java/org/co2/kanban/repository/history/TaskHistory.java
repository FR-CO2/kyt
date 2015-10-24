/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package org.co2.kanban.repository.history;

import org.co2.kanban.repository.task.Task;
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
    
    private String username;
    
    private String description;
    
    @ManyToOne
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

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

}
