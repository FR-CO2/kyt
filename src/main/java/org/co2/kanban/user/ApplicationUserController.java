/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package org.co2.kanban.user;

import org.co2.kanban.ControllerViews;
import com.fasterxml.jackson.annotation.JsonView;
import com.fasterxml.jackson.databind.ObjectWriter;
import com.fasterxml.jackson.dataformat.csv.CsvMapper;
import com.fasterxml.jackson.dataformat.csv.CsvSchema;
import java.io.File;
import java.io.IOException;
import java.security.Principal;
import javax.servlet.http.Part;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.FileSystemResource;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.web.bind.annotation.AuthenticationPrincipal;
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
@RequestMapping(value = "/api/user")
public class ApplicationUserController {

    @Autowired
    private ApplicationUserRepository repository;

    @RequestMapping(method = RequestMethod.GET, produces = org.springframework.http.MediaType.APPLICATION_JSON_VALUE)
    @JsonView(ControllerViews.UserList.class)
    public Iterable<ApplicationUser> list() {
        return repository.findAll();
    }

    @RequestMapping(value = "page", method = RequestMethod.GET, produces = org.springframework.http.MediaType.APPLICATION_JSON_VALUE)
    @JsonView(ControllerViews.UserList.class)
    public Page<ApplicationUser> page(Pageable p) {
        return repository.findAll(p);
    }

    @RequestMapping(value = "export", method = RequestMethod.GET, produces = org.springframework.http.MediaType.APPLICATION_OCTET_STREAM_VALUE)
    public FileSystemResource handleFileDownload(@AuthenticationPrincipal Principal user) throws IOException {
        CsvMapper mapper = new CsvMapper();
        CsvSchema schema = mapper.schemaFor(ApplicationUser.class);
        ObjectWriter writer = mapper.writer(schema.withLineSeparator("\n"));
        File exportUsers = new File("export-users.csv");
        Iterable<ApplicationUser> users = repository.findAll();
        writer.writeValue(exportUsers, users);
        return new FileSystemResource(exportUsers);
    }

    @RequestMapping(value = "import", method = RequestMethod.POST, consumes = org.springframework.http.MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity handleFileUpload(@RequestParam(value = "importfile", required = false) Part file) throws IOException {
        
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @RequestMapping(method = RequestMethod.POST, produces = org.springframework.http.MediaType.APPLICATION_JSON_VALUE)
    @JsonView(ControllerViews.CreateUser.class)
    public ResponseEntity<ApplicationUser> create(@RequestBody ApplicationUser newUser) {
        return new ResponseEntity<>(repository.save(newUser), HttpStatus.CREATED);
    }

    @RequestMapping(value = "{id}", method = RequestMethod.GET, produces = org.springframework.http.MediaType.APPLICATION_JSON_VALUE)
    @JsonView(ControllerViews.User.class)
    public ResponseEntity<ApplicationUser> get(@PathVariable("id") Long userId) {
        return new ResponseEntity<>(repository.findOne(userId), HttpStatus.OK);
    }

    @RequestMapping(value = "{id}", method = RequestMethod.DELETE, produces = org.springframework.http.MediaType.APPLICATION_JSON_VALUE)
    @JsonView(ControllerViews.User.class)
    public ResponseEntity delete(@PathVariable("id") Long userId) {
        repository.delete(userId);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

}
