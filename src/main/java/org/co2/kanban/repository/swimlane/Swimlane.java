/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package org.co2.kanban.repository.swimlane;

import org.co2.kanban.repository.project.Project;
import org.co2.kanban.repository.member.Member;
import org.co2.kanban.repository.task.Task;
import java.io.Serializable;
import java.sql.Timestamp;
import java.util.List;
import javax.persistence.CascadeType;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;
import org.co2.kanban.repository.Identifiable;

/**
 *
 * @author ben
 */
@Entity
public class Swimlane implements Serializable, Identifiable {

    private static final long serialVersionUID = -7399300524553719167L;

    @Id
    @GeneratedValue
    private Long id;

    private String name;

    private Long position;

    private String description;
    
    private Timestamp endPlanned;
    
    @OneToMany(mappedBy = "swimlane")
    private List<Task> tasks;

    @ManyToOne(cascade = CascadeType.DETACH)
    private Project project;

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

    public Long getPosition() {
        return position;
    }

    public void setPosition(Long position) {
        this.position = position;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Timestamp getEndPlanned() {
        return endPlanned;
    }

    public void setEndPlanned(Timestamp endPlanned) {
        this.endPlanned = endPlanned;
    }

}
