/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package org.co2.kanban.repository.swimlane;

import org.co2.kanban.repository.project.Project;
import org.co2.kanban.repository.task.Task;
import java.io.Serializable;
import java.sql.Timestamp;
import java.util.List;
import javax.persistence.CascadeType;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;
import javax.persistence.Table;
import javax.persistence.TableGenerator;
import org.co2.kanban.repository.Identifiable;

/**
 *
 * @author ben
 */
@Entity
@Table(name = "KYT_SWIMLANE")
public class Swimlane implements Serializable, Identifiable {

    private static final long serialVersionUID = -7399300524553719167L;

    @TableGenerator(
            name = "swimlane_generator", table = "kyt_internal_sequence", pkColumnName = "sequence_name",
            valueColumnName = "sequence_next_hi_value", pkColumnValue = "swimlane_generator")
    @Id
    @GeneratedValue(generator = "swimlane_generator", strategy = GenerationType.TABLE)
    private Long id;

    private String name;

    private Long position;

    private Timestamp endPlanned;

    private Boolean collapsable;

    @OneToMany(fetch = FetchType.LAZY, mappedBy = "swimlane")
    private List<Task> tasks;

    @ManyToOne(cascade = CascadeType.DETACH)
    private Project project;

    @Override
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

    public Timestamp getEndPlanned() {
        return endPlanned;
    }

    public void setEndPlanned(Timestamp endPlanned) {
        this.endPlanned = endPlanned;
    }

    public Boolean getCollapsable() {
        return collapsable;
    }

    public void setCollapsable(Boolean collapsable) {
        this.collapsable = collapsable;
    }

}
