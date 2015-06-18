/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.cgi.fgdc.bdx.kanban.project.state;

import com.cgi.fgdc.bdx.kanban.ControllerViews;
import com.cgi.fgdc.bdx.kanban.project.Project;
import com.cgi.fgdc.bdx.kanban.project.task.Task;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonView;
import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;

/**
 *
 * @author ben
 */
@Entity
public class State implements Serializable {

    private static final long serialVersionUID = -1395350709593408519L;

    public static List<State> getDefaults(Project project) {
        State backlog = new State();
        backlog.setName("Backlog");
        backlog.setPosition(0L);
        backlog.setProject(project);
        State ready = new State();
        ready.setName("Prêt");
        ready.setPosition(1L);
        ready.setProject(project);
        State inProgress = new State();
        inProgress.setName("En cours");
        inProgress.setPosition(2L);
        inProgress.setProject(project);
        State done = new State();
        done.setName("Terminé");
        done.setPosition(3L);
        done.setProject(project);
        List<State> defaults = new ArrayList<>();
        defaults.add(backlog);
        defaults.add(ready);
        defaults.add(inProgress);
        defaults.add(done);
        return defaults;
    }

    @Id
    @GeneratedValue
    @JsonView(ControllerViews.ProjectList.class)
    private Long id;

    @JsonView(ControllerViews.ProjectList.class)
    private String name;

    @JsonView(ControllerViews.ProjectList.class)
    private Long position;

    @JsonView(ControllerViews.ProjectList.class)
    private Boolean kanbanHide;

    @ManyToOne
    @JsonIgnore
    private Project project;

    @OneToMany
    @JsonIgnore
    private List<Task> tasks = new ArrayList<>();

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

    public Long getPosition() {
        return position;
    }

    public void setPosition(Long position) {
        this.position = position;
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

    @JsonProperty(value = "taskCount")
    @JsonView(ControllerViews.ProjectList.class)
    public Integer getTasksCount() {
        return tasks.size();
    }

    public Boolean getKanbanHide() {
        return kanbanHide;
    }

    public void setKanbanHide(Boolean kanbanHide) {
        this.kanbanHide = kanbanHide;
    }
    
    
}
