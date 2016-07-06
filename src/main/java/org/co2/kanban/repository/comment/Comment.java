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
import javax.persistence.Convert;
import javax.persistence.Converter;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;
import javax.persistence.Table;
import javax.persistence.TableGenerator;
import org.co2.kanban.repository.Identifiable;
import org.co2.kanban.repository.converter.JSONConverter;
import org.co2.kanban.repository.task.Task;
import org.co2.kanban.repository.user.ApplicationUser;

/**
 *
 * @author ben
 */
@Entity
@Table(name = "KYT_TASK_COMMENT")
public class Comment implements Serializable, Identifiable {

    private static final long serialVersionUID = 351144123076183094L;

    @TableGenerator(
            name = "comment_generator", table = "kyt_internal_sequence", pkColumnName = "sequence_name",
            valueColumnName = "sequence_next_hi_value", pkColumnValue = "comment_generator")
    @Id
    @GeneratedValue(generator = "comment_generator", strategy = GenerationType.TABLE)
    private Long id;

    @ManyToOne
    private Task task;

    @Convert(converter = JSONConverter.class)
    private CommentContent content;

    @Override
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Task getTask() {
        return task;
    }

    public void setTask(Task task) {
        this.task = task;
    }

    public CommentContent getContent() {
        return content;
    }

    public void setContent(CommentContent content) {
        this.content = content;
    }
    
    public static class CommentContent implements Serializable {

        private static final long serialVersionUID = -7472437090233919708L;

        private ApplicationUser writer;

        private Timestamp writingDate;

        private String comment;

        public ApplicationUser getWriter() {
            return writer;
        }

        public void setWriter(ApplicationUser writer) {
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

}
