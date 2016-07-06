/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package org.co2.kanban.rest.project.task.comment;

import java.sql.Timestamp;
import org.co2.kanban.repository.comment.Comment;
import org.co2.kanban.rest.IdentifiableResourceSupport;

/**
 *
 * @author ben
 */
public class CommentResource extends IdentifiableResourceSupport<Comment> {

    private int nbReply;
    
    public CommentResource(Comment bean) {
        super(bean);
    }

    public String getComment() {
        return this.getBean().getContent().getComment();
    }

    public String getWriter() {
        return this.getBean().getContent().getWriter().getUsername();
    }
    
    public Timestamp getWritingDate() {
        return this.getBean().getContent().getWritingDate();
    }

    public int getNbReply() {
        return nbReply;
    }

    public void setNbReply(int nbReply) {
        this.nbReply = nbReply;
    }
    
}
