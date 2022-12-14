package intern.sapo.be.controller;

import intern.sapo.be.entity.ReturnImport;
import intern.sapo.be.service.IReturnImportService;
import lombok.AllArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@AllArgsConstructor
@RequestMapping("/api/return_import")
@CrossOrigin("*")
public class ReturnImportController {

    private final IReturnImportService returnImportService;

    @PostMapping("/{inventoryId}")
    public void save(@RequestBody ReturnImport returnImport, @PathVariable Integer inventoryId) {
        ReturnImport returnImport1 = returnImportService.save(returnImport);
        returnImportService.saveAllDetails(returnImport.getDetailsReturnImports(), inventoryId, returnImport1.getId());
    }
}
