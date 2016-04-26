/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package org.co2.kanban.rest.project.config;

import org.co2.kanban.repository.config.ProjectConfig;
import org.co2.kanban.repository.config.ProjectConfigType;
import org.co2.kanban.rest.IdentifiableResourceSupport;

/**
 *
 * @author ben
 */
public class ProjectConfigResource extends IdentifiableResourceSupport<ProjectConfig> {

    public ProjectConfigResource(ProjectConfig config) {
        super(config);
    }
    
    public String getValue() {
        return this.getBean().getValue();
    }

    public ProjectConfigType getCategory() {
        return this.getBean().getCategory();
    }
    
    public String getKey(){
        return this.getBean().getKey();
    }
}
