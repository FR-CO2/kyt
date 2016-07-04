/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package org.co2.kanban.repository.taskhisto;

import java.io.Serializable;
import java.sql.Timestamp;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;
import javax.persistence.TableGenerator;
import org.co2.kanban.repository.Identifiable;
import org.co2.kanban.repository.member.ProjectMember;
import org.co2.kanban.repository.task.Task;

/**
 *
 * @author stan
 */
@Entity
@Table(name="KYT_TASK_HISTO")
public class TaskHisto implements Serializable, Identifiable{
    
    private static final long serialVersionUID = 6096785248749103950L;
    
    @TableGenerator(
            name = "task_histo_generator", table = "kyt_internal_sequence", pkColumnName = "sequence_name",
            valueColumnName = "sequence_next_hi_value", pkColumnValue = "task_histo_generator")
    @Id
    @GeneratedValue(generator = "task_histo_generator", strategy = GenerationType.TABLE)
    private Long id;
    
    @ManyToOne
    private Task task;
    
    private Long versionId;
    
    private Timestamp dateModif;
    
    @ManyToOne
    @JoinColumn(name = "member_id")
    private ProjectMember assignee;
    
    @Column(length = 100000)
    private byte[] file;

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

    public Long getVersionId() {
        return versionId;
    }

    public void setVersionId(Long versionId) {
        this.versionId = versionId;
    }

    public Timestamp getDateModif() {
        return dateModif;
    }

    public void setDateModif(Timestamp dateModif) {
        this.dateModif = dateModif;
    }

    public ProjectMember getAssignee() {
        return assignee;
    }

    public void setAssignee(ProjectMember assignee) {
        this.assignee = assignee;
    }

    public byte[] getFile() {
        return file;
    }

    public void setFile(byte[] file) {
        this.file = file;
    }
    
    
}
