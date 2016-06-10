/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package org.co2.kanban.repository.taskfield;

import java.io.Serializable;
import javax.persistence.Column;
import javax.persistence.Embeddable;
import javax.persistence.EmbeddedId;
import javax.persistence.Entity;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;
import org.co2.kanban.repository.task.Task;

/**
 *
 * @author ben
 */
@Entity
@Table(name = "KYT_TASK_FIELD")
public class TaskField implements Serializable {

    private static final long serialVersionUID = -6096570048749103950L;

    @EmbeddedId
    private TaskFieldId id = new TaskFieldId();

    @Column(name = "field_value")
    private String fieldValue;

    @ManyToOne
    @JoinColumn(name = "task_field_def_id", insertable = false, updatable = false)
    private TaskFieldDefinition definition;

    @ManyToOne
    @JoinColumn(name = "task_id", insertable = false, updatable = false)
    private Task task;

    public TaskFieldId getId() {
        return id;
    }

    public String getFieldValue() {
        return fieldValue;
    }

    public void setFieldValue(String value) {
        this.fieldValue = value;
    }

    public TaskFieldDefinition getDefinition() {
        return definition;
    }

    public void setDefinition(TaskFieldDefinition definition) {
        if (definition != null) {
            this.id.taskFieldDefId = definition.getId();
            this.definition = definition;
        }
    }

    public Task getTask() {
        return task;
    }

    public void setTask(Task task) {
        if (task != null) {
            this.id.taskId = task.getId();
            this.task = task;
        }
    }

    @Embeddable
    public static class TaskFieldId implements Serializable {

        private static final long serialVersionUID = 5695836283412462153L;

        @Column(name = "task_id")
        Long taskId;

        @Column(name = "task_field_def_id")
        Long taskFieldDefId;

    }
}
