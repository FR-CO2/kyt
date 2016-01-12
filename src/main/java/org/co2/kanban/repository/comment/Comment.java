/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package org.co2.kanban.repository.comment;

import java.io.Serializable;
import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.List;
import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;
import javax.persistence.Table;
import org.co2.kanban.repository.Identifiable;
import org.co2.kanban.repository.task.Task;

/**
 *
 * @author ben
 */
@Entity
@Table(name = "KYT_TASK_COMMENT")
public class Comment implements Serializable, Identifiable {

    private static final long serialVersionUID = 351144123076183094L;

    @Id
    @GeneratedValue
    private Long id;

    private String writer;

    private Timestamp writingDate;

    @ManyToOne
    private Task task;

    @Column(length = 10000)
    private String comment;

    @ManyToOne
    private Comment parent;

    @OneToMany(mappedBy = "parent", cascade = CascadeType.REMOVE)
    private List<Comment> reply = new ArrayList<>();

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getWriter() {
        return writer;
    }

    public void setWriter(String writer) {
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

    public Comment getParent() {
        return parent;
    }

    public void setParent(Comment parent) {
        this.parent = parent;
    }

    public List<Comment> getReply() {
        return reply;
    }

    public void setReply(List<Comment> reply) {
        this.reply = reply;
    }

}
