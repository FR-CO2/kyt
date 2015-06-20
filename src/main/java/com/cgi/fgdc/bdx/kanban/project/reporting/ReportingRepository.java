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

    @Query(value = "SELECT s.name AS state, COUNT(t.id) AS nbTask FROM STATE AS s"
            + " LEFT OUTER JOIN TASK AS t on s.id = t.STATE_ID where s.PROJECT_ID= ?1 "
            + "GROUP BY s.name ORDER BY s.position ASC", nativeQuery = true)
    Iterable<StateReport> getStateReporting(Long projectId);

    @Query(value = "select swimlane, state, COUNT(t.id) AS nbTask "
            + "FROM "
            + "    (SELECT sw.id as swimlane_id, s.id as state_id, sw.name AS swimlane, s.name AS state FROM "
            + "        SWIMLANE AS sw,"
            + "        STATE AS s "
            + "    where "
            + "    s.PROJECT_ID= ?1 AND sw.PROJECT_ID = ?1 GROUP BY sw.id, s.id) AS SSW"
            + "    LEFT OUTER JOIN TASK AS t on SSW.state_id = t.STATE_ID and ssw.swimlane_id = t.SWIMLANE_ID"
            + "group by swimlane, state Order by swimlane, state;", nativeQuery = true)
    Iterable<SwimlaneReport> getSwimlaneReporting(Long projectId);

    @Query(value = "SELECT c.name AS category, COUNT(t.id) AS nbTask FROM CATEGORY AS c"
            + " LEFT OUTER JOIN TASK AS t on c.id = t.CATEGORY_ID where c.PROJECT_ID= ?1 "
            + "GROUP BY c.name ORDER BY c.name ASC", nativeQuery = true)
    Iterable<CategoryReport> getCategoryReporting(Long projectId);
}
