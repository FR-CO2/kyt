/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package org.co2.kanban.repository.taskhisto;

import java.util.Date;
import org.co2.kanban.repository.task.Task;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.repository.PagingAndSortingRepository;

/**
 *
 * @author stan
 */
public interface TaskHistoRepository extends PagingAndSortingRepository<TaskHisto, Long>, JpaSpecificationExecutor<TaskHisto>  {

    TaskHisto findByTaskAndDateModif(Task task, Date dateModif);

    Page<TaskHisto> findTop1ByTaskId(Long idTask, Pageable page);
    
    TaskHisto findById(Long idTask);
}
