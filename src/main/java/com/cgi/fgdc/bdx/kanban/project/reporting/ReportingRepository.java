/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.cgi.fgdc.bdx.kanban.project.reporting;

import com.cgi.fgdc.bdx.kanban.project.task.Task;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.PagingAndSortingRepository;

/**
 *
 * @author ben
 */
public interface ReportingRepository extends PagingAndSortingRepository<Task, Long> {

    @Query("SELECT t.assignee.user.username AS assignee, COUNT(t) AS nbTask FROM Task AS t where t.project.id = ?1 GROUP BY t.assignee ORDER BY t.assignee.user.username ASC")
    Iterable<AssigneeReport> getAssigneeReporting(Long projectId);

    @Query(value = "SELECT s.name AS state, COUNT(t.id) AS nbTask FROM STATE AS s LEFT OUTER JOIN TASK AS t on s.id = t.STATE_ID where s.PROJECT_ID= ?1 GROUP BY s.name ORDER BY s.position ASC", nativeQuery = true)
    Iterable<StateReport> getStateReporting(Long projectId);

    @Query("SELECT t.swimlane.name AS swimlane, t.state.name AS state, COUNT(t) AS nbTask FROM Task AS t where t.project.id = ?1 GROUP BY t.state, t.swimlane ORDER BY t.state.position ASC")
    Iterable<SwimlaneReport> getSwimlaneReporting(Long projectId);
}
