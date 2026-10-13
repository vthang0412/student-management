package com.example.studentmanagement.service;

import com.example.studentmanagement.dto.StudentRequest;
import com.example.studentmanagement.entity.Student;
import com.example.studentmanagement.repository.StudentRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
public class StudentService {

    private final StudentRepository repository;

    public StudentService(StudentRepository repository) {
        this.repository = repository;
    }

    public List<Student> getAll(String keyword) {
        if (keyword == null || keyword.isBlank()) {
            return repository.findAll();
        }

        String value = keyword.trim();
        return repository
                .findByStudentCodeContainingIgnoreCaseOrFullNameContainingIgnoreCase(
                        value, value
                );
    }

    public Student getById(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Không tìm thấy sinh viên ID: " + id
                ));
    }

    @Transactional
    public Student create(StudentRequest request) {
        if (repository.existsByStudentCode(request.studentCode().trim())) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT, "Mã sinh viên đã tồn tại"
            );
        }

        Student student = new Student();
        copyRequest(request, student);
        return repository.save(student);
    }

    @Transactional
    public Student update(Long id, StudentRequest request) {
        Student student = getById(id);

        if (repository.existsByStudentCodeAndIdNot(
                request.studentCode().trim(), id)) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT, "Mã sinh viên đã thuộc về sinh viên khác"
            );
        }

        copyRequest(request, student);
        return repository.save(student);
    }

    @Transactional
    public void delete(Long id) {
        Student student = getById(id);
        repository.delete(student);
    }

    private void copyRequest(StudentRequest request, Student student) {
        student.setStudentCode(request.studentCode().trim());
        student.setFullName(request.fullName().trim());
        student.setEmail(clean(request.email()));
        student.setPhone(clean(request.phone()));
        student.setDateOfBirth(request.dateOfBirth());
        student.setGender(clean(request.gender()));
        student.setAddress(clean(request.address()));
    }

    private String clean(String value) {
        if (value == null || value.isBlank()) {
            return null;
        }
        return value.trim();
    }
}