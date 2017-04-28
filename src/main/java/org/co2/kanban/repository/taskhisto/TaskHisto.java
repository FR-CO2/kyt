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
import org.apache.commons.lang3.builder.HashCodeBuilder;
import org.co2.kanban.repository.Identifiable;
import org.co2.kanban.repository.user.ApplicationUser;

/**
 *
 * @author stan
 */
@JasDBEntity(bagName = "KYT_TASK_HISTO")
public class TaskHisto {

    private String id;
    private String taskId;
    private String versionId;
    private String projectId;
    private String projectName;
    private String stateId;
    private String stateName;
    private String swinlameId;
    private String swinlameName;
    private String categoryId;
    private String categoryName;
    private String totalAllocations;
    private String dateModif;
    private String userIdWriter;
    private String usernameWriter;
    private String actionValue;

    @Id
    @JasDBProperty
    public String getId() {
        return id;
    }
    public void setId(String id) {
        this.id = id;
    }

    @JasDBProperty
    public String getTaskId() {
        return taskId;
    }
    public void setTaskId(String taskId) {
        this.taskId = taskId;
    }

    @JasDBProperty
    public String getVersionId() {
        return versionId;
    }
    public void setVersionId(String versionId) {
        this.versionId = versionId;
    }

    @JasDBProperty
    public String getProjectId() {
        return projectId;
    }
    public void setProjectId(String projectId) {
        this.projectId = projectId;
    }

    @JasDBProperty
    public String getProjectName() {
        return projectName;
    }
    public void setProjectName(String projectName) {
        this.projectName = projectName;
    }

    @JasDBProperty
    public String getStateId() {
        return stateId;
    }
    public void setStateId(String stateId) {
        this.stateId = stateId;
    }

    @JasDBProperty
    public String getStateName() {
        return stateName;
    }
    public void setStateName(String stateName) {
        this.stateName = stateName;
    }

    @JasDBProperty
    public String getSwinlameId() {
        return swinlameId;
    }
    public void setSwinlameId(String swinlameId) {
        this.swinlameId = swinlameId;
    }

    @JasDBProperty
    public String getSwinlameName() {
        return swinlameName;
    }
    public void setSwinlameName(String swinlameName) {
        this.swinlameName = swinlameName;
    }

    @JasDBProperty
    public String getCategoryId() {
        return categoryId;
    }
    public void setCategoryId(String categoryId) {
        this.categoryId = categoryId;
    }

    @JasDBProperty
    public String getCategoryName() {
        return categoryName;
    }
    public void setCategoryName(String categoryName) {
        this.categoryName = categoryName;
    }

    @JasDBProperty
    public String getTotalAllocations() {
        return totalAllocations;
    }
    public void setTotalAllocations(String totalAllocations) {
        this.totalAllocations= totalAllocations;
    }

    @JasDBProperty
    public String getDateModif() {
        return dateModif;
    }
    public void setDateModif(String dateModif) {
        this.dateModif = dateModif;
    }

    @JasDBProperty
    public String getUserIdWriter() {
        return userIdWriter;
    }
    public void setUserIdWriter(String userIdWriter) {
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
    public String getActionValue() {
        return actionValue;
    }
    public void setActionValue(String actionValue) {
        this.actionValue = actionValue;
    }

    @Override
    public int hashCode(){
        return new HashCodeBuilder(13, 23).
                append(projectId).
                append(stateId).
                append(swinlameId).
                append(categoryId).
                append(totalAllocations).
                toHashCode();
    }

    @Override
    public boolean equals(Object obj) {
        if( ! (obj instanceof TaskHisto) ){
            return false;
        }
        TaskHisto other = (TaskHisto) obj;
        return other.hashCode() == this.hashCode();
    }

}
