package org.co2.kanban.business.project.task.history;

import org.co2.kanban.repository.Identifiable;
import org.co2.kanban.repository.taskhisto.TaskHisto;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.sql.Timestamp;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;

/**
 * Created by s.granel on 07/04/2017.
 */
public class TaskHistoRest implements Identifiable {

    private static final Logger LOGGER = LoggerFactory.getLogger(TaskHistoRest.class);
    private Long id;
    private Long taskId;
    private Long versionId;
    private Long projectId;
    private String projectName;
    private Long stateId;
    private String stateName;
    private Long swinlameId;
    private String swinlameName;
    private Long categoryId;
    private String categoryName;
    private Double totalAllocation;
    private Timestamp dateModif;
    private Long userIdWriter;
    private String usernameWriter;
    private int actionValue;
    private Long allocationId;

    public Long getId() {
        return id;
    }
    public void setId(Long id) {
        this.id = id;
    }

    public Long getTaskId() {
        return taskId;
    }
    public void setTaskId(Long taskId) {
        this.taskId = taskId;
    }

    public Long getVersionId() {
        return versionId;
    }
    public void setVersionId(Long versionId) {
        this.versionId = versionId;
    }

    public Long getProjectId() {
        return projectId;
    }
    public void setProjectId(Long projectId) {
        this.projectId = projectId;
    }

    public String getProjectName() {
        return projectName;
    }

    public void setProjectName(String projectName) {
        this.projectName = projectName;
    }

    public Long getStateId() {
        return stateId;
    }
    public void setStateId(Long stateId) {
        this.stateId = stateId;
    }

    public String getStateName() {
        return stateName;
    }

    public void setStateName(String stateName) {
        this.stateName = stateName;
    }

    public Long getSwinlameId() {
        return swinlameId;
    }
    public void setSwinlameId(Long swinlameId) {
        this.swinlameId = swinlameId;
    }

    public String getSwinlameName() {
        return swinlameName;
    }

    public void setSwinlameName(String swinlameName) {
        this.swinlameName = swinlameName;
    }

    public Long getCategoryId() {
        return categoryId;
    }
    public void setCategoryId(Long categoryId) {
        this.categoryId = categoryId;
    }

    public String getCategoryName() {
        return categoryName;
    }
    public void setCategoryName(String categoryName) {
        this.categoryName = categoryName;
    }

    public Double getTotalAllocation() {
        return totalAllocation;
    }
    public void setTotalAllocation(Double totalAllocation) {
        this.totalAllocation = totalAllocation;
    }

    public Timestamp getDateModif() {
        return dateModif;
    }
    public void setDateModif(Timestamp dateModif) {
        this.dateModif = dateModif;
    }

    public Long getUserIdWriter() {
        return userIdWriter;
    }
    public void setUserIdWriter(Long userIdWriter) {
        this.userIdWriter = userIdWriter;
    }

    public String getUsernameWriter() {
        return usernameWriter;
    }
    public void setUsernameWriter(String usernameWriter) {
        this.usernameWriter = usernameWriter;
    }

    public int getActionValue() {
        return actionValue;
    }
    public void setActionValue(int actionValue) {
        this.actionValue = actionValue;
    }

    public Long getAllocationId() {
        return allocationId;
    }
    public void setAllocationId(Long allocationId) {
        this.allocationId = allocationId;
    }

    public void convertTaskHistoRest(TaskHistoRest taskHistoRest, TaskHisto taskHisto){
        taskHistoRest.setTaskId(Long.parseLong(taskHisto.getTaskId()));
        taskHistoRest.setVersionId(taskHisto.getVersionId());
        taskHistoRest.setProjectId(Long.parseLong(taskHisto.getProjectId()));
        taskHistoRest.setProjectName(taskHisto.getProjectName());
        if(taskHisto.getStateId()!=null) {
            taskHistoRest.setStateId(Long.parseLong(taskHisto.getStateId()));
        }
        taskHistoRest.setStateName(taskHisto.getStateName());
        if(taskHisto.getSwinlameId() != null) {
            taskHistoRest.setSwinlameId(Long.parseLong(taskHisto.getSwinlameId()));
        }
        taskHistoRest.setSwinlameName(taskHisto.getSwinlameName());
        if(taskHisto.getCategoryId() != null) {
            taskHistoRest.setCategoryId(Long.parseLong(taskHisto.getCategoryId()));
        }
        taskHistoRest.setCategoryName(taskHisto.getCategoryName());

        taskHistoRest.setTotalAllocation(0D);
        if(taskHisto.getTotalAllocations()!=null) {
            taskHistoRest.setTotalAllocation(Double.parseDouble(taskHisto.getTotalAllocations()));
        }

        SimpleDateFormat dateFormat = new SimpleDateFormat("dd-MM-yyyy HH:mm:ss");
        try {
            Date parsedDate = dateFormat.parse(taskHisto.getDateModif());
            Timestamp timestamp = new java.sql.Timestamp(parsedDate.getTime());
            taskHistoRest.setDateModif(timestamp);
        } catch (ParseException e){
            LOGGER.warn("Erreur lors de la conversion de la date de modification : " +e.getMessage());
        }
        taskHistoRest.setUserIdWriter(Long.parseLong(taskHisto.getUserIdWriter()));
        taskHistoRest.setUsernameWriter(taskHisto.getUsernameWriter());
        taskHistoRest.setActionValue(Integer.parseInt(taskHisto.getActionValue()));
    }
}
