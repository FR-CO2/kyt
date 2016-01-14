/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package org.co2.kanban.repository.swimlane;

import org.co2.kanban.repository.project.Project;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.PagingAndSortingRepository;

/**
 *
 * @author ben
 */
public interface SwimlaneRepository extends PagingAndSortingRepository<Swimlane, Long> {

    Iterable<Swimlane> findByProjectOrderByPositionAsc(Project project);

    Iterable<Swimlane> findByProjectAndPositionGreaterThanOrderByPositionAsc(Project project, Long position);

    @Query(value = "SELECT MAX(s.position) + 1 FROM Swimlane s where s.project = ?1")
    Long getProjectMaxPosition(Project project);
    
    @Query("select count(e)>0 from Swimlane e where e.project= ?1 and UPPER(e.name)= UPPER(?2)")
    Boolean checkExistProjectAndName(Project project, String name);
}
