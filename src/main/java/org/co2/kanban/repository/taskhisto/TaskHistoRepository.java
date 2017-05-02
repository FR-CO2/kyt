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
import nl.renarj.jasdb.api.query.Order;
import nl.renarj.jasdb.api.query.QueryBuilder;
import nl.renarj.jasdb.api.query.QueryExecutor;
import nl.renarj.jasdb.api.query.QueryResult;
import nl.renarj.jasdb.core.exceptions.JasDBException;
import nl.renarj.jasdb.core.exceptions.JasDBStorageException;
import org.co2.kanban.repository.task.Task;
import org.co2.kanban.system.jasdb.KyTJasDBSessionFactory;
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
    private KyTJasDBSessionFactory sessionFactory;

    private DBSession initializedSession() throws JasDBStorageException {
        DBSession session = sessionFactory.createSession();
        session.createOrGetBag("KYT_TASK_HISTO");
        return session;
    }

    public TaskHisto findByTaskAndDateModif(Task task, Date dateModif) throws JasDBStorageException {
        DBSession session = initializedSession();
        EntityManager entityManager = session.getEntityManager();
        QueryBuilder query = QueryBuilder.createBuilder().field("taskId").value(task.getId())
                .field("dateModif").value(dateModif.toString());
        List<TaskHisto> tasksHisto = entityManager.findEntities(TaskHisto.class, query);
        if(tasksHisto.isEmpty()){
            return new TaskHisto();
        }
        return tasksHisto.get(0);
    }

    public List<TaskHisto> findTop1ByTaskId(Long idTask,int page, int next) throws JasDBStorageException {
        DBSession session = initializedSession();
        EntityBag bag = session.getBag("KYT_TASK_HISTO");
        QueryExecutor executor = bag.find(QueryBuilder.createBuilder().createBuilder().field("taskId")
                .value(idTask.toString()).sortBy("versionId", Order.DESCENDING));
        executor.paging(page, next);
        QueryResult result = executor.execute();
        List<TaskHisto> tasksHisto = new ArrayList<>();
        for (SimpleEntity entity : result) {
            TaskHisto taskHisto = new TaskHisto();
            taskHisto.setId(entity.getValue("id").toString());
            taskHisto.setTaskId(entity.getProperty("taskId").getFirstValue().toString());
            taskHisto.setVersionId(entity.getProperty("versionId").getFirstValue().toString());
            taskHisto.setProjectId(entity.getProperty("projectId").getFirstValue().toString());
            taskHisto.setProjectName(entity.getProperty("projectName").getFirstValue().toString());
            if(entity.getProperty("stateId") != null) {
                taskHisto.setStateId(entity.getProperty("stateId").getFirstValue().toString());
                taskHisto.setStateName(entity.getProperty("stateName").getFirstValue().toString());
            }
            if(entity.getProperty("swinlameId") != null) {
                taskHisto.setSwinlameId(entity.getProperty("swinlameId").getFirstValue().toString());
                taskHisto.setSwinlameName(entity.getProperty("swinlameName").getFirstValue().toString());
            }
            if(entity.getProperty("categoryId") != null) {
                taskHisto.setCategoryId(entity.getProperty("categoryId").getFirstValue().toString());
                taskHisto.setCategoryName(entity.getProperty("categoryName").getFirstValue().toString());
            }
            taskHisto.setDateModif(entity.getProperty("dateModif").getFirstValue().toString());
            taskHisto.setUserIdWriter(entity.getProperty("userIdWriter").getFirstValue().toString());
            taskHisto.setUsernameWriter(entity.getProperty("usernameWriter").getFirstValue().toString());
            taskHisto.setActionValue(entity.getProperty("actionValue").getFirstValue().toString());
            if(entity.getProperty("totalAllocations") != null) {
                taskHisto.setTotalAllocations(entity.getProperty("totalAllocations").getFirstValue().toString());
            }
            tasksHisto.add(taskHisto);
        }
    return tasksHisto;
    }

    public TaskHisto findById(Long idTask) throws JasDBStorageException {
        DBSession session = initializedSession();
        EntityManager entityManager = session.getEntityManager();
        return entityManager.findEntity(TaskHisto.class, idTask.toString());
    }

    public void save(TaskHisto taskHisto) throws  JasDBException{
        DBSession session = initializedSession();
        EntityManager entityManager = session.getEntityManager();
        String id = entityManager.persist(taskHisto).getInternalId();
        session.closeSession();
        sessionFactory.shutdown();
    }
}

