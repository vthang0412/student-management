package com.example.studentmanagement.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

import java.time.LocalDate;

public record StudentRequest(
        @NotBlank(message = "Mã sinh viên không được để trống")
        @Size(max = 20, message = "Mã sinh viên tối đa 20 ký tự")
        String studentCode,

        @NotBlank(message = "Họ tên không được để trống")
        @Size(max = 100, message = "Họ tên tối đa 100 ký tự")
        String fullName,

        @Size(max = 100, message = "Email tối đa 100 ký tự")
        String email,

        @Size(max = 20, message = "Số điện thoại tối đa 20 ký tự")
        String phone,

        LocalDate dateOfBirth,

        @Size(max = 20, message = "Giới tính tối đa 20 ký tự")
        String gender,

        @Size(max = 255, message = "Địa chỉ tối đa 255 ký tự")
        String address
) {
}