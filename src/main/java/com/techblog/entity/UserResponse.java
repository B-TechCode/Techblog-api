package com.techblog.entity;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class UserResponse {

    private int id;
    private String name;
    private String email;
    private String gender;
    private String about;
    private String profilePic;
}