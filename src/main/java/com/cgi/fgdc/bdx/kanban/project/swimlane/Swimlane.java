/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.cgi.fgdc.bdx.kanban.project.swimlane;

import com.cgi.fgdc.bdx.kanban.ControllerViews;
import com.cgi.fgdc.bdx.kanban.project.Project;
import com.cgi.fgdc.bdx.kanban.project.security.Member;
import com.cgi.fgdc.bdx.kanban.project.task.Task;
import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonView;
import com.fasterxml.jackson.annotation.ObjectIdGenerators;
import java.io.Serializable;
import java.util.List;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;
import javax.persistence.PostLoad;
import javax.persistence.Transient;

/**
 *
 * @author ben
 */
@Entity
@JsonIdentityInfo(generator=ObjectIdGenerators.UUIDGenerator.class, property = "@uuid")
public class Swimlane implements Serializable {

    private static final long serialVersionUID = -7399300524553719167L;

    @Id
    @GeneratedValue
    @JsonView(ControllerViews.Task.class)
    private Long id;

    @JsonView(ControllerViews.TaskList.class)
    private String name;

    @JsonView(ControllerViews.TaskList.class)
    private Long position;

    @ManyToOne
    private Member responsable;

    @OneToMany(mappedBy = "swimlane")
    @JsonIgnore
    private List<Task> tasks;

    @ManyToOne
    @JsonIgnore
    private Project project;

    @JsonView(ControllerViews.ProjectList.class)
    @Transient
    private int taskCount = 0;

    @PostLoad
    public void onLoad() {
        if (this.tasks != null) {
            this.taskCount = this.tasks.size();
        }
    }

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

    public Member getResponsable() {
        return responsable;
    }

    public void setResponsable(Member responsable) {
        this.responsable = responsable;
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

    public int getTaskCount() {
        return taskCount;
    }

    public void setTaskCount(int taskCount) {
        this.taskCount = taskCount;
    }

}
