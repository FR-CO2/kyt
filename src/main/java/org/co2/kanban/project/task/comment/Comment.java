/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package org.co2.kanban.project.task.comment;

import org.co2.kanban.project.security.Member;
import java.io.Serializable;
import java.sql.Timestamp;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.ManyToOne;
import org.co2.kanban.project.task.Task;

/**
 *
 * @author ben
 */
@Entity
public class Comment implements Serializable{
    private static final long serialVersionUID = 351144123076183094L;
    
    @Id
    private Long id;
    
    @ManyToOne
    private Member writer;
    
    private Timestamp writingDate;
    
    @ManyToOne
    private Task task;
    
    private String comment;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Member getWriter() {
        return writer;
    }

    public void setWriter(Member writer) {
        this.writer = writer;
    }

    public Timestamp getWritingDate() {
        return writingDate;
    }

    public void setWritingDate(Timestamp writingDate) {
        this.writingDate = writingDate;
    }

    public String getComment() {
        return comment;
    }

    public void setComment(String comment) {
        this.comment = comment;
    }

    public Task getTask() {
        return task;
    }

    public void setTask(Task task) {
        this.task = task;
    }
    
}
