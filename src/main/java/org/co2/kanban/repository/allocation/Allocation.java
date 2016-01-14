/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package org.co2.kanban.repository.allocation;

import org.co2.kanban.repository.member.Member;
import org.co2.kanban.repository.task.Task;
import java.io.Serializable;
import java.sql.Timestamp;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.ManyToOne;
import javax.persistence.SequenceGenerator;
import javax.persistence.Table;
import org.co2.kanban.repository.Identifiable;

/**
 *
 * @author ben
 */
@Entity
@Table(name = "KYT_ALLOCATION")
public class Allocation implements Serializable, Identifiable {

    private static final long serialVersionUID = -4133209060738613597L;

    @SequenceGenerator(name = "allocation_generator", sequenceName = "allocation_pkey_seq")
    @Id
    @GeneratedValue(generator = "allocation_generator")
    private Long id;

    @ManyToOne
    private Member member;

    private Timestamp allocationDate;

    @ManyToOne
    private Task task;

    private Float timeSpent;

    private Float timeRemains;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Member getMember() {
        return member;
    }

    public void setMember(Member member) {
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

    public Float getTimeSpent() {
        return timeSpent;
    }

    public void setTimeSpent(Float timeSpent) {
        this.timeSpent = timeSpent;
    }

    public Float getTimeRemains() {
        return timeRemains;
    }

    public void setTimeRemains(Float timeRemains) {
        this.timeRemains = timeRemains;
    }

}
