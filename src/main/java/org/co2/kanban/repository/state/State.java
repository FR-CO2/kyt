/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package org.co2.kanban.repository.state;

import org.co2.kanban.repository.project.Project;
import org.co2.kanban.repository.task.Task;
import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;
import javax.persistence.Entity;
import javax.persistence.FetchType;
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
        done.setCloseState(Boolean.TRUE);
        List<State> defaults = new ArrayList<>();
        defaults.add(backlog);
        defaults.add(ready);
        defaults.add(inProgress);
        defaults.add(done);
        return defaults;
    }

    @Id
    @GeneratedValue
    private Long id;

    private String name;

    private Long position;

    private Boolean kanbanHide = Boolean.FALSE;

    private Boolean closeState = Boolean.FALSE;

    @ManyToOne
    private Project project;

    @OneToMany(fetch = FetchType.LAZY, mappedBy = "state")
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

    public Boolean getKanbanHide() {
        return kanbanHide;
    }

    public void setKanbanHide(Boolean kanbanHide) {
        this.kanbanHide = kanbanHide;
    }

    public Boolean getCloseState() {
        return closeState;
    }

    public void setCloseState(Boolean closeState) {
        this.closeState = closeState;
    }

}
