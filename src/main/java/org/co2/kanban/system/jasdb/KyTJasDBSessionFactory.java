package org.co2.kanban.system.jasdb;

import nl.renarj.jasdb.LocalDBSessionFactory;
import nl.renarj.jasdb.api.DBSession;
import nl.renarj.jasdb.api.DBSessionFactory;
import nl.renarj.jasdb.api.context.Credentials;
import nl.renarj.jasdb.core.SimpleKernel;
import nl.renarj.jasdb.core.exceptions.JasDBException;
import nl.renarj.jasdb.core.exceptions.JasDBStorageException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.DisposableBean;
import org.springframework.context.ApplicationContextInitializer;
import org.springframework.context.ConfigurableApplicationContext;
import org.springframework.stereotype.Service;

import javax.annotation.PreDestroy;

/**
 * Created by b.courti on 21/04/2017.
 */
@Service
public class KyTJasDBSessionFactory implements ApplicationContextInitializer, DBSessionFactory, DisposableBean {

    private DBSessionFactory sessionFactory = new LocalDBSessionFactory();

    private static final Logger LOGGER = LoggerFactory.getLogger(KyTJasDBSessionFactory.class);

    public void initialize(ConfigurableApplicationContext context) {
        try {
            //Forcible initialize JasDB, can also be lazy loaded on first session created
            SimpleKernel.initializeKernel();
        } catch(JasDBException jex) {
            throw new RuntimeException(jex);
        }
    }

    @Override
    public DBSession createSession() throws JasDBStorageException {
        return sessionFactory.createSession();
    }

    @Override
    public DBSession createSession(String s, Credentials credentials) throws JasDBStorageException {
        return sessionFactory.createSession(s, credentials);
    }

    @Override
    public DBSession createSession(String s) throws JasDBStorageException {
        return sessionFactory.createSession(s);
    }

    @Override
    public DBSession createSession(Credentials credentials) throws JasDBStorageException {
        return sessionFactory.createSession(credentials);
    }

    @Override
    public void shutdown() throws JasDBException {
        sessionFactory.shutdown();
    }

    @Override
    public void destroy() throws Exception {
        try {
            SimpleKernel.shutdown();
            LOGGER.error("shutdown success");
        } catch (JasDBException e) {
            e.printStackTrace();
        }
    }

}
