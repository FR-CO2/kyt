/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package org.co2.kanban.rest.project;

import org.co2.kanban.repository.project.Project;
import org.co2.kanban.rest.IdentifiableResourceSupport;

/**
 *
 * @author ben
 */
public class ProjectResource extends IdentifiableResourceSupport<Project> {

    public ProjectResource(Project project) {
        super(project);
    }
    

    public String getName() {
        return this.getBean().getName();
    }
    
}
