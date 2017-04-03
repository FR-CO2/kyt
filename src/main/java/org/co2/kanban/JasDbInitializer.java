package org.co2.kanban;

import nl.renarj.jasdb.api.DBSession;
import nl.renarj.jasdb.core.SimpleKernel;
import nl.renarj.jasdb.core.exceptions.JasDBException;
import org.springframework.context.ApplicationContextInitializer;
import org.springframework.context.ConfigurableApplicationContext;
import org.springframework.stereotype.Service;

/**
 * Created by s.granel on 30/03/2017.
 */
@Service
public class JasDbInitializer implements ApplicationContextInitializer {

    public void initialize(ConfigurableApplicationContext context) {
        try {
            //Forcible initialize JasDB, can also be lazy loaded on first session created
            SimpleKernel.initializeKernel();
        } catch(JasDBException jex) {
            throw new RuntimeException(jex);
        }
    }
}
