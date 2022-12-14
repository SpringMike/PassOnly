package intern.sapo.be.dto.response.product;

import intern.sapo.be.entity.Product;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.modelmapper.ModelMapper;
@AllArgsConstructor
@NoArgsConstructor
@Data
public class ProductFilterResponse {
    private Integer id;
    private String code;
    private String name;
    private String description;
    private Integer statusId;
    private Integer supplierId;
    private Integer accountId;
    private java.sql.Timestamp createAt;
    private java.sql.Timestamp updateAt;
    private Boolean isDelete;
    private Integer numberOfVariant;
    private Integer total;

}
