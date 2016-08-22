/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package org.co2.kanban.repository.config;

import java.io.Serializable;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;
import javax.persistence.TableGenerator;
import org.co2.kanban.repository.Identifiable;

/**
 *
 * @author ben
 */
@Entity
@Table(name = "KYT_API_PARAMETER")
public class Parameter implements Serializable, Identifiable {

    private static final long serialVersionUID = -7133694782401886935L;

    @TableGenerator(
            name = "config_generator", table = "kyt_internal_sequence", pkColumnName = "sequence_name",
            valueColumnName = "sequence_next_hi_value", pkColumnValue = "config_generator")
    @Id
    @GeneratedValue(generator = "config_generator", strategy = GenerationType.TABLE)
    private Long id;

    private ParameterType category;
    private String keyParam;
    private String valueParam;

    @Override
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getKeyParam() {
        return this.keyParam;
    }

    public void setKeyParam(String key) {
        this.keyParam = key;
    }

    public void setValueParam(String value) {
        this.valueParam = value;
    }

    public String getValueParam() {
        return this.valueParam;
    }

    public ParameterType getCategory() {
        return category;
    }

    public void setType(ParameterType category) {
        this.category = category;
    }

}
