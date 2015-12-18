/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package org.co2.kanban.repository.task;

import org.co2.kanban.repository.project.Project;
import org.co2.kanban.repository.user.ApplicationUser;
import java.util.Date;
import org.co2.kanban.repository.category.Category;
import org.co2.kanban.repository.state.State;
import org.co2.kanban.repository.swimlane.Swimlane;
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

    Iterable<Task> findByProjectAndStateAndSwimlane(Project project, State state, Swimlane swimlane);
    
    Iterable<Task> findByProjectAndState(Project project, State state);
        
    Iterable<Task> findByProjectAndStateAndSwimlaneIsNull(Project project, State state);

    Page<Task> findByProject(Project project, Pageable p);

    Page<Task> findByStateCloseStateFalseAndAssigneeUserOrBackupUser(ApplicationUser user, ApplicationUser backup, Pageable p);

    Iterable<Task> findByAssigneeUserAndStateCloseStateFalseAndPlannedEndingBetweenOrPlannedStartBetween(ApplicationUser user, Date endAfter, Date endBefore, Date startAfter, Date startBefore);
    
    Iterable<Task> findByAssigneeUserAndPlannedEndingAfterAndPlannedStartBefore(ApplicationUser user, Date endAfter, Date startBefore);
}
