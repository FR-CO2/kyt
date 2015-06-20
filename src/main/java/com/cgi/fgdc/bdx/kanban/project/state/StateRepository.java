/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.cgi.fgdc.bdx.kanban.project.state;

import com.cgi.fgdc.bdx.kanban.project.Project;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.PagingAndSortingRepository;

/**
 *
 * @author ben
 */
public interface StateRepository extends PagingAndSortingRepository<State, Long> {

    State findByProjectAndPosition(Project project, Long position);

    Iterable<State> findByProjectAndPositionGreaterThanOrderByPositionAsc(Project project, Long position);

    Iterable<State> findByProjectOrderByPositionAsc(Project project);

    Iterable<State> findByProjectAndKanbanHideFalseOrderByPositionAsc(Project project);

    @Query(value = "SELECT MAX(s.position) + 1 FROM state s where s.project_id = ?1", nativeQuery = true)
    Long getProjectMaxPosition(Long projectId);
}
