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

    @Query(value = "SELECT MAX(s.position) + 1 FROM swimlane s where s.project_id = ?1", nativeQuery = true)
    Long getProjectMaxPosition(Long projectId);
}
