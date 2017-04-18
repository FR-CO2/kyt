/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package org.co2.kanban.repository.taskhisto;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import com.oberasoftware.jasdb.api.entitymapper.EntityManager;
import nl.renarj.jasdb.LocalDBSession;
import nl.renarj.jasdb.api.DBSession;
import nl.renarj.jasdb.api.SimpleEntity;
import nl.renarj.jasdb.api.model.EntityBag;
import nl.renarj.jasdb.api.query.QueryBuilder;
import nl.renarj.jasdb.api.query.QueryExecutor;
import nl.renarj.jasdb.api.query.QueryResult;
import nl.renarj.jasdb.core.exceptions.JasDBStorageException;
import org.co2.kanban.repository.task.Task;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import javax.annotation.PostConstruct;

/**
 *
 * @author stan
 */
@Component
public class TaskHistoRepository {

    @Autowired
    private DBSession session;

    @PostConstruct
    private void initializedSession() throws JasDBStorageException {
        session.createOrGetBag("KYT_TASK_HISTO");
    }

    public TaskHisto findByTaskAndDateModif(Task task, Date dateModif) throws JasDBStorageException {
        initializedSession();
        EntityManager entityManager = session.getEntityManager();
        QueryBuilder query = QueryBuilder.createBuilder().field("taskId").value(task.getId())
                .field("dateModif").value(dateModif.toString());
        List<TaskHisto> tasksHisto = entityManager.findEntities(TaskHisto.class, query);
        if(tasksHisto.isEmpty()){
            return new TaskHisto();
        }
        return tasksHisto.get(0);
    }

    public List<TaskHisto> findTop1ByTaskId(Long idTask, int limitVal) throws JasDBStorageException {
        initializedSession();
        EntityBag bag = session.getBag("KYT_TASK_HISTO");
        QueryExecutor executor = bag.find(QueryBuilder.createBuilder().createBuilder().field("taskId")
                .value(idTask.toString()));
        executor.limit(limitVal);
        QueryResult result = executor.execute();
        List<TaskHisto> tasksHisto = new ArrayList<>();
        for (SimpleEntity entity : result) {
            TaskHisto taskHisto = new TaskHisto();
            taskHisto.setId(entity.getValue("id").toString());
            taskHisto.setTaskId(entity.getProperty("taskId").getFirstValue().toString());
            taskHisto.setVersionId(entity.getProperty("versionId").getFirstValue().toString());
            taskHisto.setProjectId(entity.getProperty("projectId").getFirstValue().toString());
            if(entity.getProperty("stateId") != null) {
                taskHisto.setStateId(entity.getProperty("stateId").getFirstValue().toString());
            }
            if(entity.getProperty("swinlameId") != null) {
                taskHisto.setSwinlameId(entity.getProperty("swinlameId").getFirstValue().toString());
            }
            if(entity.getProperty("categoryId") != null) {
                taskHisto.setCategoryId(entity.getProperty("categoryId").getFirstValue().toString());
            }
            taskHisto.setDateModif(entity.getProperty("dateModif").getFirstValue().toString());
            taskHisto.setUserIdWriter(entity.getProperty("userIdWriter").getFirstValue().toString());
            taskHisto.setUsernameWriter(entity.getProperty("usernameWriter").getFirstValue().toString());
            taskHisto.setActionValue(entity.getProperty("actionValue").getFirstValue().toString());
            tasksHisto.add(taskHisto);
        }
    return tasksHisto;
    }

    public TaskHisto findById(Long idTask) throws JasDBStorageException {
        initializedSession();
        EntityManager entityManager = session.getEntityManager();
        return entityManager.findEntity(TaskHisto.class, idTask.toString());
    }

    public void save(TaskHisto taskHisto) throws  JasDBStorageException{
        initializedSession();
        EntityManager entityManager = session.getEntityManager();
        String id = entityManager.persist(taskHisto).getInternalId();
    }
}

