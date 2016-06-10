/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package org.co2.kanban.repository.taskfield;

import java.io.Serializable;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;
import javax.persistence.TableGenerator;
import org.co2.kanban.repository.Identifiable;
import org.co2.kanban.repository.project.Project;

/**
 *
 * @author ben
 */
@Entity
@Table(name = "kyt_task_field_def")
public class TaskFieldDefinition implements Serializable, Identifiable {
    private static final long serialVersionUID = -6657689259578628482L;

    @TableGenerator(name = "taskfielddef_generator", table = "kyt_internal_sequence" )
    @Id
    @GeneratedValue(generator = "taskfielddef_generator", strategy = GenerationType.TABLE)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "project_id")
    private Project project;

    private String name;

    private TaskFieldType type;

    private Boolean required;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Project getProject() {
        return project;
    }

    public void setProject(Project project) {
        this.project = project;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public TaskFieldType getType() {
        return type;
    }

    public void setType(TaskFieldType type) {
        this.type = type;
    }

    public Boolean getRequired() {
        return required;
    }

    public void setRequired(Boolean required) {
        this.required = required;
    }

}
