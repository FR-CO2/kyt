/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.cgi.fgdc.bdx.kanban.project.task;

import com.cgi.fgdc.bdx.kanban.project.Project;
import com.cgi.fgdc.bdx.kanban.user.ApplicationUser;
import java.sql.Timestamp;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.repository.PagingAndSortingRepository;

/**
 *
 * @author ben
 */
public interface TaskRepository extends PagingAndSortingRepository<Task, Long> {

    Iterable<Task> findByProjectAndStateKanbanHideFalse(Project project);

    Iterable<Task> findByProject(Project project);

    Page<Task> findByProject(Project project, Pageable p);

    Page<Task> findByAssigneeUserOrBackupUser(ApplicationUser user, ApplicationUser backup, Pageable p);

    Iterable<Task> findByAssigneeUserAndPlannedStartLessThanAndPlannedEndingGreaterThan(ApplicationUser user, Timestamp startBefore, Timestamp endAfter);
}
