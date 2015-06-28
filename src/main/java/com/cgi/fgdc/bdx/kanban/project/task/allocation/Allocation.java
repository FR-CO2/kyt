/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.cgi.fgdc.bdx.kanban.project.task.allocation;

import com.cgi.fgdc.bdx.kanban.project.security.Member;
import com.cgi.fgdc.bdx.kanban.project.task.Task;
import java.io.Serializable;
import java.sql.Timestamp;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.ManyToOne;

/**
 *
 * @author ben
 */
@Entity
public class Allocation implements Serializable{
    private static final long serialVersionUID = -4133209060738613597L;
    
    @Id
    private Long id;
    
    @ManyToOne
    private Member member;
    
    private Timestamp allocationDate;
    
    @ManyToOne
    private Task task;
    
    private Long timeSpent;
    
    private Long timeRemains;

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

    public Long getTimeSpent() {
        return timeSpent;
    }

    public void setTimeSpent(Long timeSpent) {
        this.timeSpent = timeSpent;
    }

    public Long getTimeRemains() {
        return timeRemains;
    }

    public void setTimeRemains(Long timeRemains) {
        this.timeRemains = timeRemains;
    }
    
    
}
