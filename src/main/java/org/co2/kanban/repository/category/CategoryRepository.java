/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package org.co2.kanban.repository.category;

import org.co2.kanban.repository.project.Project;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;

/**
 *
 * @author ben
 */
public interface CategoryRepository extends CrudRepository<Category, Long>{
    
    Iterable<Category> findByProject(Project project);
    
    @Query("select count(e)>0 from Category e where e.project= ?1 and UPPER(e.name)= UPPER(?2)")
    Boolean checkExistProjectAndName(Project project, String name);
}
