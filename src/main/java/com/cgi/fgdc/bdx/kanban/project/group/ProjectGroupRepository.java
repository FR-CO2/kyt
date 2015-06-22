/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.cgi.fgdc.bdx.kanban.project.group;

import com.cgi.fgdc.bdx.kanban.project.Project;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.repository.PagingAndSortingRepository;

/**
 *
 * @author ben
 */
public interface ProjectGroupRepository extends PagingAndSortingRepository<ProjectGroup, Long>{
    
        Page<ProjectGroup> findByProject(Project project, Pageable p);
}
