/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.cgi.fgdc.bdx.kanban.project.category;

import com.cgi.fgdc.bdx.kanban.project.Project;
import org.springframework.data.repository.CrudRepository;

/**
 *
 * @author ben
 */
public interface CategoryRepository extends CrudRepository<Category, Long>{
    
    Iterable<Category> findByProject(Project project);
}
