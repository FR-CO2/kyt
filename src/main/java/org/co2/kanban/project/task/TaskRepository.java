/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package org.co2.kanban.project.task;

import org.co2.kanban.project.Project;
import org.co2.kanban.user.ApplicationUser;
import java.util.Date;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.PagingAndSortingRepository;

/**
 *
 * @author ben
 */
public interface TaskRepository extends PagingAndSortingRepository<Task, Long> {

    Iterable<Task> findByProjectAndStateKanbanHideFalse(Project project);

    Iterable<Task> findByProject(Project project);
    
    @Query("select t from Task t where UPPER(t.name) like %?1% and "
            + "assignee.user = ?3 and (t.plannedStart > ?2 or t.plannedEnding < ?2)")
    Iterable<Task> searchByName(String name,Date dateTask, ApplicationUser appUser);

    Page<Task> findByProject(Project project, Pageable p);

    Page<Task> findByStateCloseStateFalseAndAssigneeUserOrBackupUser(ApplicationUser user, ApplicationUser backup, Pageable p);

    Iterable<Task> findByAssigneeUserAndStateCloseStateFalseAndPlannedEndingBetweenOrPlannedStartBetween(ApplicationUser user, Date endAfter, Date endBefore, Date startAfter, Date startBefore);
    
    Iterable<Task> findByAssigneeUserAndPlannedEndingAfterAndPlannedStartBefore(ApplicationUser user, Date endAfter, Date startBefore);
}
