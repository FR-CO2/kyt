/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package org.co2.kanban.repository.task;

import java.sql.Timestamp;
import org.co2.kanban.repository.project.Project;
import org.co2.kanban.repository.user.ApplicationUser;
import org.co2.kanban.repository.state.State;
import org.co2.kanban.repository.swimlane.Swimlane;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.PagingAndSortingRepository;

/**
 *
 * @author ben
 */
public interface TaskRepository extends PagingAndSortingRepository<Task, Long>, JpaSpecificationExecutor<Task> {

    Iterable<Task> findByProjectAndStateKanbanHideFalse(Project project);

    Iterable<Task> findByProject(Project project);

    Iterable<Task> findByProjectAndSwimlaneIsNull(Project project);

    Iterable<Task> findByProjectAndStateAndSwimlaneAndDeletedIsFalse(Project project, State state, Swimlane swimlane);

    Iterable<Task> findByProjectAndState(Project project, State state);

    Iterable<Task> findByProjectAndSwimlane(Project project, Swimlane swimlane);

    Iterable<Task> findByProjectAndStateAndSwimlaneIsNullAndDeletedIsFalse(Project project, State state);

    Page<Task> findByProject(Project project, Pageable p);

    Page<Task> findByAssigneesUserAndStateCloseStateFalse(ApplicationUser user, Pageable p);

    Iterable<Task> findByAssigneesUserAndNameContainingAndStateCloseStateFalse(ApplicationUser user, String term);

    Iterable<Task> findByAssigneesUserAndPlannedStartBeforeAndPlannedEndingAfterAndStateCloseStateFalse(ApplicationUser user, Timestamp startBefore, Timestamp endAfter);

    Iterable<Task> findByprojectAndNameContaining(Project project, String term);

    @Query("select u from #{#entityName} u where u.project = ?1 and str(u.id) like %?2%")
    Iterable<Task> findByprojectAndIdContaining(Project project, String id);
}
