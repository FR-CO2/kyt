/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package org.co2.kanban.rest.project.config;

import org.co2.kanban.repository.config.ProjectConfig;
import org.springframework.hateoas.mvc.ResourceAssemblerSupport;
import org.springframework.stereotype.Component;

/**
 *
 * @author ben
 */
@Component
public class ProjectConfigAssembler extends ResourceAssemblerSupport<ProjectConfig, ProjectConfigResource> {

    public ProjectConfigAssembler() {
        super(ProjectConfigController.class, ProjectConfigResource.class);
    }

    @Override
    public ProjectConfigResource toResource(ProjectConfig config) {
        ProjectConfigResource resource = new ProjectConfigResource(config);
        return resource;
    }
}
