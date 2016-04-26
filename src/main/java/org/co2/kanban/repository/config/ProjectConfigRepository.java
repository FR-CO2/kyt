/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package org.co2.kanban.repository.config;

import org.co2.kanban.repository.project.Project;
import org.springframework.data.repository.PagingAndSortingRepository;

/**
 *
 * @author stan
 */
public interface ProjectConfigRepository extends PagingAndSortingRepository<ProjectConfig, Long> {

    Iterable<ProjectConfig> findByProject(Project project);
    Iterable<ProjectConfig> findByProjectAndCategory(Project project, ProjectConfigType category);
    ProjectConfig findByProjectAndCategoryAndKeyConfig(Project project, ProjectConfigType category, String keyConfig);
}
