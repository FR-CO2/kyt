/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package org.co2.kanban.user;

import org.co2.kanban.ControllerViews;
import com.fasterxml.jackson.annotation.JsonView;
import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.MappingIterator;
import com.fasterxml.jackson.databind.ObjectReader;
import com.fasterxml.jackson.databind.ObjectWriter;
import com.fasterxml.jackson.dataformat.csv.CsvMapper;
import com.fasterxml.jackson.dataformat.csv.CsvParser;
import com.fasterxml.jackson.dataformat.csv.CsvSchema;
import java.io.File;
import java.io.IOException;
import java.security.Principal;
import java.util.ArrayList;
import java.util.List;
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
import org.springframework.web.multipart.MultipartFile;

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
        CsvSchema schema =  mapper.schemaFor(ApplicationUser.class).withHeader().withColumnSeparator(';');
        ObjectWriter writer = mapper.writer(schema);
        writer.withView(ControllerViews.UserList.class);
        File exportUsers = new File("export-users.csv");
        Iterable<ApplicationUser> users = repository.findAll();
        writer.writeValue(exportUsers, users);
        return new FileSystemResource(exportUsers);
    }

    @RequestMapping(value = "import", method = RequestMethod.POST)
    public ResponseEntity handleFileUpload(@RequestParam(value = "file") MultipartFile multipartFile) throws IOException {
        CsvMapper mapper = new CsvMapper();
        mapper.enable(CsvParser.Feature.WRAP_AS_ARRAY);
        CsvSchema schema = CsvSchema.emptySchema().withHeader().withColumnSeparator(';');
        ObjectReader reader = mapper.reader(ApplicationUser.class);
        MappingIterator<ApplicationUser> it = reader.with(schema).readValues(multipartFile.getInputStream());
        List<ApplicationUser> usersImport = new ArrayList<>();
        while (it.hasNext()) {
            ApplicationUser row = it.next();
            ApplicationUser user = repository.findByUsername(row.getUsername());
            if (user == null) {
                usersImport.add(row);
            }
        }
        repository.save(usersImport);
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
