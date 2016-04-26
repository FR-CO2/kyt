/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package org.co2.kanban.repository.config;

import org.co2.kanban.repository.project.Project;
import java.io.Serializable;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.OneToOne;
import javax.persistence.SequenceGenerator;
import javax.persistence.Table;
import org.co2.kanban.repository.Identifiable;

/**
 *
 * @author ben
 */
@Entity
@Table(name = "KYT_PROJECT_CONFIG")
public class ProjectConfig implements Serializable, Identifiable {

    private static final long serialVersionUID = -7133694782401886935L;

    @SequenceGenerator(name = "config_generator", sequenceName = "config_pkey_seq")
    @Id
    @GeneratedValue(generator = "config_generator")
    private Long id;

    private ProjectConfigType category;
    private String keyConfig;
    private String valueConfig;


    @ManyToOne
    @JoinColumn(name = "project_id")
    private Project project;

    @Override
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getKey(){
        return this.keyConfig;
    }
    
    public void setKey(String key){
        this.keyConfig = key;
    }
    
    public void setValue(String value) {
        this.valueConfig = value;
    }

    public String getValue() {
        return this.valueConfig;
    }

    public ProjectConfigType getCategory() {
        return category;
    }

    public void setType(ProjectConfigType category) {
        this.category = category;
    }

    public Project getProject() {
        return project;
    }

    public void setProject(Project project) {
        this.project = project;
    }
}
