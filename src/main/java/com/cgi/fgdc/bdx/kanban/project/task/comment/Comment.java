/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.cgi.fgdc.bdx.kanban.project.task.comment;

import com.cgi.fgdc.bdx.kanban.project.security.Member;
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
public class Comment implements Serializable{
    private static final long serialVersionUID = 351144123076183094L;
    
    @Id
    private Long id;
    
    @ManyToOne
    private Member writer;
    
    private Timestamp writingDate;
    
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
    
    
}
