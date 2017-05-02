/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package org.co2.kanban.repository.allocation;

import org.co2.kanban.repository.member.ProjectMember;
import org.co2.kanban.repository.task.Task;
import java.io.Serializable;
import java.sql.Timestamp;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.ManyToOne;
import javax.persistence.Table;
import javax.persistence.TableGenerator;
import org.co2.kanban.repository.Identifiable;

/**
 *
 * @author ben
 */
@Entity
@Table(name = "KYT_ALLOCATION")
public class Allocation implements Serializable, Identifiable {

    private static final long serialVersionUID = -4133209060738613597L;

    @TableGenerator(
            name = "allocation_generator", table = "kyt_internal_sequence", pkColumnName = "sequence_name",
            valueColumnName = "sequence_next_hi_value", pkColumnValue = "allocation_generator")
    @Id
    @GeneratedValue(generator = "allocation_generator", strategy = GenerationType.TABLE)
    private Long id;

    @ManyToOne
    private ProjectMember member;

    private Timestamp allocationDate;

    @ManyToOne
    private Task task;

    private Double timeSpent;

    private Double timeRemains;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public ProjectMember getMember() {
        return member;
    }

    public void setMember(ProjectMember member) {
        this.member = member;
    }

    public Timestamp getAllocationDate() {
        return allocationDate;
    }

    public void setAllocationDate(Timestamp date) {
        this.allocationDate = date;
    }

    public Task getTask() {
        return task;
    }

    public void setTask(Task task) {
        this.task = task;
    }

    public Double getTimeSpent() {
        return timeSpent;
    }

    public void setTimeSpent(Double timeSpent) {
        this.timeSpent = timeSpent;
    }

    public Double getTimeRemains() {
        return timeRemains;
    }

    public void setTimeRemains(Double timeRemains) {
        this.timeRemains = timeRemains;
    }

}
