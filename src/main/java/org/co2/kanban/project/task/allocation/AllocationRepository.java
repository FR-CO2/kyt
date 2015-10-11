/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package org.co2.kanban.project.task.allocation;

import org.co2.kanban.project.security.Member;
import java.util.Date;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.PagingAndSortingRepository;

/**
 *
 * @author ben
 */
public interface AllocationRepository extends PagingAndSortingRepository<Allocation, Long> {

    @Query(value = "SELECT MAX(a.id) + 1 FROM allocation a where a.project_id = ?1", nativeQuery = true)
    Long getProjectMaxPosition(Long projectId);

    @Query(value = "select a from Allocation a WHERE a.member = ?1")
    Iterable<Allocation> getListAllocationBeetweenPlannedStartAndPlannedEnding(Member member);

    Iterable<Allocation> findByTaskId(Long taskId);
}
