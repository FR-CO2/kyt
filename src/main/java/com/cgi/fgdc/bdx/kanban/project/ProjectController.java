/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.cgi.fgdc.bdx.kanban.project;

import com.cgi.fgdc.bdx.kanban.ControllerViews;
import com.cgi.fgdc.bdx.kanban.project.state.State;
import com.fasterxml.jackson.annotation.JsonView;
import com.fasterxml.jackson.databind.ObjectWriter;
import com.fasterxml.jackson.dataformat.csv.CsvMapper;
import com.fasterxml.jackson.dataformat.csv.CsvSchema;
import java.io.File;
import java.io.IOException;
import javax.servlet.http.Part;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.FileSystemResource;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

/**
 *
 * @author ben
 */
@RestController
@RequestMapping(value = "/api/project")
public class ProjectController {

    @Autowired
    private ProjectRepository repository;

    @RequestMapping(method = RequestMethod.GET, produces = org.springframework.http.MediaType.APPLICATION_JSON_VALUE)
    @JsonView(ControllerViews.ProjectList.class)
    public Page<Project> list(Pageable p) {
        return repository.findAll(p);
    }

@RequestMapping(value = "export", method = RequestMethod.GET, produces = org.springframework.http.MediaType.APPLICATION_OCTET_STREAM_VALUE)
    public FileSystemResource handleFileDownload() throws IOException {
        CsvMapper mapper = new CsvMapper();
        CsvSchema schema = mapper.schemaFor(Project.class);
        ObjectWriter writer = mapper.writer(schema.withLineSeparator("\n"));
        File exportProjects = new File("export-projects.csv");
        Iterable<Project> users = repository.findAll();
        try {
            writer.writeValue(exportProjects,users );
        } catch (IOException e) {
            e.printStackTrace();
        }
        return new FileSystemResource(exportProjects);
    }

    @RequestMapping(value = "import", method = RequestMethod.POST, consumes = org.springframework.http.MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity handleFileUpload(@RequestParam(value = "importfile", required = false) Part file) throws IOException {
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @RequestMapping(method = RequestMethod.POST, produces = org.springframework.http.MediaType.APPLICATION_JSON_VALUE)
    @JsonView(ControllerViews.Project.class)
    public ResponseEntity<Project> create(@RequestBody Project newProject) {
        newProject.setStates(State.getDefaults(newProject));
        Project result = repository.save(newProject);
        return new ResponseEntity<>(result, HttpStatus.CREATED);
    }

    @RequestMapping(value = "{id}", method = RequestMethod.GET, produces = org.springframework.http.MediaType.APPLICATION_JSON_VALUE)
    @JsonView(ControllerViews.Project.class)
    public ResponseEntity<Project> get(@PathVariable("id") Long projectId) {
        return new ResponseEntity<>(repository.findOne(projectId), HttpStatus.OK);
    }

    @RequestMapping(value = "{id}", method = RequestMethod.DELETE, produces = org.springframework.http.MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity delete(@PathVariable("id") Long projectId) {
        repository.delete(projectId);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

}
