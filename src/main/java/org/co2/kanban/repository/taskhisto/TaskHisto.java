/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package org.co2.kanban.repository.taskhisto;

import java.sql.Timestamp;

import com.oberasoftware.jasdb.api.entitymapper.annotations.Id;
import com.oberasoftware.jasdb.api.entitymapper.annotations.JasDBEntity;
import com.oberasoftware.jasdb.api.entitymapper.annotations.JasDBProperty;
import org.co2.kanban.repository.Identifiable;
import org.co2.kanban.repository.user.ApplicationUser;

/**
 *
 * @author stan
 */
@JasDBEntity(bagName = "KYT_TASK_HISTO")
public class TaskHisto implements Identifiable {

    private Long id;
    private Long taskId;
    private Long versionId;
    private Long projectId;
    private Long stateId;
    private Long swinlameId;
    private Long categoryId;
    private Timestamp dateModif;
    private ApplicationUser assignee;
    private Long userIdWriter;
    private String usernameWriter;
    private int actionValue;

    @Id
    @JasDBProperty
    public Long getId() {
        return id;
    }
    public void setId(Long id) {
        this.id = id;
    }

    @JasDBProperty
    public Long getTaskId() {
        return taskId;
    }
    public void setTaskId(Long taskid) {
        this.taskId = taskId;
    }

    @JasDBProperty
    public Long getVersionId() {
        return versionId;
    }
    public void setVersionId(Long versionId) {
        this.versionId = versionId;
    }

    @JasDBProperty
    public Long getProjectId() {
        return projectId;
    }
    public void setProjectId(Long projectId) {
        this.projectId = projectId;
    }

    @JasDBProperty
    public Long getStateId() {
        return stateId;
    }
    public void setStateId(Long stateId) {
        this.stateId = stateId;
    }

    @JasDBProperty
    public Long getSwinlameId() {
        return swinlameId;
    }
    public void setSwinlameId(Long swinlameId) {
        this.swinlameId = swinlameId;
    }

    @JasDBProperty
    public Long getCategoryId() {
        return categoryId;
    }
    public void setCategoryId(Long categoryId) {
        this.categoryId = categoryId;
    }

    @JasDBProperty
    public Timestamp getDateModif() {
        return dateModif;
    }
    public void setDateModif(Timestamp dateModif) {
        this.dateModif = dateModif;
    }

    @JasDBProperty
    public ApplicationUser getAssignee() {
        return assignee;
    }
    public void setAssignee(ApplicationUser assignee) {
        this.assignee = assignee;
    }

    @JasDBProperty
    public Long getUserIdWriter() {
        return userIdWriter;
    }
    public void setUserIdWriter(Long userIdWriter) {
        this.userIdWriter = userIdWriter;
    }

    @JasDBProperty
    public String getUsernameWriter() {
        return usernameWriter;
    }
    public void setUsernameWriter(String usernameWriter) {
        this.usernameWriter = usernameWriter;
    }

    @JasDBProperty
    public int getActionValue() {
        return actionValue;
    }
    public void setActionValue(int actionValue) {
        this.actionValue = actionValue;
    }

}
