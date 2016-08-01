/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package org.co2.kanban.repository.taskhisto;

import com.fasterxml.jackson.databind.ObjectMapper;
import java.io.IOException;
import javax.persistence.Converter;
import org.co2.kanban.repository.converter.JSONConverter;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 *
 * @author stan
 */
@Converter
public class TaskHistoContentConverter extends JSONConverter<TaskHisto.TaskHistoContent> {

    private static final Logger LOGGER = LoggerFactory.getLogger(TaskHistoContentConverter.class);

    @Override
    public TaskHisto.TaskHistoContent convertToEntityAttribute(String columnValue) {
        if (columnValue != null) {
            try {
                ObjectMapper mapper = new ObjectMapper();
                return mapper.readValue(columnValue, TaskHisto.TaskHistoContent.class);
            } catch (IOException ex) {
                LOGGER.warn("Erreur lors de la conversion JSON du champ commentaire =" + columnValue, ex);
            }
        }
        return null;
    }

}
