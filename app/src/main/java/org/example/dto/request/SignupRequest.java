package org.example.dto.request;

import lombok.Data;
import org.example.enums.Role;

@Data
public class SignupRequest {

    private String username;

    private String password;

    private String fullName;

    private String email;

    private Role role;

    private String branch;

    private Integer batchYear;

    private String invitationKey;

    private String companyName;

    private String website;

    private String location;
}