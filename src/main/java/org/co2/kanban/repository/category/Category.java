/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package org.co2.kanban.repository.category;

import org.co2.kanban.repository.project.Project;
import org.co2.kanban.repository.task.Task;
import java.io.Serializable;
import java.util.List;
import javax.persistence.CascadeType;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;
import org.co2.kanban.rest.project.category.CategoryResource;

/**
 *
 * @author ben
 */
@Entity
public class Category implements Serializable {

    private static final long serialVersionUID = 8473515701046153275L;

    @Id
    @GeneratedValue
    private Long id;

    private String name;
    
    private String bgcolor;
    
    private String color;
    
    @ManyToOne(cascade = CascadeType.DETACH)
    private Project project;

    @OneToMany(cascade = CascadeType.DETACH)
    private List<Task> tasks;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Project getProject() {
        return project;
    }

    public void setProject(Project project) {
        this.project = project;
    }

    public List<Task> getTasks() {
        return tasks;
    }

    public void setTasks(List<Task> tasks) {
        this.tasks = tasks;
    }

    public String getBgcolor() {
        return bgcolor;
    }

    public void setBgcolor(String bgcolor) {
        this.bgcolor = bgcolor;
    }

    public String getColor() {
        return color;
    }

    public void setColor(String color) {
        this.color = color;
    }

}
