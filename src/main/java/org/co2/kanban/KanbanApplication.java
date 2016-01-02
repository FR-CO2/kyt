/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package org.co2.kanban;

import java.util.Locale;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.EnableAutoConfiguration;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.ConfigurableApplicationContext;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;
import org.springframework.hateoas.config.EnableHypermediaSupport;
import org.springframework.security.config.annotation.method.configuration.EnableGlobalMethodSecurity;
import org.springframework.web.servlet.LocaleResolver;
import org.springframework.web.servlet.i18n.FixedLocaleResolver;

/**
 *
 * @author ben
 */
@SpringBootApplication
@EnableGlobalMethodSecurity(prePostEnabled = true)
@EnableAutoConfiguration
@EnableJpaAuditing
@EnableHypermediaSupport(type = EnableHypermediaSupport.HypermediaType.HAL)
@ComponentScan
public class KanbanApplication {

    public static void main(String[] args) throws Exception {
        ConfigurableApplicationContext context = SpringApplication.run(KanbanApplication.class, args);
    }

    @Bean
    public LocaleResolver localeResolver() {
        FixedLocaleResolver slr = new FixedLocaleResolver();
        slr.setDefaultLocale(Locale.FRENCH);
        return slr;
    }
}
