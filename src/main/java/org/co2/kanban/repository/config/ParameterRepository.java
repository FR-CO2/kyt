/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package org.co2.kanban.repository.config;

import org.springframework.data.repository.PagingAndSortingRepository;

/**
 *
 * @author stan
 */
public interface ParameterRepository extends PagingAndSortingRepository<Parameter, Long> {

    Iterable<Parameter> findByCategory(ParameterType category);
    Parameter findByCategoryAndKeyParam(ParameterType category, String keyConfig);
}
