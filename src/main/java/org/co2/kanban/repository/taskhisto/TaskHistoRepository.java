/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package org.co2.kanban.repository.taskhisto;

import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import com.oberasoftware.jasdb.api.entitymapper.EntityManager;
import nl.renarj.jasdb.api.DBSession;
import nl.renarj.jasdb.api.SimpleEntity;
import nl.renarj.jasdb.api.model.EntityBag;
import nl.renarj.jasdb.api.query.QueryBuilder;
import nl.renarj.jasdb.api.query.QueryExecutor;
import nl.renarj.jasdb.api.query.QueryResult;
import nl.renarj.jasdb.core.exceptions.JasDBStorageException;
import org.co2.kanban.repository.task.Task;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.stereotype.Component;

/**
 *
 * @author stan
 */
@Component
public class TaskHistoRepository {

    @Autowired
    static DBSession session;

    public static TaskHisto findByTaskAndDateModif(Task task, Date dateModif) throws JasDBStorageException {
        EntityManager entityManager = session.getEntityManager();
        QueryBuilder query = QueryBuilder.createBuilder().field("taskId").value(task.getId())
                .field("dateModif").value(dateModif.toString());
        List<TaskHisto> tasksHisto = entityManager.findEntities(TaskHisto.class, query);
        if(tasksHisto.isEmpty()){
            return new TaskHisto();
        }
        return tasksHisto.get(0);
    }

    public static List<TaskHisto> findTop1ByTaskId(Long idTask, int limitVal) throws JasDBStorageException {
        EntityBag bag = session.getBag("KYT_TASK_HISTO");
        QueryExecutor executor = bag.find(QueryBuilder.createBuilder().createBuilder().field("taskId")
                .value(idTask));
        executor.limit(limitVal);
        QueryResult result = executor.execute();
        List<TaskHisto> tasksHisto = new ArrayList<>();
        for(SimpleEntity entity : result){
            TaskHisto taskHisto = new TaskHisto();
            taskHisto.setId(Long.parseLong(entity.getValue("id").toString()));
            taskHisto.setTaskId(Long.parseLong(entity.getValues("taskId").toString()));
            taskHisto.setVersionId(Long.parseLong(entity.getValues("versionId").toString()));
            taskHisto.setProjectId(Long.parseLong(entity.getValues("projectId").toString()));
            taskHisto.setStateId(Long.parseLong(entity.getValues("stateId").toString()));
            taskHisto.setSwinlameId(Long.parseLong(entity.getValues("swinlameId").toString()));
            taskHisto.setCategoryId(Long.parseLong(entity.getValues("categoryId").toString()));
            taskHisto.setDateModif((Timestamp)entity.getValues("dateModif"));
            taskHisto.setUserIdWriter(Long.parseLong(entity.getValues("userIdWriter").toString()));
            taskHisto.setUsernameWriter(entity.getValues("usernameWriter").toString());
            taskHisto.setActionValue(Integer.valueOf(entity.getValues("actionId").toString()).intValue());
            tasksHisto.add(taskHisto);
        }
        return tasksHisto;
    }

    public static TaskHisto findById(Long idTask) throws JasDBStorageException {
        EntityManager entityManager = session.getEntityManager();
        return entityManager.findEntity(TaskHisto.class, idTask.toString());
    }

    public static void save(TaskHisto taskHisto) throws  JasDBStorageException{
        EntityManager entityManager = session.getEntityManager();
        entityManager.persist(taskHisto);
    }
}

