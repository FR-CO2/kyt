/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package org.co2.kanban.repository.state;

import org.co2.kanban.repository.project.Project;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.PagingAndSortingRepository;

/**
 *
 * @author ben
 */
public interface StateRepository extends PagingAndSortingRepository<State, Long> {

    State findByProjectAndPosition(Project project, Long position);

    Iterable<State> findByProjectAndPositionGreaterThanEqualOrderByPositionAsc(Project project, Long position);

    Iterable<State> findByProjectOrderByPositionAsc(Project project);

    Iterable<State> findByProjectAndKanbanHideOrderByPositionAsc(Project project, Boolean kanban);

    Iterable<State> findByProjectAndKanbanHideFalseOrderByPositionAsc(Project project);

    @Query(value = "SELECT MAX(s.position) + 1 FROM State s where s.project = ?1")
    Long getProjectMaxPosition(Project project);
    
    @Query("select count(e)>0 from State e where e.project= ?1 and UPPER(e.name)= UPPER(?2)")
    Boolean checkExistProjectAndName(Project project, String name);
}
